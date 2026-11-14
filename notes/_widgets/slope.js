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
// Equação da reta y = mx + c: arraste P0 e P1, veja Δx, Δy, m e c
const CW = 640, CH = 360, OX = 60, OY = 320, U = 30; // y para cima (matemática)
let P = [{ x: 2, y: 2 }, { x: 12, y: 7 }], drag = -1;
root.createDiv({ cls: "w3d-hint", text: "Arraste P0 e P1. O triângulo mostra Δx (andar) e Δy (subir). A reta inteira é y = mx + c." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
const sx = x => OX + x * U, sy = y => OY - y * U;
function draw() {
  c.fillStyle = C.cell; c.fillRect(0, 0, CW, CH);
  c.lineWidth = 1;
  for (let x = -2; x <= 19; x++) { c.strokeStyle = x ? C.grid : C.muted; c.beginPath(); c.moveTo(sx(x), 0); c.lineTo(sx(x), CH); c.stroke(); }
  for (let y = -1; y <= 11; y++) { c.strokeStyle = y ? C.grid : C.muted; c.beginPath(); c.moveTo(0, sy(y)); c.lineTo(CW, sy(y)); c.stroke(); }
  const [a, b] = P, dx = b.x - a.x, dy = b.y - a.y;
  if (dx !== 0) {
    const m = dy / dx, cc = a.y - m * a.x;
    c.strokeStyle = C.gold; c.lineWidth = 1.5; c.beginPath(); c.moveTo(sx(-2), sy(m * -2 + cc)); c.lineTo(sx(19), sy(m * 19 + cc)); c.stroke();
    c.fillStyle = C.gold; c.beginPath(); c.arc(sx(0), sy(cc), 5, 0, 7); c.fill(); c.fillText(`c = ${f2(cc)}`, sx(0) + 8, sy(cc) + 14);
  } else { c.strokeStyle = C.gold; c.beginPath(); c.moveTo(sx(a.x), 0); c.lineTo(sx(a.x), CH); c.stroke(); }
  // triângulo Δx / Δy
  c.lineWidth = 3; c.strokeStyle = C.blue; c.beginPath(); c.moveTo(sx(a.x), sy(a.y)); c.lineTo(sx(b.x), sy(a.y)); c.stroke();
  c.strokeStyle = C.red; c.beginPath(); c.moveTo(sx(b.x), sy(a.y)); c.lineTo(sx(b.x), sy(b.y)); c.stroke();
  c.strokeStyle = C.acc; c.beginPath(); c.moveTo(sx(a.x), sy(a.y)); c.lineTo(sx(b.x), sy(b.y)); c.stroke();
  c.fillStyle = C.blue; c.fillText(`Δx = ${dx}`, sx((a.x + b.x) / 2) - 20, sy(a.y) + (dy >= 0 ? 16 : -8));
  c.fillStyle = C.red; c.fillText(`Δy = ${dy}`, sx(b.x) + 6, sy((a.y + b.y) / 2));
  P.forEach((p, i) => {
    c.fillStyle = C.acc; c.beginPath(); c.arc(sx(p.x), sy(p.y), 6, 0, 7); c.fill();
    c.fillStyle = C.ink; c.fillText(`P${i} (${p.x}, ${p.y})`, sx(p.x) + 8, sy(p.y) - 8);
  });
  if (dx === 0) { info.setText(`Δx = 0 → reta vertical: m = Δy/0 = ∞. y = mx + c não funciona!\nPor isso DDA/Bresenham andam pelo maior lado.`); return; }
  const m = dy / dx, cc = a.y - m * a.x;
  info.setText(`m = Δy / Δx = ${dy} / ${dx} = ${m.toFixed(3)}   (sobe ${f2(m)} a cada 1 em x)\n` +
    `c = y0 − m·x0 = ${a.y} − ${f2(m)}·${a.x} = ${f2(cc)}   (onde a reta corta o eixo y)\n` +
    `y = ${f2(m)}x + ${f2(cc)}\n` +
    (Math.abs(m) > 1 ? "|m| > 1: reta íngreme → y anda sempre, x às vezes" : Math.abs(m) === 1 ? "|m| = 1: 45°" : "|m| < 1: reta deitada → x anda sempre, y às vezes"));
}
cv.addEventListener("pointerdown", e => {
  const [mx, my] = mouse(cv, e, CW);
  drag = P.findIndex(p => Math.hypot(sx(p.x) - mx, sy(p.y) - my) < 16);
  if (drag >= 0) cv.setPointerCapture(e.pointerId);
});
cv.addEventListener("pointermove", e => {
  if (drag < 0) return; const [mx, my] = mouse(cv, e, CW);
  P[drag] = { x: Math.max(-1, Math.min(18, Math.round((mx - OX) / U))), y: Math.max(0, Math.min(10, Math.round((OY - my) / U))) }; draw();
});
cv.addEventListener("pointerup", () => drag = -1);
draw();
