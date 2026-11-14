// ---- helpers (iguais em todos os widgets) ----
const root = dv.container.createDiv({ cls: "w3d" });
const C = { bg: "#fbf7ef", cell: "#fffaf2", grid: "#e4d8c4", ink: "#3f2e25", muted: "#8b6f5a",
  acc: "#a0522d", blue: "#3b6e8f", green: "#5a7d4f", red: "#b03a2e", gold: "#c79a3a" };
const FONT = "12px 'Cascadia Code', Menlo, monospace";
function canvas(W, H) {
  const cv = root.createEl("canvas"), r = window.devicePixelRatio || 1;
  cv.width = W * r; cv.height = H * r; cv.style.maxWidth = W + "px";
  const c = cv.getContext("2d"); c.scale(r, r); c.font = FONT; return [cv, c];
}
function mouse(cv, e, W) { const b = cv.getBoundingClientRect(), k = W / b.width; return [(e.clientX - b.left) * k, (e.clientY - b.top) * k]; }
let ctl;
function controls() { ctl = root.createDiv({ cls: "w3d-controls" }); return ctl; }
function slider(label, min, max, step, val, on, fmt = v => v) {
  const row = ctl.createDiv({ cls: "w3d-row" }); row.createSpan({ text: label });
  const s = row.createEl("input", { type: "range" }); Object.assign(s, { min, max, step, value: val });
  const o = row.createSpan({ cls: "w3d-val", text: String(fmt(+val)) });
  s.addEventListener("input", () => { o.setText(String(fmt(+s.value))); on(+s.value); });
  return { set(v) { s.value = v; o.setText(String(fmt(+v))); } };
}
function button(text, on) { const b = ctl.createEl("button", { text }); b.onclick = () => on(b); return b; }
function check(text, val, on) {
  const l = ctl.createEl("label"); const i = l.createEl("input", { type: "checkbox" });
  i.checked = val; l.appendText(" " + text); i.onchange = () => on(i.checked); return i;
}
function loop(fn) { // para sozinho quando a nota fecha
  let last = performance.now(), seen = false;
  const tick = t => { if (root.isConnected) seen = true; else if (seen) return;
    fn(Math.min((t - last) / 1000, 0.1)); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function arrow(c, x0, y0, x1, y1, color, w = 2, head = 9) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  c.strokeStyle = c.fillStyle = color; c.lineWidth = w;
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
  if (Math.hypot(x1 - x0, y1 - y0) < 2) return;
  c.beginPath(); c.moveTo(x1, y1);
  c.lineTo(x1 - head * Math.cos(a - 0.4), y1 - head * Math.sin(a - 0.4));
  c.lineTo(x1 - head * Math.cos(a + 0.4), y1 - head * Math.sin(a + 0.4)); c.fill();
}
const f2 = v => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2);
// ---- fim helpers ----
// Cubo 3D: rotação, translação, projeção, backface culling e edição de vértices.
// Mesmo pipeline do src/main.c: rotate_y → rotate_x → rotate_z → z += distância → project.
// input: { cull: bool, fill: bool, normals: bool }
const CW = 640, CH = 400;
const BASE = [[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1],[1,1,1],[1,-1,1],[-1,1,1],[-1,-1,1]];
const FACES = [[1,2,3],[1,3,4],[4,3,5],[4,5,6],[6,5,7],[6,7,8],[8,7,2],[8,2,1],[2,7,5],[2,5,3],[6,8,1],[6,1,4]]; // = cube_faces do mesh.c
let verts = BASE.map(v => [...v]), rx = 0.5, ry = 0.6, rz = 0, dist = 5, fov = 330, auto = false, sel = 2;
let cull = input?.cull ?? false, fill = input?.fill ?? true, normals = input?.normals ?? false, dragging = null;
root.createDiv({ cls: "w3d-hint", text: "Arraste no cubo para girar. Escolha um vértice e mova ele com os sliders vx/vy/vz." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls();
const deg = v => Math.round(v * 180 / Math.PI) + "°";
const sX = slider("rot X", -3.14, 3.14, 0.01, rx, v => rx = v, deg);
const sY = slider("rot Y", -3.14, 3.14, 0.01, ry, v => ry = v, deg);
slider("rot Z", -3.14, 3.14, 0.01, rz, v => rz = v, deg);
slider("dist z", 2.5, 12, 0.1, dist, v => dist = v);
slider("fov", 80, 800, 10, fov, v => fov = v);
check("girar sozinho", auto, v => auto = v);
check("backface culling", cull, v => cull = v);
check("preencher", fill, v => fill = v);
check("normais", normals, v => normals = v);
const vs = ctl.createEl("select");
BASE.forEach((_, i) => vs.createEl("option", { text: "vértice " + (i + 1), value: String(i) }));
vs.value = String(sel);
const vx = slider("vx", -2, 2, 0.1, verts[sel][0], v => verts[sel][0] = v);
const vy = slider("vy", -2, 2, 0.1, verts[sel][1], v => verts[sel][1] = v);
const vz = slider("vz", -2, 2, 0.1, verts[sel][2], v => verts[sel][2] = v);
vs.onchange = () => { sel = +vs.value; vx.set(verts[sel][0]); vy.set(verts[sel][1]); vz.set(verts[sel][2]); };
button("reset vértices", () => { verts = BASE.map(v => [...v]); vs.onchange(); });

// mesmas funções do vector.c
const rotX = ([x, y, z], a) => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const rotY = ([x, y, z], a) => [x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)];
const rotZ = ([x, y, z], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
const rotate = v => rotZ(rotX(rotY(v, ry), rx), rz);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const project = ([x, y, z]) => [fov * x / z + CW / 2, fov * y / z + CH / 2];

function draw() {
  c.fillStyle = C.bg; c.fillRect(0, 0, CW, CH);
  const cam = verts.map(v => { const r = rotate(v); return [r[0], r[1], r[2] + dist]; });
  const scr = cam.map(project);
  const faces = FACES.map(([i, j, k]) => {
    const A = cam[i - 1], B = cam[j - 1], Cc = cam[k - 1];
    const n = cross(sub(B, A), sub(Cc, A)), ray = sub([0, 0, 0], A), d = dot(n, ray);
    return { idx: [i - 1, j - 1, k - 1], n, d, vis: d > 0, z: (A[2] + B[2] + Cc[2]) / 3, ctr: [0, 1, 2].map(t => (A[t] + B[t] + Cc[t]) / 3) };
  }).sort((p, q) => q.z - p.z); // pintor: de trás pra frente
  let shown = 0;
  for (const f of faces) {
    if (cull && !f.vis) continue; shown++;
    const p = f.idx.map(i => scr[i]);
    c.beginPath(); c.moveTo(...p[0]); c.lineTo(...p[1]); c.lineTo(...p[2]); c.closePath();
    if (fill) { c.fillStyle = f.vis ? "rgba(90,125,79,.22)" : "rgba(176,58,46,.16)"; c.fill(); }
    c.setLineDash(f.vis ? [] : [4, 4]); c.strokeStyle = f.vis ? C.ink : C.muted; c.lineWidth = f.vis ? 1.5 : 1; c.stroke(); c.setLineDash([]);
    if (normals) {
      const L = Math.hypot(...f.n) || 1, tip = f.ctr.map((v, t) => v + f.n[t] / L * 0.45);
      arrow(c, ...project(f.ctr), ...project(tip), f.vis ? C.blue : C.red, 1.5, 6);
    }
  }
  scr.forEach((p, i) => {
    c.fillStyle = i === sel ? C.acc : C.ink; c.beginPath(); c.arc(p[0], p[1], i === sel ? 6 : 3, 0, 7); c.fill();
    c.fillText(i + 1, p[0] + 7, p[1] - 5);
  });
  // matriz combinada M = Rz·Rx·Ry (colunas = eixos transformados)
  const cols = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map(rotate);
  const row = r => "| " + cols.map(col => f2(col[r]).padStart(6)).join(" ") + " |";
  const v = verts[sel], r = rotate(v), cv3 = cam[sel], s = scr[sel];
  info.setText(`M = Rz·Rx·Ry  (ordem do seu update: y → x → z)\n${row(0)}\n${row(1)}\n${row(2)}\n\n` +
    `vértice ${sel + 1}: local (${v.map(f2).join(", ")})  → M·v = (${r.map(f2).join(", ")})\n` +
    `  z += ${dist} → (${cv3.map(f2).join(", ")})  → tela x' = fov·x/z + w/2 = ${s[0].toFixed(1)},  y' = ${s[1].toFixed(1)}\n` +
    `faces desenhadas: ${shown}/12   (verde = de frente pra câmera, vermelho tracejado = de costas)`);
}
cv.addEventListener("pointerdown", e => { dragging = mouse(cv, e, CW); cv.setPointerCapture(e.pointerId); });
cv.addEventListener("pointermove", e => {
  if (!dragging) return; const p = mouse(cv, e, CW);
  ry -= (p[0] - dragging[0]) * 0.01; rx += (p[1] - dragging[1]) * 0.01; dragging = p;
  const wrap = a => Math.atan2(Math.sin(a), Math.cos(a)); rx = wrap(rx); ry = wrap(ry); sX.set(rx.toFixed(2)); sY.set(ry.toFixed(2));
});
cv.addEventListener("pointerup", () => dragging = null);
loop(dt => { if (auto) { ry = Math.atan2(Math.sin(ry + dt * 0.7), Math.cos(ry + dt * 0.7)); rx = Math.atan2(Math.sin(rx + dt * 0.4), Math.cos(rx + dt * 0.4)); sX.set(rx.toFixed(2)); sY.set(ry.toFixed(2)); } draw(); });
