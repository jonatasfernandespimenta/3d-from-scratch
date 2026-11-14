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
// Rasterização de triângulo por scanline (flat-bottom + flat-top)
const N = 32, M = 21, CS = 20, CW = N * CS, CH = M * CS;
let V = [{ x: 15, y: 1 }, { x: 3, y: 12 }, { x: 28, y: 19 }], rows = [], k = 0, playing = false, acc = 0, speed = 8, drag = -1, mid = null;
root.createDiv({ cls: "w3d-hint", text: "Arraste os vértices. Azul = metade flat-bottom, verde = metade flat-top. A linha tracejada é o corte em M." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls();
const bP = button("▶ Play", () => { if (k >= rows.length) k = 0; playing = !playing; });
button("Passo", () => { playing = false; if (k >= rows.length) k = 0; k++; });
button("Reset", () => { playing = false; k = 0; });
slider("vel.", 1, 30, 1, speed, v => speed = v, v => v + "/s");

function build() {
  const [a, b, d] = [...V].sort((p, q) => p.y - q.y); // a=topo, b=meio, d=base
  rows = []; mid = null;
  if (d.y === a.y) { rows.push({ y: a.y, x1: Math.min(a.x, b.x, d.x), x2: Math.max(a.x, b.x, d.x), part: "degenerado (linha)" }); return [a, b, d]; }
  const mx = a.x + (d.x - a.x) * (b.y - a.y) / (d.y - a.y); mid = { x: mx, y: b.y };
  if (b.y > a.y) for (let y = a.y; y <= b.y; y++) {
    const t = (y - a.y) / (b.y - a.y);
    rows.push({ y, x1: a.x + (b.x - a.x) * t, x2: a.x + (mx - a.x) * t, part: "flat-bottom" });
  }
  if (d.y > b.y) for (let y = b.y > a.y ? b.y + 1 : b.y; y <= d.y; y++) {
    const t = (y - b.y) / (d.y - b.y);
    rows.push({ y, x1: b.x + (d.x - b.x) * t, x2: mx + (d.x - mx) * t, part: "flat-top" });
  }
  return [a, b, d];
}
let S = build(); k = rows.length;

function draw() {
  c.fillStyle = C.cell; c.fillRect(0, 0, CW, CH);
  c.strokeStyle = C.grid; c.lineWidth = 1;
  for (let i = 0; i <= N; i++) { c.beginPath(); c.moveTo(i * CS + .5, 0); c.lineTo(i * CS + .5, CH); c.stroke(); }
  for (let j = 0; j <= M; j++) { c.beginPath(); c.moveTo(0, j * CS + .5); c.lineTo(CW, j * CS + .5); c.stroke(); }
  rows.slice(0, k).forEach((r, i) => {
    const xs = Math.round(Math.min(r.x1, r.x2)), xe = Math.round(Math.max(r.x1, r.x2));
    c.fillStyle = i === k - 1 ? C.ink : r.part === "flat-top" ? "rgba(90,125,79,.7)" : "rgba(59,110,143,.7)";
    for (let x = xs; x <= xe; x++) c.fillRect(x * CS + 1, r.y * CS + 1, CS - 2, CS - 2);
  });
  const ctr = p => [(p.x + .5) * CS, (p.y + .5) * CS];
  c.strokeStyle = C.acc; c.lineWidth = 2; c.beginPath();
  c.moveTo(...ctr(V[0])); c.lineTo(...ctr(V[1])); c.lineTo(...ctr(V[2])); c.closePath(); c.stroke();
  if (mid) {
    c.setLineDash([5, 4]); c.strokeStyle = C.ink; c.beginPath(); c.moveTo(...ctr(S[1])); c.lineTo(...ctr(mid)); c.stroke(); c.setLineDash([]);
    c.fillStyle = C.gold; c.beginPath(); c.arc(...ctr(mid), 5, 0, 7); c.fill();
    c.fillStyle = C.ink; c.fillText("M", ctr(mid)[0] + 8, ctr(mid)[1] - 6);
  }
  S.forEach((p, i) => {
    c.fillStyle = C.acc; c.beginPath(); c.arc(...ctr(p), 6, 0, 7); c.fill();
    c.fillStyle = C.ink; c.fillText(`(x${i},y${i})=(${p.x},${p.y})`, ctr(p)[0] + 9, ctr(p)[1] + (i === 2 ? 16 : -8));
  });
  const r = rows[Math.max(0, k - 1)];
  info.setText(`vértices ordenados por y: y0 ≤ y1 ≤ y2\n` +
    (mid ? `M = (Mx, y1)   Mx = x0 + (x2 − x0)·(y1 − y0)/(y2 − y0) = ${mid.x.toFixed(2)}\n` : "") +
    (k ? `scanline ${k}/${rows.length}: y = ${r.y}   parte: ${r.part}\nx_inicio = ${r.x1.toFixed(2)}   x_fim = ${r.x2.toFixed(2)}  → pinta de ${Math.round(Math.min(r.x1, r.x2))} até ${Math.round(Math.max(r.x1, r.x2))}`
       : "aperte ▶ ou Passo"));
  bP.setText(playing ? "⏸ Pausa" : "▶ Play");
}
cv.addEventListener("pointerdown", e => {
  const [mx, my] = mouse(cv, e, CW), x = Math.floor(mx / CS), y = Math.floor(my / CS);
  drag = V.findIndex(p => Math.abs(p.x - x) <= 1 && Math.abs(p.y - y) <= 1);
  if (drag >= 0) cv.setPointerCapture(e.pointerId);
});
cv.addEventListener("pointermove", e => {
  if (drag < 0) return;
  const [mx, my] = mouse(cv, e, CW);
  V[drag] = { x: Math.max(0, Math.min(N - 1, Math.floor(mx / CS))), y: Math.max(0, Math.min(M - 1, Math.floor(my / CS))) };
  S = build(); k = rows.length; playing = false;
});
cv.addEventListener("pointerup", () => drag = -1);
loop(dt => {
  if (playing) { acc += dt * speed; while (acc >= 1) { acc--; if (k < rows.length) k++; else playing = false; } }
  draw();
});
