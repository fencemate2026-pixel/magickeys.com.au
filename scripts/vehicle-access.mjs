import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

export function prepareVehicleModels() {
  let source = readFileSync('dist/assets/scene3d.js', 'utf8');
  const marker = "    } else {\n      const opening = 1.8, height = 2.24";
  if (!source.includes(marker)) throw Error('Cannot locate the original model extension point');
  source = source.replace("'boom', 'foyer'", "'boom', 'bollard', 'foyer'")
    .replace(marker, readFileSync('patches/bollard-model.fragment.js', 'utf8') + marker)
    .replace('boom: 1200, foyer:', 'boom: 1200, bollard: 1800, foyer:')
    .replace("boom: 'boom gate', foyer:", "boom: 'boom gate', bollard: 'retractable bollards', foyer:");
  writeFileSync('dist/assets/scene3d.js', source);
  const mounts = readFileSync('dist/assets/scene3d-mounts.js', 'utf8')
    .replace("boom:'boom gate',foyer:", "boom:'boom gate',bollard:'retractable bollards',foyer:")
    .replace("const poster = posters.get(kind + ':' + state) || posters.get(kind + ':closed');", "const poster = kind === 'bollard' ? '/assets/model-bollard-' + state + '.svg' : posters.get(kind + ':' + state) || posters.get(kind + ':closed');");
  writeFileSync('dist/assets/scene3d-mounts.js', mounts);
  const context = vm.createContext({});
  vm.runInContext(source, context);
  const engine = context.MagicKeys3D;
  for (const state of ['closed', 'open']) writeFileSync('dist/assets/model-bollard-' + state + '.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560" role="img" aria-label="Retractable bollards ${state === 'open' ? 'lowered' : 'raised'}">${hardwareFaces(engine, 'bollard', state === 'open' ? 1 : 0, 800, 560)}</svg>`);
  return engine;
}

export function hardwareFaces(engine, kind, progress, width, height) {
  const scene = engine.project({ kind, progress, state: progress === 1 ? 'open' : 'closed', width, height, compact: true, pitch: .34 });
  return scene.faces.map(face => `<polygon points="${face.points.map(p => p.x.toFixed(2) + ',' + p.y.toFixed(2)).join(' ')}" fill="${face.fill}" stroke="${face.stroke}" stroke-width="${face.lineWidth}" stroke-linejoin="round"/>`).join('');
}

export function hardwareStage(id, kind, title, { hero = false } = {}) {
  return `<div id="${id}" class="model-stage va-model${hero ? ' va-hero-model' : ''}" data-scene-kind="${kind}" data-state="closed" data-scene-compact="true" role="group" aria-label="Simulated ${title}"><img class="model-poster" src="/assets/model-${kind}-closed.svg" width="800" height="560" alt="${title}" loading="${hero ? 'eager' : 'lazy'}"><canvas class="model-canvas" tabindex="0" role="img" aria-label="3D ${title}. Drag to rotate; use arrow keys; R resets the view." hidden></canvas></div>`;
}

export function vehicleCard(id, kind, title, number, { hero = false } = {}) {
  const bollard = kind === 'bollard', sliding = kind === 'sliding';
  const stage = hero ? (kind === 'boom' ? 'hero-gate-stage' : kind === 'sliding' ? 'hero-sliding-stage' : 'hero-bollard-stage') : id;
  return `<article class="va-card" data-va-card data-va-kind="${kind}"><header class="va-heading"><span>${number}</span><div><strong${hero && kind === 'boom' ? ' id="hero-preview-title"' : ''}>${title}</strong><small>${bollard ? 'RETRACTABLE BOLLARDS' : (sliding ? 'SLIDING GATE' : 'VEHICLE BOOM BARRIER')}</small></div><span class="va-connection"><i aria-hidden="true"></i> PREVIEW</span></header>${hardwareStage(stage, kind, title, { hero })}<div class="va-controls"><button type="button" class="va-open" data-va-target="${stage}" data-va-state="open"${hero && kind === 'boom' ? ' id="hero-gate-open"' : ''} aria-label="${bollard ? 'Lower' : 'Open'} simulated ${title.toLowerCase()}">${bollard ? 'LOWER' : 'OPEN'}</button><button type="button" class="va-close" data-va-target="${stage}" data-va-state="closed"${hero && kind === 'boom' ? ' id="hero-gate-close"' : ''} aria-label="${bollard ? 'Raise' : 'Close'} simulated ${title.toLowerCase()}" disabled>${bollard ? 'RAISE' : 'CLOSE'}</button><div class="va-current" role="status" aria-live="polite"><i class="va-led" aria-hidden="true"></i><span${hero && kind === 'boom' ? ' id="hero-gate-state"' : ''}>${bollard ? 'RAISED' : 'CLOSED'}</span><small>Simulated position</small></div></div><footer class="va-telemetry"><span>3D HARDWARE VIEW</span><span>${bollard ? '3 RETRACTABLE POSTS' : (sliding ? 'HORIZONTAL GATE TRAVEL' : 'BOOM ARM CONTROL')}</span></footer></article>`;
}

export function vehicleModule() {
  return `<div class="mk-module-heading"><strong>Active vehicle access controls</strong><span>CONFIGURATION EXAMPLE</span></div><div class="va-grid">${vehicleCard('vehicle-entry-boom', 'boom', 'Car park entry', '01')}${vehicleCard('vehicle-sliding-gate', 'sliding', 'Main sliding gate', '02')}${vehicleCard('vehicle-bollards', 'bollard', 'Protected driveway', '03')}</div><p class="va-workspace-note">Interactive configuration example · Select OPEN / CLOSE or LOWER / RAISE · No live equipment connected</p>`;
}
