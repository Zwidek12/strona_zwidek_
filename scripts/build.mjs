import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
copyFileSync('index.html', join(dist, 'index.html'));

console.log('Static build complete: dist/index.html');
