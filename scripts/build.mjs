import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, extname } from 'node:path';

const dist = 'dist';

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const files = readdirSync('.').filter(f => extname(f) === '.html');
files.forEach(f => {
  copyFileSync(f, join(dist, f));
  console.log(`Copied: ${f} → ${dist}/${f}`);
});

console.log(`Static build complete: ${files.length} file(s) → ${dist}/`);
