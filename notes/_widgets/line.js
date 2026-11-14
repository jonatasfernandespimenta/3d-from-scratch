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
// DDA e Bresenham passo a passo. input: { algo: "dda" | "bresenham" }
const N = 24, M = 15, CS = 26, CW = N * CS, CH = M * CS;
let algo = input?.algo ?? "bresenham", P = [{ x: 2, y: 11 }, { x: 20, y: 3 }];
let steps = [], k = 0, playing = false, compare = false, acc = 0, speed = 5, drag = -1;
root.createDiv({ cls: "w3d-hint", text: "Arraste P0/P1. ▶ anima, Passo avança um pixel. A linha fina é a reta ideal." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls();
const bD = button("DDA", () => setAlgo("dda")), bB = button("Bresenham", () => setAlgo("bresenham"));
const bP = button("▶ Play", () => { if (k >= steps.length) k = 0; playing = !playing; });
button("Passo", () => { playing = false; if (k >= steps.length) k = 0; k++; });
button("Reset", () => { playing = false; k = 0; });
check("comparar com o outro", false, v => compare = v);
slider("vel.", 1, 20, 1, speed, v => speed = v, v => v + "/s");

function dda(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, n = Math.max(Math.abs(dx), Math.abs(dy)), out = [];
  if (n === 0) return [{ x: a.x, y: a.y, txt: "P0 == P1 → um pixel só" }];
  const xi = dx / n, yi = dy / n; let x = a.x, y = a.y;
  for (let i = 0; i <= n; i++) {
    out.push({ x: Math.round(x), y: Math.round(y), txt:
      `i = ${i} de ${n}   (n = maior lado = max(|dx|,|dy|) = max(${Math.abs(dx)}, ${Math.abs(dy)}))\n` +
      `x_inc = dx/n = ${xi.toFixed(3)}   y_inc = dy/n = ${yi.toFixed(3)}\n` +
      `x = ${x.toFixed(3)}   y = ${y.toFixed(3)}   → pixel (round) = (${Math.round(x)}, ${Math.round(y)})` });
    x += xi; y += yi;
  }
  return out;
}
function bresenham(a, b) {
  let x = a.x, y = a.y; const dx = Math.abs(b.x - x), sx = x < b.x ? 1 : -1, dy = -Math.abs(b.y - y), sy = y < b.y ? 1 : -1;
  let err = dx + dy; const out = [];
  for (let g = 0; g < 999; g++) {
    if (x === b.x && y === b.y) { out.push({ x, y, txt: `pixel (${x}, ${y})  err = ${err}\nchegou em P1 → fim. Só soma e compara inteiros, sem float!` }); break; }
    const e2 = 2 * err, px = x, py = y, e0 = err, d = [];
    if (e2 >= dy) { err += dy; x += sx; d.push(`e2 ≥ dy (${e2} ≥ ${dy}) → x += ${sx},  err += dy`); }
    if (e2 <= dx) { err += dx; y += sy; d.push(`e2 ≤ dx (${e2} ≤ ${dx}) → y += ${sy},  err += dx`); }
    out.push({ x: px, y: py, txt: `pixel (${px}, ${py})   dx = ${dx}   dy = -|Δy| = ${dy}\nerr = ${e0}   e2 = 2·err = ${e2}\n${d.join("\n")}\nnovo err = ${err}` });
  }
  return out;
}
const run = (name) => (name === "dda" ? dda : bresenham)(P[0], P[1]);
function setAlgo(a) { algo = a; bD.toggleClass("on", a === "dda"); bB.toggleClass("on", a === "bresenham"); steps = run(algo); k = steps.length; playing = false; }
setAlgo(algo);

function cell(x, y, fill, stroke) {
  if (fill) { c.fillStyle = fill; c.fillRect(x * CS + 1, y * CS + 1, CS - 2, CS - 2); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.strokeRect(x * CS + 3, y * CS + 3, CS - 6, CS - 6); }
}
function draw() {
  c.fillStyle = C.cell; c.fillRect(0, 0, CW, CH);
  c.strokeStyle = C.grid; c.lineWidth = 1;
  for (let i = 0; i <= N; i++) { c.beginPath(); c.moveTo(i * CS + .5, 0); c.lineTo(i * CS + .5, CH); c.stroke(); }
  for (let j = 0; j <= M; j++) { c.beginPath(); c.moveTo(0, j * CS + .5); c.lineTo(CW, j * CS + .5); c.stroke(); }
  for (let i = 0; i < k && i < steps.length; i++) cell(steps[i].x, steps[i].y, i === k - 1 ? C.ink : "rgba(160,82,45,.75)");
  if (compare) for (const s of run(algo === "dda" ? "bresenham" : "dda")) cell(s.x, s.y, null, C.blue);
  c.strokeStyle = C.gold; c.lineWidth = 1.5; c.beginPath();
  c.moveTo((P[0].x + .5) * CS, (P[0].y + .5) * CS); c.lineTo((P[1].x + .5) * CS, (P[1].y + .5) * CS); c.stroke();
  P.forEach((p, i) => {
    c.fillStyle = C.blue; c.beginPath(); c.arc((p.x + .5) * CS, (p.y + .5) * CS, 6, 0, 7); c.fill();
    c.fillStyle = C.ink; c.textAlign = "left"; c.fillText(`P${i} (${p.x},${p.y})`, (p.x + .5) * CS + 9, (p.y + .5) * CS - 8);
  });
  const s = steps[Math.max(0, k - 1)];
  info.setText(`${algo.toUpperCase()} — passo ${k}/${steps.length}\n` + (k ? s.txt : "aperte ▶ ou Passo") +
    (compare ? `\n(contorno azul = ${algo === "dda" ? "Bresenham" : "DDA"})` : ""));
  bP.setText(playing ? "⏸ Pausa" : "▶ Play");
}
cv.addEventListener("pointerdown", e => {
  const [mx, my] = mouse(cv, e, CW), x = Math.floor(mx / CS), y = Math.floor(my / CS);
  drag = P.findIndex(p => Math.abs(p.x - x) <= 1 && Math.abs(p.y - y) <= 1);
  if (drag >= 0) cv.setPointerCapture(e.pointerId);
});
cv.addEventListener("pointermove", e => {
  if (drag < 0) return;
  const [mx, my] = mouse(cv, e, CW);
  P[drag] = { x: Math.max(0, Math.min(N - 1, Math.floor(mx / CS))), y: Math.max(0, Math.min(M - 1, Math.floor(my / CS))) };
  steps = run(algo); k = steps.length; playing = false;
});
cv.addEventListener("pointerup", () => drag = -1);
loop(dt => {
  if (playing) { acc += dt * speed; while (acc >= 1) { acc--; if (k < steps.length) k++; else playing = false; } }
  draw();
});
