import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));

// Keep this order: later application rules override the original base stylesheet.
const STYLESHEETS = [
  'styles/vendor/tailwind.css',
  'styles/base.css',
  'styles/vendor/tailwind-properties.css',
  'styles/theme.css',
  'styles/layout.css',
  'styles/stories.css',
  'styles/animations.css',
  'styles/room.css',
];

function assetUrl(filename, mimeType) {
  const content = fs.readFileSync(path.join(SOURCE_DIRECTORY, filename));
  return `data:${mimeType};base64,${content.toString('base64')}`;
}

function readStyles() {
  const fontUrl = assetUrl('assets/Onest.ttf', 'font/ttf');
  const fontFace = `
@font-face {
  font-family: Onest;
  src: url(${fontUrl}) format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}`;
  const styles = STYLESHEETS.map((filename) =>
    fs.readFileSync(path.join(SOURCE_DIRECTORY, filename), 'utf8'),
  );
  return [fontFace, ...styles].join('\n');
}

function createPage(script, styles) {
  const favicon = assetUrl('favicon.svg', 'image/svg+xml');
  const safeScript = script.replace(/<\/script/gi, '<\\/script');
  const safeStyles = styles.replace(/<\/style/gi, '<\\/style');
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="#132d50">
    <meta name="description" content="Первый год самостоятельной жизни: бюджет, учёба, работа и решения с последствиями.">
    <title>на себе</title>
    <link rel="icon" href="${favicon}">
    <style>${safeStyles}</style>
  </head>
  <body>
    <div id="root"></div>
    <noscript>Для игры включи JavaScript в браузере.</noscript>
    <script>${safeScript}</script>
  </body>
</html>`;
}

export async function buildPage(esbuild, outputDirectory) {
  const output = outputDirectory || path.resolve(SOURCE_DIRECTORY, '..');
  const result = await esbuild.build({
    absWorkingDir: SOURCE_DIRECTORY,
    entryPoints: ['entry.tsx'],
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    target: ['es2022'],
    minify: true,
    treeShaking: true,
    legalComments: 'inline',
    loader: { '.png': 'dataurl', '.webp': 'dataurl', '.svg': 'dataurl' },
    charset: 'utf8',
    jsx: 'automatic',
    tsconfig: 'tsconfig.json',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const script = result.outputFiles[0].text;
  if (script.includes('/api/room')) {
    throw new Error('В одиночную сборку попал серверный маршрут командной комнаты.');
  }
  const html = createPage(script, readStyles());
  fs.mkdirSync(output, { recursive: true });
  const filename = path.join(output, 'index.html');
  fs.writeFileSync(filename, html);
  fs.writeFileSync(path.join(output, '.nojekyll'), '');
  console.log(JSON.stringify({ file: filename, bytes: Buffer.byteLength(html) }));
}

const isCommandLineRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCommandLineRun) {
  await buildPage(await import('esbuild'));
}
