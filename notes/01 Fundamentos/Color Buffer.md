---
tags: [fundamentos, 2d]
---
# Color Buffer (Framebuffer)

> [!abstract] Resumo
> **Array 1D** que guarda a cor de cada pixel. As linhas da tela ficam uma atrás da outra.
> `índice = y · largura + x`

## Fórmula
$$
i = y \cdot w + x \qquad x = i \bmod w \qquad y = \left\lfloor \frac{i}{w} \right\rfloor
$$

## Exemplo
Pixel `(2, 1)` com largura `4` → `1 · 4 + 2 = 6`.

```
índice:  0 1 2 3 | 4 5 6 7 | 8 ...
linha:   ─ y=0 ─   ─ y=1 ─
```

## Widget
```dataviewjs
dv.view("_widgets/pixels", { w: 12, h: 8 })
```

## Código
```c
uint32_t *color_buffer = malloc(sizeof(uint32_t) * window_width * window_height);

void clear_color_buffer(uint32_t color) {
  for (int y = 0; y < window_height; y++)
    for (int x = 0; x < window_width; x++)
      color_buffer[(window_width * y) + x] = color;
}

// todo frame: copia o buffer para uma textura SDL e mostra
SDL_UpdateTexture(color_buffer_texture, NULL, color_buffer, window_width * sizeof(uint32_t));
SDL_RenderCopy(renderer, color_buffer_texture, NULL, NULL);
```

## Cor em `uint32_t`
`0xAARRGGBB` (formato `SDL_PIXELFORMAT_ARGB8888`): 1 byte para cada canal.
- `0xFFFF0000` = vermelho opaco · `0xFFFFFF00` = amarelo · `0xFF000000` = preto

> [!warning] Pegadinhas
> - Multiplicar por **largura**, não altura.
> - O *pitch* do `SDL_UpdateTexture` é em **bytes por linha** (`w * sizeof(uint32_t)`), não pixels.
> - Limpar o buffer todo frame, senão o frame anterior fica "rastro".

## Ver também
- [[Pixels e Coordenadas 2D]] · [[Game Loop e FPS]]
