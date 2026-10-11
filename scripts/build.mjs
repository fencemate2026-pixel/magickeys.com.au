import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, cpSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const archive = join(process.cwd(), 'MagicKeys-Azure-Website (1).zip');
if (!existsSync(archive)) throw new Error('The original MagicKeys Azure website ZIP is missing.');
const scratch = mkdtempSync(join(tmpdir(), 'magickeys-'));
try {
  execFileSync('unzip', ['-q', archive, 'magickeys-website/dist/*', '-d', scratch], {timeout: 90_000});
  rmSync('dist', {recursive:true, force:true});
  cpSync(join(scratch, 'magickeys-website', 'dist'), 'dist', {recursive:true});
  const page = 'dist/index.html';
  let content = readFileSync(page, 'utf8');
  const original = /<section class="client-section" id="client-access">[\s\S]*?<\/section>/g;
  if ([...content.matchAll(original)].length !== 1) throw new Error('Expected exactly one original Client Access section; check the source ZIP before replacing.');
  content = content.replace(original, readFileSync('patches/client-access.html', 'utf8').trim());
  // Preserve the site's real animations, 3D models, screenshots, logos and video files.
  writeFileSync(page, content, 'utf8');
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/client-access.css', 'utf8'));
  console.log('Original MagicKeys website extracted intact. Client Login section integrated.');
} finally {
  rmSync(scratch, {recursive:true, force:true});
}
