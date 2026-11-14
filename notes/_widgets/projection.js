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
// Projeção perspectiva vista de lado (plano y-z): y' = f·y / z
const CW = 680, CH = 300, X0 = 50, Y0 = 200, S = 60;
let f = 1.5, z = 5, y = 2, ghost = true;
root.createDiv({ cls: "w3d-hint", text: "Vista de lado. A câmera está na origem olhando para +z. O plano 2D (tela) fica a uma distância f." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls();
slider("f", 0.5, 4, 0.1, f, v => { f = v; draw(); });
slider("z", 1, 10, 0.1, z, v => { z = v; draw(); });
slider("y", 0.3, 2.6, 0.1, y, v => { y = v; draw(); });
check("objeto igual 3 unidades mais longe", ghost, v => { ghost = v; draw(); });
const px = zz => X0 + zz * S, py = yy => Y0 - yy * S;

function obj(zz, color) {
  const yp = f * y / zz;
  c.strokeStyle = color; c.lineWidth = 1; c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(zz), py(y)); c.stroke();
  arrow(c, px(zz), py(0), px(zz), py(y), color, 4);
  c.strokeStyle = color; c.lineWidth = 6; c.globalAlpha = .7; c.beginPath(); c.moveTo(px(f), py(0)); c.lineTo(px(f), py(yp)); c.stroke(); c.globalAlpha = 1;
  c.fillStyle = color; c.beginPath(); c.arc(px(f), py(yp), 4, 0, 7); c.fill();
  return yp;
}
function draw() {
  c.fillStyle = C.bg; c.fillRect(0, 0, CW, CH);
  c.setLineDash([6, 5]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, Y0); c.lineTo(CW - 10, Y0); c.stroke(); c.setLineDash([]);
  c.fillStyle = C.muted; c.fillText("z (profundidade) →", CW - 130, Y0 + 16);
  for (let i = 1; i <= 10; i++) c.fillText(i, px(i) - 3, Y0 + 32);
  c.strokeStyle = C.ink; c.lineWidth = 2; c.beginPath(); c.moveTo(px(f), py(2.8)); c.lineTo(px(f), py(-1.4)); c.stroke();
  c.fillStyle = C.ink; c.fillText("plano 2D", px(f) + 5, py(-1.3));
  c.fillStyle = C.ink; c.fillRect(X0 - 22, Y0 - 9, 18, 18); c.beginPath(); c.moveTo(X0 - 4, Y0); c.lineTo(X0 + 6, Y0 - 8); c.lineTo(X0 + 6, Y0 + 8); c.fill();
  c.fillText("câmera", X0 - 28, Y0 + 26);
  c.strokeStyle = C.gold; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px(0), Y0 + 45); c.lineTo(px(f), Y0 + 45); c.stroke();
  c.fillStyle = C.gold; c.fillText("f", px(f / 2) - 3, Y0 + 58);
  let yg = null;
  if (ghost && z + 3 <= 13) yg = obj(z + 3, C.muted);
  const yp = obj(z, C.acc);
  c.fillStyle = C.acc; c.fillText(`objeto 3D (y=${y})`, px(z) + 8, py(y) - 4);
  c.fillStyle = C.blue; c.fillText(`y' = ${yp.toFixed(2)}`, px(f) + 8, py(yp) + 4);
  info.setText(`y' = f · y / z = ${f} · ${y} / ${z} = ${yp.toFixed(3)}   (x' = f · x / z é igual, no outro eixo)\n` +
    (yg !== null ? `mesmo objeto em z = ${(z + 3).toFixed(1)} → y' = ${yg.toFixed(3)}   → z maior = menor na tela\n` : "") +
    `f maior = plano mais longe da câmera = imagem mais ampliada (zoom / FOV menor)`);
}
draw();
