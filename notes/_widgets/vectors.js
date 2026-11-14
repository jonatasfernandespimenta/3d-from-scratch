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
// Vetores 2D arrastáveis. input: { mode: "magnitude" | "dot" | "all" }
const CW = 640, CH = 400, OX = 320, OY = 200, U = 40, mode = input?.mode ?? "all";
let a = { x: 3, y: 4 }, b = { x: 4, y: -1 }, drag = null;
let showB = mode !== "magnitude", sum = mode === "all", norm = mode !== "dot", proj = mode === "dot", comps = true;
root.createDiv({ cls: "w3d-hint", text: "Arraste a ponta dos vetores (encaixa de 0.5 em 0.5). Aqui y aponta pra cima, como na matemática." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls();
check("componentes", comps, v => { comps = v; draw(); });
check("vetor b", showB, v => { showB = v; draw(); });
check("a + b", sum, v => { sum = v; draw(); });
check("normalizado â", norm, v => { norm = v; draw(); });
check("projeção de a em b", proj, v => { proj = v; draw(); });
const sx = x => OX + x * U, sy = y => OY - y * U, len = v => Math.hypot(v.x, v.y);

function draw() {
  c.fillStyle = C.cell; c.fillRect(0, 0, CW, CH);
  c.lineWidth = 1;
  for (let x = -8; x <= 8; x++) { c.strokeStyle = x ? C.grid : C.muted; c.beginPath(); c.moveTo(sx(x), 0); c.lineTo(sx(x), CH); c.stroke(); }
  for (let y = -5; y <= 5; y++) { c.strokeStyle = y ? C.grid : C.muted; c.beginPath(); c.moveTo(0, sy(y)); c.lineTo(CW, sy(y)); c.stroke(); }
  if (comps) {
    c.setLineDash([4, 4]); c.strokeStyle = C.acc; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(sx(a.x), sy(a.y)); c.lineTo(sx(a.x), sy(0)); c.moveTo(sx(a.x), sy(a.y)); c.lineTo(sx(0), sy(a.y)); c.stroke(); c.setLineDash([]);
    c.fillStyle = C.acc; c.fillText(`a.x = ${a.x}`, sx(a.x / 2) - 22, sy(0) + (a.y >= 0 ? 16 : -8)); c.fillText(`a.y = ${a.y}`, sx(a.x) + 6, sy(a.y / 2));
  }
  if (showB && sum) {
    const s = { x: a.x + b.x, y: a.y + b.y };
    c.setLineDash([3, 5]); c.strokeStyle = C.muted; c.lineWidth = 1;
    c.beginPath(); c.moveTo(sx(a.x), sy(a.y)); c.lineTo(sx(s.x), sy(s.y)); c.lineTo(sx(b.x), sy(b.y)); c.stroke(); c.setLineDash([]);
    arrow(c, sx(0), sy(0), sx(s.x), sy(s.y), C.green, 2.5); c.fillStyle = C.green; c.fillText("a+b", sx(s.x) + 6, sy(s.y) - 6);
  }
  if (showB && proj && len(b) > 0) {
    const t = (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y), p = { x: b.x * t, y: b.y * t };
    c.setLineDash([2, 3]); c.strokeStyle = C.ink; c.lineWidth = 1; c.beginPath(); c.moveTo(sx(a.x), sy(a.y)); c.lineTo(sx(p.x), sy(p.y)); c.stroke(); c.setLineDash([]);
    c.strokeStyle = "rgba(199,154,58,.9)"; c.lineWidth = 6; c.beginPath(); c.moveTo(sx(0), sy(0)); c.lineTo(sx(p.x), sy(p.y)); c.stroke();
  }
  if (showB) {
    const aa = Math.atan2(a.y, a.x), ab = Math.atan2(b.y, b.x);
    let d = ab - aa; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    c.strokeStyle = C.gold; c.lineWidth = 1.5; c.beginPath(); c.arc(OX, OY, 30, -aa, -(aa + d), d > 0); c.stroke();
    arrow(c, sx(0), sy(0), sx(b.x), sy(b.y), C.blue, 3); c.fillStyle = C.blue; c.fillText(`b (${b.x}, ${b.y})`, sx(b.x) + 8, sy(b.y) + 14);
  }
  arrow(c, sx(0), sy(0), sx(a.x), sy(a.y), C.acc, 3);
  c.fillStyle = C.acc; c.fillText(`a (${a.x}, ${a.y})`, sx(a.x) + 8, sy(a.y) - 8);
  c.fillText(`|a| = ${len(a).toFixed(2)}`, sx(a.x / 2) - 70, sy(a.y / 2) - 6);
  if (norm && len(a) > 0) { arrow(c, sx(0), sy(0), sx(a.x / len(a)), sy(a.y / len(a)), C.ink, 3, 7); c.fillStyle = C.ink; c.fillText("â", sx(a.x / len(a)) - 16, sy(a.y / len(a)) - 4); }

  const la = len(a), lb = len(b), dot = a.x * b.x + a.y * b.y;
  let t = `a = (${a.x}, ${a.y})   |a| = √(${a.x}² + ${a.y}²) = √${a.x * a.x + a.y * a.y} = ${la.toFixed(3)}`;
  if (la) t += `\nâ = a / |a| = (${f2(a.x / la)}, ${f2(a.y / la)})   |â| = 1`;
  if (showB) {
    t += `\nb = (${b.x}, ${b.y})   |b| = ${lb.toFixed(3)}`;
    if (sum) t += `\na + b = (${a.x + b.x}, ${a.y + b.y})`;
    t += `\na · b = ax·bx + ay·by = ${a.x}·${b.x} + ${a.y}·${b.y} = ${dot}`;
    if (la && lb) {
      const ang = Math.acos(Math.max(-1, Math.min(1, dot / (la * lb)))) * 180 / Math.PI;
      t += `\nθ = acos(a·b / (|a||b|)) = ${ang.toFixed(1)}°  →  ` + (Math.abs(dot) < 1e-9 ? "perpendiculares (dot = 0)" : dot > 0 ? "dot > 0: mesmo lado (< 90°)" : "dot < 0: lados opostos (> 90°)");
      if (proj) t += `\nprojeção de a em b (dourado) = (a·b / |b|) = ${(dot / lb).toFixed(2)} de comprimento`;
    }
  }
  info.setText(t);
}
const snap = v => Math.round(v * 2) / 2;
cv.addEventListener("pointerdown", e => {
  const [mx, my] = mouse(cv, e, CW), near = v => Math.hypot(sx(v.x) - mx, sy(v.y) - my) < 16;
  drag = near(a) ? a : showB && near(b) ? b : null;
  if (drag) cv.setPointerCapture(e.pointerId);
});
cv.addEventListener("pointermove", e => {
  if (!drag) return; const [mx, my] = mouse(cv, e, CW);
  drag.x = Math.max(-8, Math.min(8, snap((mx - OX) / U))); drag.y = Math.max(-5, Math.min(5, snap((OY - my) / U))); draw();
});
cv.addEventListener("pointerup", () => drag = null);
draw();
