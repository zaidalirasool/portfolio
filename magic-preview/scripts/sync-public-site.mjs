#!/usr/bin/env node
/**
 * Pulls static assets into public/site/ so Vite dev/build serves /site/… paths used by App.tsx.
 * Hero is copied from repo `assets/site/hero-portrait.jpg` (same as root `index.html`).
 * Rhizhome gallery final slide art is copied from `assets/site/rhizhome-6.png` (succulent reference).
 * Other sources: framerusercontent.com + Wikimedia / RGD logos.
 */
import { statSync } from "node:fs";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "site");
/** Same file as root `index.html` hero (`assets/site/hero-portrait.jpg`). */
const REPO_HERO = join(__dirname, "..", "..", "assets", "site", "hero-portrait.jpg");
/** Last Rhizhome hover-gallery slide (local succulent photo). */
const REPO_RHIZHOME_6 = join(__dirname, "..", "..", "assets", "site", "rhizhome-6.png");

const UA =
  "Mozilla/5.0 (compatible; magic-preview-asset-sync/1.0; +https://example.local)";

const FR = "https://framerusercontent.com/images";

/** @type {readonly [string, string][]} */
const FILES = [
  // Born & raised — order matches live Framer homepage hover gallery (A → … → E).
  ["mumbai.jpg", `${FR}/TUk31SMddNEZ6hA4bQatZmXLU.png`],
  ["mumbai-street.png", `${FR}/ALkb2ctuYMk8WGYYjgeKhgpWFbw.png`],
  ["mumbai-aerial.png", `${FR}/gZK6cb0C9lft5TZxrtWtRi4ZgSg.png`],
  ["mumbai-taj-palace.png", `${FR}/6noHg4fOajGgqdAIYZZu9BZ8dtw.png`],
  ["mumbai-central-night.png", `${FR}/f7T2UiGjZKN96tHQ1Z6pr6FuE.png`],
  ["canada-1.png", `${FR}/7RHGbkUt5ZnQM2bNNu0DIEcIc.png`],
  ["canada-2.png", `${FR}/sJ4qVG6LgHqv8HiRf7xVGi9PTv0.png`],
  ["canada-3.png", `${FR}/acHO0LgAcyCMyCSumQQc7LdmMAA.png`],
  ["rhizhome-1.png", `${FR}/y2GXcjQUBLlGUs8sP3DpyI5I.png`],
  ["rhizhome-2.png", `${FR}/zFFm7Pxp2gJqwQa0ZwvMCjQyyg.png`],
  ["rhizhome-3.png", `${FR}/20FaRI05cVD4zLF6fg892pOSD2M.png`],
  ["rhizhome-4.png", `${FR}/IgLR5M3qITMfEUWfhgaUXxsvAxs.png`],
  ["rhizhome-5.png", `${FR}/vPPUtj5xx65Tr4qe2ILhfErrhnk.png`],
  // Case study / metrics imagery (from published homepage).
  ["complexity-canvas.jpg", `${FR}/MAqJGfuAv13sZ3dF0HRReDCD0I.png`],
  ["wizard-ui.jpg", `${FR}/BBLsIaG7Mcxd6JTfVoHrx68RYAw.png`],
  ["spark-system.jpg", `${FR}/oAkcfW9hYxQaXiAaTq9HEECOYpc.png`],
  ["tokens.jpg", `${FR}/Eiekqvj4NeA8jjeOmpWzsdDnEIg.png`],
  // Marquee logos (SVG). DSAC slot uses RGD mark as a Canadian designers stand-in for local preview.
  [
    "shopify.svg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
  ],
  [
    "amazon.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  ],
  [
    "costco.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/59/Costco_Wholesale_logo_2010-10-26.svg",
  ],
  ["dsac.svg", "https://www.rgd.ca/assets/images/utility/rgd-logo-red.svg"],
];

async function fetchBuf(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} ← ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const heroDest = join(OUT, "hero-portrait.jpg");
  process.stdout.write("hero-portrait.jpg … ");
  await copyFile(REPO_HERO, heroDest);
  console.log(`${statSync(heroDest).size} bytes (from assets/site)`);

  const rhizDest = join(OUT, "rhizhome-6.png");
  process.stdout.write("rhizhome-6.png … ");
  await copyFile(REPO_RHIZHOME_6, rhizDest);
  console.log(`${statSync(rhizDest).size} bytes (from assets/site)`);

  for (const [name, url] of FILES) {
    const dest = join(OUT, name);
    process.stdout.write(`${name} … `);
    const buf = await fetchBuf(url);
    await writeFile(dest, buf);
    console.log(`${buf.length} bytes`);
  }
  console.log(`Done. Hero + rhizhome-6 + ${FILES.length} remote files → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
