// Shared, decorative recorder OSD. All feeds are clearly identified as simulations.
export const CAMERA_DATE='21/10/2026';
export function cameraOverlay(code='CAM 01',{codeId='',compact=false}={}) {
  return `<span class="mk-camera-osd${compact?' mk-camera-osd-compact':''}" aria-hidden="true"><span class="mk-camera-code"${codeId?` id="${codeId}"`:''}>${code}</span><span class="mk-camera-rec"><i></i> REC</span><span class="mk-camera-clock">${CAMERA_DATE} <span data-cctv-clock>14:32:18</span></span><span class="mk-camera-example">SIMULATED FEED</span></span>`;
}
