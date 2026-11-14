---
tags: [fundamentos, 2d]
---
# Pixels e Coordenadas 2D

> [!abstract] Resumo
> A tela é uma **grade de pixels**. Cada pixel tem uma coordenada `(x, y)` e uma cor.
> Origem `(0,0)` no **canto superior esquerdo**: x cresce → direita, **y cresce ↓ para baixo**.

## Vocabulário
| Termo | O que é |
|---|---|
| **Vértice** | ponto com coordenadas (`A`, `B`, `C`…) |
| **Aresta** (edge) | linha entre dois vértices |
| **Face** | polígono fechado por arestas (no renderer: sempre triângulo) |
| **Rasterização** | decidir **quais pixels** pintar para desenhar uma forma |

```
    x→ 0   1   2   3   4
 y↓ 0
    1      A───────B
    2      │       │
    3      D───────C
```

## Widget
```dataviewjs
dv.view("_widgets/pixels")
```

## Código
```c
void draw_pixel(int x, int y, uint32_t color) {
  if (x >= 0 && x < window_width && y >= 0 && y < window_height) {
    color_buffer[(window_width * y) + x] = color;
  }
}
```

> [!warning] Pegadinhas
> - **y para baixo**: na matemática y sobe, na tela desce. Por isso objetos podem aparecer de cabeça para baixo.
> - Pixel é **inteiro**. Coordenadas calculadas em `float` precisam de `round()`/cast antes de pintar.
> - Sempre checar limites (o `if` acima) — escrever fora da tela corrompe memória.

## Ver também
- [[Color Buffer]] · [[DDA]] · [[Rasterização de Triângulos]]
