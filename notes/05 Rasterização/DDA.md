---
tags: [rasterização, algoritmo]
---
# DDA (Digital Differential Analyzer)

> [!abstract] Resumo
> **Fácil de entender.** Anda `n = max(|Δx|, |Δy|)` passos; a cada passo soma um incremento em float e arredonda.
> Um eixo anda 1 por passo, o outro anda `< 1`.

## Algoritmo
$$
n = \max(|\Delta x|, |\Delta y|) \qquad x_{inc} = \frac{\Delta x}{n} \qquad y_{inc} = \frac{\Delta y}{n}
$$
Repetir `n + 1` vezes: pinta `(round(x), round(y))`, depois `x += x_inc`, `y += y_inc`.

## Widget
```dataviewjs
dv.view("_widgets/line", { algo: "dda" })
```

## Código (display.c)
```c
void draw_line(int x0, int y0, int x1, int y1, uint32_t color) {
  int delta_x = x1 - x0;
  int delta_y = y1 - y0;
  int side = abs(delta_x) >= abs(delta_y) ? abs(delta_x) : abs(delta_y);

  float x_inc = delta_x / (float)side;
  float y_inc = delta_y / (float)side;

  float x = x0, y = y0;
  for (int i = 0; i <= side; i++) {
    draw_pixel(round(x), round(y), color);
    x += x_inc;
    y += y_inc;
  }
}
```

## DDA × Bresenham
| | DDA | [[Bresenham]] |
|---|---|---|
| Contas | float + `round` | só inteiros (soma e compara) |
| Velocidade | ok | **super rápido** |
| Clareza | **muito clara** | precisa entender o "erro" |
| Resultado | praticamente igual | praticamente igual |

> [!warning] Pegadinhas
> - `side == 0` (P0 == P1) → divisão por zero. Tratar ou garantir que não acontece.
> - `delta_x / side` com dois `int` = divisão inteira → precisa do cast `(float)`.
> - Erro de float acumula em linhas muito longas.

## Ver também
- [[Equação da Reta]] · [[Bresenham]] · [[Pixels e Coordenadas 2D]]
