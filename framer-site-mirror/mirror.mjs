import scrape from "website-scraper";
import defaultOptions from "website-scraper/defaultOptions";
import {
  rmSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "site");

const ORIGIN = "https://thrilled-share-128540.framer.app";

/**
 * Only routes that return HTTP 200 on the published site.
 * (/home and /localizing-checkout-experiences exist in the Framer project but are not published.)
 */
const ROUTES = [
  { path: "/", filename: "index.html" },
  { path: "/loyalty", filename: "loyalty/index.html" },
  {
    path: "/designing-activation-that-sticks",
    filename: "designing-activation-that-sticks/index.html",
  },
  { path: "/review-automation", filename: "review-automation/index.html" },
  { path: "/browser-extension", filename: "browser-extension/index.html" },
];

function allowedHost(hostname) {
  if (hostname === "thrilled-share-128540.framer.app") return true;
  if (hostname.endsWith("framerusercontent.com")) return true;
  if (hostname === "fonts.googleapis.com") return true;
  if (hostname === "fonts.gstatic.com" || hostname.endsWith(".gstatic.com"))
    return true;
  return false;
}

const subdirs = defaultOptions.subdirectories.map((sd) =>
  sd.directory === "js"
    ? { ...sd, extensions: [...sd.extensions, ".mjs"] }
    : sd,
);

/** website-scraper flattens nested filenames — slug ends up as `{slug}_index.html`. */
function flatScrapedName(routePath) {
  const slug = routePath.slice(1).replace(/\//g, "_");
  return `${slug}_index.html`;
}

/** Rewrite root-relative asset refs so pages in subfolders resolve to site root. */
function adjustAssetsForSubfolder(html) {
  const reps = [
    ['href="js/', 'href="../js/'],
    ['src="js/', 'src="../js/'],
    ['href="images/', 'href="../images/'],
    ['src="images/', 'src="../images/'],
    ['url(images/', 'url(../images/'],
    ['url(fonts/', 'url(../fonts/'],
    ['url(media/', 'url(../media/'],
  ];
  let out = html;
  for (const [from, to] of reps) out = out.split(from).join(to);
  return out;
}

function moveFlatPagesIntoFolders() {
  for (const { path: p, filename } of ROUTES) {
    if (p === "/") continue;
    const dest = join(OUT, filename);
    const flat = join(OUT, flatScrapedName(p));
    mkdirSync(dirname(dest), { recursive: true });

    if (existsSync(dest)) {
      let html = readFileSync(dest, "utf8");
      html = adjustAssetsForSubfolder(html);
      writeFileSync(dest, html);
      continue;
    }
    if (existsSync(flat)) {
      let html = readFileSync(flat, "utf8");
      html = adjustAssetsForSubfolder(html);
      writeFileSync(dest, html);
      rmSync(flat);
      continue;
    }
    console.error(`Missing scraped file for ${p} (tried ${dest} and ${flat})`);
  }
}

/** @type {import('website-scraper').default.Options} */
const options = {
  ...defaultOptions,
  urls: ROUTES.map(({ path: p, filename }) => ({
    url: `${ORIGIN}${p}`,
    filename,
  })),
  directory: OUT,
  recursive: false,
  prettifyUrls: true,
  ignoreErrors: true,
  requestConcurrency: 8,
  subdirectories: subdirs,
  sources: [
    ...defaultOptions.sources,
    { selector: 'link[rel="modulepreload"]', attr: "href" },
    { selector: 'link[rel="preload"][href$=".mjs"]', attr: "href" },
    { selector: 'link[rel="preload"][href$=".js"]', attr: "href" },
  ],
  urlFilter: (url) => {
    try {
      return allowedHost(new URL(url).hostname);
    } catch {
      return false;
    }
  },
};

if (process.argv.includes("--strip-only")) {
  stripFramerBrandingFromMirrorOutput();
  console.error("Strip-only done.");
  process.exit(0);
}

if (existsSync(OUT)) {
  rmSync(OUT, { recursive: true });
}

console.error("Mirroring Framer site into ./site …");
const result = await scrape(options);
console.error(`Initial pass: ${result.length} resources.`);

moveFlatPagesIntoFolders();

async function fetchLazyChunks() {
  const htmlPath = join(OUT, "index.html");
  if (!existsSync(htmlPath)) {
    console.error("No index.html; skipping chunk crawl.");
    return;
  }
  const html = readFileSync(htmlPath, "utf8");
  const siteMatch = html.match(
    /https:\/\/framerusercontent\.com\/sites\/([^/"']+)\//,
  );
  if (!siteMatch) {
    console.error("Could not find framerusercontent site id; skipping chunk crawl.");
    return;
  }
  const base = `https://framerusercontent.com/sites/${siteMatch[1]}/`;
  const jsDir = join(OUT, "js");
  if (!existsSync(jsDir)) {
    console.error("No js/ directory; skipping chunk crawl.");
    return;
  }

  const chunkRe = /\.\/([^"'`\s]+\.mjs)/g;
  const pending = [];
  const seen = new Set(readdirSync(jsDir).filter((f) => f.endsWith(".mjs")));

  function scanSource(source) {
    let m;
    chunkRe.lastIndex = 0;
    while ((m = chunkRe.exec(source)) !== null) {
      const name = m[1];
      if (seen.has(name)) continue;
      seen.add(name);
      if (!existsSync(join(jsDir, name))) pending.push(name);
    }
  }

  for (const f of readdirSync(jsDir)) {
    if (!f.endsWith(".mjs")) continue;
    scanSource(readFileSync(join(jsDir, f), "utf8"));
  }

  let fetched = 0;
  while (pending.length) {
    const name = pending.shift();
    const dest = join(jsDir, name);
    if (existsSync(dest)) continue;
    const url = base + name.split("/").map(encodeURIComponent).join("/");
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Chunk missing (${res.status}): ${url}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    fetched++;
    scanSource(buf.toString("utf8"));
  }
  console.error(`Lazy chunks downloaded: ${fetched}`);
}

await fetchLazyChunks();

stripFramerBrandingFromMirrorOutput();

console.error("Done.");

/** Remove Framer promotional comment, SSR badge markup, hide any hydrated badge, drop badge chunk file. */
function stripFramerBrandingHtml(html) {
  const killStyle =
    '<style id="hide-framer-badge">#__framer-badge-container,.__framer-badge{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;overflow:hidden!important;clip-path:inset(100%)!important;position:fixed!important;left:-9999px!important;top:auto!important;bottom:auto!important;right:auto!important;z-index:-2147483648!important}</style>';

  let out = html
    .replace(/<!--\s*Made in Framer[\s\S]*?-->/gi, "")
    .replace(/<!--\s*Published[\s\S]*?-->/gi, "")
    .replace(
      /<div id="__framer-badge-container">[\s\S]*?<\/a><!--\/\$--><!--\/\$--><!--\/\$--><\/div>/,
      "",
    )
    .replace(/<div id="__framer-badge-container"[^>]*><\/div>/gi, "")
    .replace(/<div id="__framer-badge-container"[^>]*\/>/gi, "");

  if (!out.includes('id="hide-framer-badge"')) {
    out = out.replace(/<head([^>]*)>/i, `<head$1>${killStyle}`);
  }
  return out;
}

function walkHtmlFiles(dir, acc = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkHtmlFiles(p, acc);
    else if (ent.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

function stripFramerBrandingFromMirrorOutput() {
  const badgeMountPatterns = [
    /\(function\(\)\{J&&l\(\(\)=>\{v\(document\.getElementById\(`__framer-badge-container`\),y\(m,\{\},y\(g\(\(\)=>import\(`\.\/PX9hIOIVM[^`]+`\)\)\)\)\)\}\)\}\)\(\)/g,
  ];

  const jsDir = join(OUT, "js");
  if (existsSync(jsDir)) {
    for (const name of readdirSync(jsDir)) {
      if (name.startsWith("PX9hIOIVM.") && name.endsWith(".mjs")) {
        rmSync(join(jsDir, name), { force: true });
        continue;
      }
      if (!name.startsWith("script_main.") || !name.endsWith(".mjs")) continue;
      const mainJs = join(jsDir, name);
      let js = readFileSync(mainJs, "utf8");
      let next = js;
      for (const re of badgeMountPatterns) next = next.replace(re, "");
      if (next !== js) writeFileSync(mainJs, next);
    }
  }

  if (!existsSync(OUT)) return;
  for (const htmlPath of walkHtmlFiles(OUT)) {
    let html = readFileSync(htmlPath, "utf8");
    const stripped = stripFramerBrandingHtml(html);
    if (stripped !== html) writeFileSync(htmlPath, stripped);
  }
}
