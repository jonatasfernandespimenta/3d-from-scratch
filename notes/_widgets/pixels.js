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
// Grade de pixels + color buffer 1D. input: { w, h }
const W = input?.w ?? 12, H = input?.h ?? 8, CS = 34, OX = 34, OY = 26, SW = 6;
const CW = Math.max(OX + W * CS, OX + W * H * SW) + 20, CH = OY + H * CS + 76;
root.createDiv({ cls: "w3d-hint", text: "Passe o mouse num pixel → veja onde ele mora no color buffer. Clique para pintar." });
const [cv, c] = canvas(CW, CH);
const info = root.createDiv({ cls: "w3d-info" });
controls(); button("Limpar", () => { buf.fill(0); draw(); });
const buf = new Uint8Array(W * H); let hov = -1;

function draw() {
  c.fillStyle = C.bg; c.fillRect(0, 0, CW, CH);
  c.fillStyle = C.muted; c.textAlign = "center";
  for (let x = 0; x < W; x++) c.fillText(x, OX + x * CS + CS / 2, OY - 9);
  c.textAlign = "right";
  for (let y = 0; y < H; y++) c.fillText(y, OX - 8, OY + y * CS + CS / 2 + 4);
  c.textAlign = "left"; c.fillText("x →", OX + W * CS + 4, OY - 9); c.fillText("y ↓", 4, OY + H * CS + 14);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    c.fillStyle = buf[i] ? C.acc : i === hov ? "#ead9bf" : C.cell;
    c.fillRect(OX + x * CS, OY + y * CS, CS, CS);
    c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(OX + x * CS + .5, OY + y * CS + .5, CS, CS);
  }
  const sy = OY + H * CS + 34;
  c.fillStyle = C.muted; c.fillText("color_buffer[]  (as linhas ficam uma atrás da outra)", OX, sy - 9);
  for (let i = 0; i < W * H; i++) {
    const row = Math.floor(i / W);
    c.fillStyle = buf[i] ? C.acc : row % 2 ? "#e6d6bb" : "#f6eee0";
    c.fillRect(OX + i * SW, sy, SW - 1, 18);
  }
  if (hov >= 0) {
    const x = hov % W, y = Math.floor(hov / W);
    c.strokeStyle = C.ink; c.lineWidth = 2; c.strokeRect(OX + x * CS + 1, OY + y * CS + 1, CS - 2, CS - 2);
    const mx = OX + hov * SW + SW / 2;
    c.fillStyle = C.ink; c.beginPath(); c.moveTo(mx, sy + 21); c.lineTo(mx - 5, sy + 30); c.lineTo(mx + 5, sy + 30); c.fill();
    c.textAlign = "center"; c.fillText(hov, mx, sy + 42);
    info.setText(`pixel (x=${x}, y=${y})\níndice = y · largura + x = ${y} · ${W} + ${x} = ${hov}\nde volta: x = ${hov} % ${W} = ${x},  y = ${hov} / ${W} = ${y} (divisão inteira)`);
  } else info.setText(`tela ${W}×${H} = ${W * H} pixels → color_buffer tem ${W * H} posições (uint32_t cada, 0xAARRGGBB)`);
}
cv.addEventListener("pointermove", e => {
  const [px, py] = mouse(cv, e, CW), x = Math.floor((px - OX) / CS), y = Math.floor((py - OY) / CS);
  hov = x >= 0 && x < W && y >= 0 && y < H ? y * W + x : -1; draw();
});
cv.addEventListener("pointerleave", () => { hov = -1; draw(); });
cv.addEventListener("pointerdown", () => { if (hov >= 0) { buf[hov] ^= 1; draw(); } });
draw();
