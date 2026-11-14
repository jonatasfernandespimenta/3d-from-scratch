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
// Círculo unitário + gráfico de A·sin(f·x + φ)
const CW = 720, CH = 280, R = 90, CX = 125, CY = 140, GX = 260, GW = 440, YS = 55, XMAX = 4 * Math.PI;
let A = 1, F = 1, PH = 0, vel = 0.8, th = 0.6, showCos = true;
root.createDiv({ cls: "w3d-hint", text: "O ponto gira no círculo: cos = sombra no eixo x, sin = sombra no eixo y. Mexa A, f e φ no gráfico." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls();
slider("A", 0, 2, 0.05, A, v => A = v);
slider("f", 0.25, 4, 0.25, F, v => F = v);
slider("φ", 0, 6.28, 0.05, PH, v => PH = v, v => v.toFixed(2));
slider("vel.", 0, 3, 0.1, vel, v => vel = v);
check("mostrar cos", showCos, v => showCos = v);
const gx = x => GX + x / XMAX * GW;

function draw() {
  c.fillStyle = C.bg; c.fillRect(0, 0, CW, CH);
  // círculo
  c.strokeStyle = C.grid; c.lineWidth = 1;
  c.beginPath(); c.moveTo(CX - R - 15, CY); c.lineTo(CX + R + 15, CY); c.moveTo(CX, CY - R - 15); c.lineTo(CX, CY + R + 15); c.stroke();
  c.strokeStyle = C.muted; c.beginPath(); c.arc(CX, CY, R, 0, 7); c.stroke();
  const px = CX + Math.cos(th) * R, py = CY - Math.sin(th) * R;
  c.strokeStyle = C.gold; c.beginPath(); c.arc(CX, CY, 22, 0, -th, true); c.stroke();
  arrow(c, CX, CY, px, py, C.ink, 1.5, 7);
  c.lineWidth = 3; c.strokeStyle = C.blue; c.beginPath(); c.moveTo(CX, CY); c.lineTo(px, CY); c.stroke();
  c.strokeStyle = C.red; c.beginPath(); c.moveTo(px, CY); c.lineTo(px, py); c.stroke();
  c.fillStyle = C.ink; c.beginPath(); c.arc(px, py, 5, 0, 7); c.fill();
  c.fillStyle = C.blue; c.fillText("cos θ", CX - 10, CY + R + 32);
  c.fillStyle = C.red; c.fillText("sin θ", CX + R - 10, CY - R - 4 < 12 ? 14 : CY - R - 4);
  // gráfico
  c.strokeStyle = C.grid; c.lineWidth = 1;
  for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(GX, CY - i * YS); c.lineTo(GX + GW, CY - i * YS); c.stroke(); }
  c.fillStyle = C.muted;
  for (let i = 0; i <= 4; i++) { const x = gx(i * Math.PI); c.beginPath(); c.moveTo(x, CY - 2 * YS); c.lineTo(x, CY + 2 * YS); c.stroke(); c.fillText(i ? i + "π" : "0", x + 3, CY + 2 * YS + 14); }
  c.fillText("+2", GX - 22, CY - 2 * YS + 4); c.fillText("-2", GX - 22, CY + 2 * YS + 4);
  const curve = (fn, color, dash) => {
    c.strokeStyle = color; c.lineWidth = 2; c.setLineDash(dash); c.beginPath();
    for (let i = 0; i <= GW; i++) { const x = i / GW * XMAX, y = CY - fn(x) * YS; i ? c.lineTo(GX + i, y) : c.moveTo(GX + i, y); }
    c.stroke(); c.setLineDash([]);
  };
  if (showCos) curve(x => A * Math.cos(F * x + PH), C.blue, [6, 4]);
  curve(x => A * Math.sin(F * x + PH), C.red, []);
  const t = th % XMAX, yv = A * Math.sin(F * t + PH);
  c.fillStyle = C.ink; c.beginPath(); c.arc(gx(t), CY - yv * YS, 5, 0, 7); c.fill();
  c.fillStyle = C.red; c.fillText(`y = ${A}·sin(${F}·x + ${PH.toFixed(2)})`, GX + 4, 16);
  info.setText(`θ = ${(th % (2 * Math.PI)).toFixed(2)} rad = ${((th * 180 / Math.PI) % 360).toFixed(0)}°   cos θ = ${f2(Math.cos(th))}   sin θ = ${f2(Math.sin(th))}   (cos² + sin² = 1)\n` +
    `A (amplitude) = altura do pico · f (frequência) = ondas por 2π → período = 2π/f = ${(2 * Math.PI / F).toFixed(2)} · φ (fase) = desloca pro lado`);
}
loop(dt => { th += dt * vel; draw(); });
