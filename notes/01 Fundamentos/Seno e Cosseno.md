---
tags: [fundamentos, matemática]
---
# Seno e Cosseno

> [!abstract] Resumo
> Num círculo de raio 1, um ponto no ângulo θ está em $(\cos\theta, \sin\theta)$.
> **cos = sombra no eixo x, sin = sombra no eixo y.** É a base de toda [[Rotação]].

## Fórmulas
$$
P = (r\cos\theta,\; r\sin\theta) \qquad \cos^2\theta + \sin^2\theta = 1
$$
$$
\text{rad} = \text{graus} \cdot \frac{\pi}{180} \qquad 90^\circ = \tfrac{\pi}{2} \quad 180^\circ = \pi \quad 360^\circ = 2\pi
$$

Onda: $y = A \cdot \sin(f \cdot x + \varphi)$
- **A** amplitude → altura · **f** frequência → período $= 2\pi / f$ · **φ** fase → desloca para o lado

## Widget
```dataviewjs
dv.view("_widgets/sine")
```

## Valores para decorar
| θ | 0 | 30° | 45° | 60° | 90° |
|---|---|---|---|---|---|
| sin | 0 | 0.5 | 0.707 | 0.866 | 1 |
| cos | 1 | 0.866 | 0.707 | 0.5 | 0 |

## Código
```c
#include <math.h>
float x = cos(angle);   // angle em RADIANOS
float y = sin(angle);
float a = acos(dot);    // inverso: de volta ao ângulo (ver Produto Escalar)
```

> [!warning] Pegadinhas
> - `sin`/`cos` da `math.h` usam **radianos**, nunca graus.
> - Linkar com `-lm`.
> - Na tela (y para baixo) o ângulo positivo gira no **sentido horário** visualmente.

## Ver também
- [[Rotação]] · [[Produto Escalar (Dot)]] · [[Produto Vetorial (Cross)]]
