---
tags: [rasterização, algoritmo]
---
# Bresenham

> [!abstract] Resumo
> **Super rápido.** Desenha retas só com **inteiros**: guarda um *erro* (quão longe o pixel está da reta ideal) e decide a cada passo se anda em x, em y ou nos dois.

## Ideia
- `dx = |x1 − x0|`, `dy = −|y1 − y0|` (negativo de propósito), `err = dx + dy`.
- A cada pixel: `e2 = 2·err`
  - `e2 ≥ dy` → anda em **x**, `err += dy`
  - `e2 ≤ dx` → anda em **y**, `err += dx`
- Os dois testes podem passar → passo diagonal.

## Widget
```dataviewjs
dv.view("_widgets/line", { algo: "bresenham" })
```
Ative "comparar com o outro" para ver o DDA por cima.

## Código (todos os octantes)
```c
void draw_line_bresenham(int x0, int y0, int x1, int y1, uint32_t color) {
  int dx =  abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  int dy = -abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  int err = dx + dy;

  while (1) {
    draw_pixel(x0, y0, color);
    if (x0 == x1 && y0 == y1) break;
    int e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}
```

> [!tip] Por que é rápido
> Sem `float`, sem divisão, sem `round` dentro do laço. Só soma, multiplicação por 2 (shift) e comparação.

> [!warning] Pegadinhas
> - O `dy` é **negativo** nessa versão — é o que permite o mesmo código servir para todos os octantes.
> - Os dois `if` são independentes (não é `else if`).

## Ver também
- [[DDA]] · [[Equação da Reta]] · [[Rasterização de Triângulos]]
