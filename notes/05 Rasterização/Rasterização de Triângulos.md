---
tags: [rasterização, algoritmo]
---
# Rasterização de Triângulos (scanline)

> [!abstract] Resumo
> Preencher um triângulo = pintar **linhas horizontais** (scanlines) de cima a baixo.
> Truque: dividir em **flat-bottom** (base reta embaixo) + **flat-top** (topo reto em cima) cortando no vértice do meio.

## Passos
1. Ordenar vértices por y: $y_0 \le y_1 \le y_2$.
2. Achar o ponto **M** no lado longo, na altura $y_1$:
$$
M_x = x_0 + \frac{(x_2 - x_0)(y_1 - y_0)}{y_2 - y_0} \qquad M_y = y_1
$$
3. **Flat-bottom** `(x0,y0) (x1,y1) (Mx,My)`: de y0 até y1, cada lado anda `1/slope` por linha.
4. **Flat-top** `(x1,y1) (Mx,My) (x2,y2)`: de y1 até y2.

$$
\text{inv\_slope} = \frac{\Delta x}{\Delta y} \quad \text{(quanto x anda quando y desce 1)}
$$

## Widget
```dataviewjs
dv.view("_widgets/triangle")
```

## Código
```c
void fill_flat_bottom(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t color) {
  float inv1 = (float)(x1 - x0) / (y1 - y0);
  float inv2 = (float)(x2 - x0) / (y2 - y0);
  float xs = x0, xe = x0;
  for (int y = y0; y <= y2; y++) {
    draw_line(xs, y, xe, y, color);
    xs += inv1;  xe += inv2;
  }
}

void fill_flat_top(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t color) {
  float inv1 = (float)(x2 - x0) / (y2 - y0);
  float inv2 = (float)(x2 - x1) / (y2 - y1);
  float xs = x2, xe = x2;
  for (int y = y2; y >= y0; y--) {     // de baixo para cima
    draw_line(xs, y, xe, y, color);
    xs -= inv1;  xe -= inv2;
  }
}

void draw_filled_triangle(int x0, int y0, int x1, int y1, int x2, int y2, uint32_t color) {
  // 1. ordenar por y (swap)
  // 2. casos especiais: y1 == y2 → só flat-bottom; y0 == y1 → só flat-top
  int my = y1;
  int mx = ((float)((x2 - x0) * (y1 - y0)) / (float)(y2 - y0)) + x0;
  fill_flat_bottom(x0, y0, x1, y1, mx, my, color);
  fill_flat_top(x1, y1, mx, my, x2, y2, color);
}
```

> [!warning] Pegadinhas
> - Divisão por zero quando um lado é horizontal (`y1 == y0`) → tratar os casos já "flat".
> - Esquecer de ordenar por y quebra tudo.
> - Alternativa moderna (GPUs): **edge functions / baricêntricas** — testa cada pixel do bounding box. Útil depois para interpolar cor/UV/z.

## Ver também
- [[Equação da Reta]] · [[DDA]] · [[Pipeline de Renderização]] · [[Produto Vetorial (Cross)]]
