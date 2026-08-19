#!/usr/bin/env node
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzip, brotliCompress, constants } from "node:zlib";
import { promisify } from "node:util";

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

const ROOT = fileURLToPath(new URL("../.output/public/", import.meta.url));

const I18N_OBJECT_RE = /,?\{[^{}]*"?path"?:"[^"]*\/i18n\/locales\/[^"]*"[^{}]*\},?/g;

const walk = async function* (dir) {
    const entries = await readdir(dir);
    for (const entry of entries) {
        const full = join(dir, entry);
        const s = await stat(full);
        if (s.isDirectory()) yield* walk(full);
        else if (s.isFile() && (full.endsWith(".html") || full.endsWith(".js"))) yield full;
    }
};

let touchedHtml = 0;
let touchedJs = 0;
let totalBytesStripped = 0;

for await (const file of walk(ROOT)) {
    const before = await readFile(file, "utf8");
    const after = before.replace(I18N_OBJECT_RE, "");
    if (after.length === before.length) continue;

    await writeFile(file, after, "utf8");
    if (file.endsWith(".html")) touchedHtml++;
    else touchedJs++;
    totalBytesStripped += before.length - after.length;

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
    `[strip-leaked-paths] cleaned ${touchedHtml} HTML + ${touchedJs} JS files, ` +
        `removed ${totalBytesStripped.toLocaleString()} bytes of leaked i18n absolute paths ` +
        `(re-compressed .gz + .br).`,
);
