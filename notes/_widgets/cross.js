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
// Produto vetorial 3D: a × b, perpendicular aos dois. Arraste para orbitar.
const CW = 600, CH = 420, OX = 300, OY = 230, U = 42;
let a = [2, 0, 0], b = [1, 2, 0], yaw = -0.65, pitch = 0.4, swap = false, para = true, drag = null;
root.createDiv({ cls: "w3d-hint", text: "Arraste para girar a câmera. Ajuste a e b. O verde é o resultado (sempre perpendicular aos dois)." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls();
["x", "y", "z"].forEach((n, i) => slider("a." + n, -3, 3, 0.5, a[i], v => a[i] = v));
["x", "y", "z"].forEach((n, i) => slider("b." + n, -3, 3, 0.5, b[i], v => b[i] = v));
check("inverter: b × a", swap, v => swap = v);
check("paralelogramo", para, v => para = v);
const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const len = p => Math.hypot(...p);
function P([x, y, z]) { // câmera orbital ortográfica (mão direita: x dir, y cima, z pra fora)
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw), z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const y1 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
  return [OX + x1 * U, OY - y1 * U];
}
function vec(v, color, label) { const p = P(v); arrow(c, ...P([0, 0, 0]), ...p, color, 3); c.fillStyle = color; c.fillText(label, p[0] + 6, p[1] - 6); }
function draw() {
  c.fillStyle = C.bg; c.fillRect(0, 0, CW, CH);
  [[[1, 0, 0], "#c98b80", "x"], [[0, 1, 0], "#8fae84", "y"], [[0, 0, 1], "#86a5bf", "z"]].forEach(([d, col, n]) => {
    const p = P(d.map(t => t * 4)), m = P(d.map(t => t * -4));
    c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.moveTo(...m); c.lineTo(...p); c.stroke(); c.fillStyle = col; c.fillText(n, p[0] + 4, p[1]);
  });
  const [p, q] = swap ? [b, a] : [a, b], n = cross(p, q);
  if (para) {
    c.fillStyle = "rgba(199,154,58,.22)"; c.beginPath(); c.moveTo(...P([0, 0, 0])); c.lineTo(...P(p));
    c.lineTo(...P(p.map((t, i) => t + q[i]))); c.lineTo(...P(q)); c.closePath(); c.fill();
  }
  vec(a, C.acc, "a"); vec(b, C.blue, "b"); vec(n, C.green, swap ? "b × a" : "a × b");
  const L = len(n), [P1, Q1] = swap ? ["b", "a"] : ["a", "b"];
  const sinT = len(a) && len(b) ? L / (len(a) * len(b)) : 0;
  info.setText(`N = ${P1} × ${Q1}\n` +
    `Nx = ${P1}y·${Q1}z − ${P1}z·${Q1}y = (${p[1]})(${q[2]}) − (${p[2]})(${q[1]}) = ${n[0]}\n` +
    `Ny = ${P1}z·${Q1}x − ${P1}x·${Q1}z = (${p[2]})(${q[0]}) − (${p[0]})(${q[2]}) = ${n[1]}\n` +
    `Nz = ${P1}x·${Q1}y − ${P1}y·${Q1}x = (${p[0]})(${q[1]}) − (${p[1]})(${q[0]}) = ${n[2]}\n` +
    `|N| = ${L.toFixed(3)} = |a||b|·sin θ  (sin θ = ${sinT.toFixed(3)})  = área do paralelogramo · triângulo = ${(L / 2).toFixed(3)}\n` +
    `checagem: a·N = ${dot(a, n)}, b·N = ${dot(b, n)}  (0 = perpendicular ✓)` + (L === 0 ? "\nN = 0 → a e b são paralelos (ou um é zero)" : ""));
}
cv.addEventListener("pointerdown", e => { drag = mouse(cv, e, CW); cv.setPointerCapture(e.pointerId); });
cv.addEventListener("pointermove", e => {
  if (!drag) return; const m = mouse(cv, e, CW);
  yaw += (m[0] - drag[0]) * 0.01; pitch = Math.max(-1.5, Math.min(1.5, pitch + (m[1] - drag[1]) * 0.01)); drag = m;
});
cv.addEventListener("pointerup", () => drag = null);
loop(draw);
