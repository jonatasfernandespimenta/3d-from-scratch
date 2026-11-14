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
// Backface culling visto de cima: visível se o ângulo entre normal e (câmera − face) < 90°, i.e. dot > 0
const CW = 640, CH = 320;
let cam = { x: 80, y: 160 }, ang = 0.5, mode = input?.mode ?? "face", drag = false;
root.createDiv({ cls: "w3d-hint", text: "Arraste a câmera. Gire a face. Verde = desenha, vermelho = cull (descarta)." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls();
slider("ângulo", -3.14, 3.14, 0.01, ang, v => { ang = v; draw(); }, v => Math.round(v * 180 / Math.PI) + "°");
const bF = button("1 face", () => setMode("face")), bQ = button("cubo (4 faces)", () => setMode("cube"));
function setMode(m) { mode = m; bF.toggleClass("on", m === "face"); bQ.toggleClass("on", m === "cube"); draw(); }
const CX = 430, CY = 160;
function faces() {
  const rot = (x, y) => [CX + x * Math.cos(ang) - y * Math.sin(ang), CY + x * Math.sin(ang) + y * Math.cos(ang)];
  if (mode === "face") return [{ p: rot(0, -70), q: rot(0, 70), n: [Math.cos(ang), Math.sin(ang)] }];
  const s = 60, pts = [rot(-s, -s), rot(s, -s), rot(s, s), rot(-s, s)];
  return pts.map((p, i) => { const q = pts[(i + 1) % 4], m = [(p[0] + q[0]) / 2 - CX, (p[1] + q[1]) / 2 - CY], L = Math.hypot(...m); return { p, q, n: [m[0] / L, m[1] / L] }; });
}
function draw() {
  c.fillStyle = C.bg; c.fillRect(0, 0, CW, CH);
  let lines = [];
  faces().forEach((f, i) => {
    const mid = [(f.p[0] + f.q[0]) / 2, (f.p[1] + f.q[1]) / 2], r = [cam.x - mid[0], cam.y - mid[1]], rl = Math.hypot(...r);
    const d = (f.n[0] * r[0] + f.n[1] * r[1]) / rl, vis = d > 0, deg = Math.acos(Math.max(-1, Math.min(1, d))) * 180 / Math.PI;
    c.setLineDash([4, 5]); c.strokeStyle = "rgba(139,111,90,.6)"; c.lineWidth = 1; c.beginPath(); c.moveTo(...mid); c.lineTo(cam.x, cam.y); c.stroke();
    c.setLineDash(vis ? [] : [6, 4]); c.strokeStyle = vis ? C.green : C.red; c.lineWidth = vis ? 5 : 3;
    c.beginPath(); c.moveTo(...f.p); c.lineTo(...f.q); c.stroke(); c.setLineDash([]);
    arrow(c, ...mid, mid[0] + f.n[0] * 45, mid[1] + f.n[1] * 45, C.blue, 2);
    if (mode === "face") {
      const a0 = Math.atan2(f.n[1], f.n[0]), a1 = Math.atan2(r[1], r[0]); let dd = a1 - a0;
      while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
      c.strokeStyle = C.gold; c.lineWidth = 1.5; c.beginPath(); c.arc(...mid, 26, a0, a0 + dd, dd < 0); c.stroke();
      c.fillStyle = C.blue; c.fillText("N (normal)", mid[0] + f.n[0] * 50 + 4, mid[1] + f.n[1] * 50);
    }
    lines.push(`face ${i + 1}: ângulo(N, câmera−face) = ${deg.toFixed(0)}°  N̂·R̂ = ${d.toFixed(2)}  → ${vis ? "DESENHA" : "CULL"}`);
  });
  c.fillStyle = C.ink; c.beginPath(); c.arc(cam.x, cam.y, 9, 0, 7); c.fill(); c.fillText("câmera", cam.x - 20, cam.y + 24);
  info.setText(lines.join("\n") + "\nregra: dot(N, câmera − A) > 0  ⇔  ângulo < 90°  ⇔  face olha pra câmera");
}
cv.addEventListener("pointerdown", e => { const [x, y] = mouse(cv, e, CW); if (Math.hypot(x - cam.x, y - cam.y) < 20) { drag = true; cv.setPointerCapture(e.pointerId); } });
cv.addEventListener("pointermove", e => { if (!drag) return; const [x, y] = mouse(cv, e, CW); cam = { x: Math.max(10, Math.min(CW - 10, x)), y: Math.max(10, Math.min(CH - 10, y)) }; draw(); });
cv.addEventListener("pointerup", () => drag = false);
setMode(mode);
