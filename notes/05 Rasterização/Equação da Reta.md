---
tags: [rasterização, matemática]
---
# Equação da Reta

> [!abstract] Resumo
> $y = mx + c$ — **m** = inclinação (slope), **c** = onde corta o eixo y (y-intercept).
> $m = \frac{\Delta y}{\Delta x}$: quanto y anda quando x anda 1.

## Fórmulas
$$
y = m x + c \qquad m = \frac{\Delta y}{\Delta x} = \frac{y_1 - y_0}{x_1 - x_0} \qquad c = y_0 - m x_0
$$

```dataviewjs
dv.view("_widgets/slope")
```

## Inclinação
| m | Reta |
|---|---|
| 0 | horizontal |
| 0 < \|m\| < 1 | mais deitada → x anda sempre, y às vezes |
| \|m\| = 1 | 45° |
| \|m\| > 1 | mais em pé → y anda sempre, x às vezes |
| ∞ (Δx = 0) | vertical → **divisão por zero** |

## Por que não desenhar direto com `y = mx + c`?
Loop em x com `y = m*x + c`:
- reta **vertical** quebra (Δx = 0);
- reta **íngreme** fica com buracos (x anda 1, y pula vários pixels).

Solução: andar sempre pelo **maior lado** → [[DDA]] e [[Bresenham]].

## Ver também
- [[DDA]] · [[Bresenham]] · [[Rasterização de Triângulos]]
