/**
 * Copy public and .next/static into standalone output so the app can serve them.
 * Run automatically after `next build` when using output: 'standalone'.
 * See: https://nextjs.org/docs/app/api-reference/next-config-js/output#automatically-copying-traced-files
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const standaloneDir = path.join(root, '.next', 'standalone');

if (!fs.existsSync(standaloneDir)) {
  console.log('copy-standalone-assets: no .next/standalone found, skipping');
  process.exit(0);
}

// public -> standalone/public
const publicDir = path.join(root, 'public');
if (fs.existsSync(publicDir)) {
  const dest = path.join(standaloneDir, 'public');
  fs.cpSync(publicDir, dest, { recursive: true });
  console.log('copy-standalone-assets: copied public -> .next/standalone/public');
}

// .next/static -> standalone/.next/static
const staticDir = path.join(root, '.next', 'static');
if (fs.existsSync(staticDir)) {
  const destStatic = path.join(standaloneDir, '.next', 'static');
  fs.mkdirSync(path.join(standaloneDir, '.next'), { recursive: true });
  fs.cpSync(staticDir, destStatic, { recursive: true });
  console.log('copy-standalone-assets: copied .next/static -> .next/standalone/.next/static');
}

console.log('copy-standalone-assets: done');
