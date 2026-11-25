// Post-build step: server-render the landing page into dist/index.html and inline
// the stylesheet so the first paint needs no extra requests.
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distHtml = path.join(root, 'dist/index.html');

const {render} = await import(path.join(root, 'dist-ssr/entry-server.js'));
let html = await readFile(distHtml, 'utf8');

const linkPattern = /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g;
const links = [...html.matchAll(linkPattern)];
for (const [tag, href] of links) {
  const css = await readFile(path.join(root, 'dist', href), 'utf8');
  html = html.replace(tag, `<style>${css}</style>`);
}

if (!/id="root"/.test(html)) {
  throw new Error('prerender: #root container not found in dist/index.html');
}

html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

await writeFile(distHtml, html);

console.log(
  `prerender: inlined ${links.length} stylesheet(s), html ${(Buffer.byteLength(html) / 1024).toFixed(1)} KiB`,
);
