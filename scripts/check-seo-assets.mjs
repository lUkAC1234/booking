#!/usr/bin/env node
// Fails the build on the six defects that silently broke link previews and the
// Google favicon for a week after launch:
//   1. 200.html in the output -> Vercel serves it for every unknown path with HTTP 200 (soft-404)
//   2. og:image pointing at a file that is not in the output (it 404s, or worse, soft-404s to HTML)
//   3. og:image heavier than WhatsApp's ~600 KB cutoff (a 1.9 MB PNG shipped and killed every preview)
//   4. og:image:width/height lying about the real pixels (1200x630 declared, 1730x909 shipped)
//   5. rel="icon" in a format Google Search cannot read (an SVG favicon shipped; Google ignores SVG)
//   6. a non-square favicon (1358x1159 shipped; Google requires 1:1)
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../.output/public/", import.meta.url));
const WHATSAPP_MAX_BYTES = 600 * 1024;
// https://developers.google.com/search/docs/appearance/favicon-in-search — SVG is NOT on the list
const GOOGLE_FAVICON_TYPES = new Set(["png", "jpeg", "gif", "ico", "bmp", "tiff"]);
const SOCIAL_OG_TYPES = new Set(["png", "jpeg", "webp"]);

const errors = [];
const fail = (msg) => errors.push(msg);
let ogSummary = "unknown";

/** @returns {{type: string, width: number, height: number} | null} */
const probe = (buf) => {
    if (buf.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") {
        return { type: "png", width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
        for (let i = 2; i < buf.length - 9; ) {
            if (buf[i] !== 0xff) {
                i++;
                continue;
            }
            const marker = buf[i + 1];
            const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
            if (isSof) {
                return { type: "jpeg", height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
            }
            i += 2 + buf.readUInt16BE(i + 2);
        }
        return { type: "jpeg", width: 0, height: 0 };
    }
    if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") {
        return { type: "webp", width: 0, height: 0 };
    }
    if (buf.subarray(0, 4).toString("hex") === "00000100") return { type: "ico", width: 0, height: 0 };
    if (buf.subarray(0, 6).toString() === "GIF89a") return { type: "gif", width: 0, height: 0 };
    if (buf.subarray(0, 200).toString().includes("<svg")) return { type: "svg", width: 0, height: 0 };
    return null;
};

/** Resolve a URL from the <head> back to the file the deploy will actually serve. */
const asset = (url) => {
    const path = url.replace(/^https?:\/\/[^/]+/, "").split(/[?#]/)[0];
    const file = join(ROOT, path);
    return existsSync(file) ? { path, file, buf: readFileSync(file) } : { path, file, buf: null };
};

const attr = (html, re) => (html.match(re) || [])[1];

if (existsSync(join(ROOT, "200.html"))) {
    fail(
        "200.html is back in the output — Vercel will serve it for every unknown path with HTTP 200 (site-wide soft-404). See the //build note in package.json.",
    );
}

const homepage = join(ROOT, "index.html");
if (!existsSync(homepage)) {
    fail("index.html was not prerendered — nothing to validate.");
} else {
    const html = readFileSync(homepage, "utf8");

    const ogUrl = attr(html, /<meta property="og:image" content="([^"]+)"/);
    if (!ogUrl) {
        fail("no og:image on the homepage.");
    } else {
        const { path, buf } = asset(ogUrl);
        const declaredW = Number(attr(html, /<meta property="og:image:width" content="([^"]+)"/));
        const declaredH = Number(attr(html, /<meta property="og:image:height" content="([^"]+)"/));

        if (!buf) {
            fail(`og:image ${path} is not in the output — messengers will get the 404 page, not an image.`);
        } else {
            const info = probe(buf);
            ogSummary = `${path} ${(buf.length / 1024).toFixed(0)} KB (limit 600), ${info?.width}x${info?.height}`;
            if (!info || !SOCIAL_OG_TYPES.has(info.type)) {
                fail(
                    `og:image ${path} is "${info?.type ?? "unrecognised"}" — messengers accept only PNG, JPEG or WebP.`,
                );
            }
            if (buf.length > WHATSAPP_MAX_BYTES) {
                fail(
                    `og:image ${path} is ${(buf.length / 1024).toFixed(0)} KB — over WhatsApp's ~600 KB cutoff, the preview will render with no image.`,
                );
            }
            if (info?.width && (info.width !== declaredW || info.height !== declaredH)) {
                fail(
                    `og:image ${path} is ${info.width}x${info.height} but og:image:width/height claim ${declaredW}x${declaredH}.`,
                );
            }
        }
    }

    const iconUrl = attr(html, /<link rel="icon"[^>]*href="([^"]+)"/);
    if (!iconUrl) {
        fail('no <link rel="icon"> on the homepage — Google has nothing to show next to the result.');
    } else {
        const { path, buf } = asset(iconUrl);
        if (!buf) {
            fail(`favicon ${path} is not in the output.`);
        } else {
            const info = probe(buf);
            if (!info || !GOOGLE_FAVICON_TYPES.has(info.type)) {
                fail(
                    `favicon ${path} is "${info?.type ?? "unrecognised"}" — Google Search cannot read it (BMP, GIF, ICO, PNG, JPEG, PPM, TIFF only).`,
                );
            }
            if (info?.width && info.width !== info.height) {
                fail(`favicon ${path} is ${info.width}x${info.height} — Google requires a square (1:1) favicon.`);
            }
        }
    }
}

if (errors.length > 0) {
    console.error("[check-seo-assets] FAILED:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
}

console.log(
    `[check-seo-assets] ok — og:image ${ogSummary}, ` +
        `favicon square and in a Google-supported format, no 200.html soft-404 fallback.`,
);
