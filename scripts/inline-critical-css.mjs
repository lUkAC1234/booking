#!/usr/bin/env node
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzip, brotliCompress, constants } from "node:zlib";
import { promisify } from "node:util";

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

const ROOT = fileURLToPath(new URL("../.output/public/", import.meta.url));

const STYLESHEET_LINK_RE = /<link\b[^>]*\brel="stylesheet"[^>]*>/gi;
const HREF_RE = /\bhref="([^"]+)"/i;

const walk = async function* (dir) {
    const entries = await readdir(dir);
    for (const entry of entries) {
        const full = join(dir, entry);
        const s = await stat(full);
        if (s.isDirectory()) yield* walk(full);
        else if (s.isFile() && full.endsWith(".html")) yield full;
    }
};

const cssCache = new Map();
const readCss = async (href) => {
    if (cssCache.has(href)) return cssCache.get(href);
    const abs = join(ROOT, href.replace(/^\//, ""));
    let css = "";
    try {
        css = await readFile(abs, "utf8");
    } catch {
        css = "";
    }
    cssCache.set(href, css);
    return css;
};

let touched = 0;
let totalBytesInlined = 0;

for await (const file of walk(ROOT)) {
    const before = await readFile(file, "utf8");
    const links = before.match(STYLESHEET_LINK_RE);
    if (!links || links.length === 0) continue;

    const seen = new Set();
    const cssParts = [];
    for (const link of links) {
        const href = link.match(HREF_RE)?.[1];
        if (!href || seen.has(href)) continue;
        seen.add(href);
        const css = await readCss(href);
        if (css) cssParts.push(css);
    }
    if (cssParts.length === 0) continue;

    const styleTag = `<style>${cssParts.join("")}</style>`;
    let injected = false;
    const after = before.replace(STYLESHEET_LINK_RE, () => {
        if (injected) return "";
        injected = true;
        return styleTag;
    });
    if (after === before) continue;

    await writeFile(file, after, "utf8");
    touched++;
    totalBytesInlined += styleTag.length;

    const buf = Buffer.from(after, "utf8");
    const [gz, br] = await Promise.all([
        gzipAsync(buf, { level: 9 }),
        brotliAsync(buf, {
            params: {
                [constants.BROTLI_PARAM_QUALITY]: 11,
                [constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
            },
        }),
    ]);
    await Promise.all([writeFile(`${file}.gz`, gz), writeFile(`${file}.br`, br)]);
}

console.log(
    `[inline-critical-css] folded render-blocking CSS into ${touched} HTML files ` +
        `(${totalBytesInlined.toLocaleString()} bytes inlined, re-compressed .gz + .br).`,
);
