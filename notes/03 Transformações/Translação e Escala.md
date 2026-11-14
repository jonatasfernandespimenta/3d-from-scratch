---
tags: [transformações]
---
# Translação e Escala

> [!abstract] Resumo
> **Translação** = mover: soma um deslocamento.
> **Escala** = redimensionar: multiplica cada eixo por um fator.

## Fórmulas
$$
\text{Translação: } (x', y', z') = (x + a,\; y + b,\; z + c)
$$
$$
\text{Escala: } (x', y', z') = (s_x x,\; s_y y,\; s_z z)
$$

## Código
```c
// translação: afastar o objeto da câmera (é isso que o renderer faz)
v.z -= camera_position.z;      // camera em z = -5 → objeto vai para z + 5

// escala
v = (vec3_t){ v.x * scale.x, v.y * scale.y, v.z * scale.z };
```

## Ordem padrão
**Escala → Rotação → Translação** (S, R, T).
- Escalar depois de transladar escala a posição também.
- Rotacionar depois de transladar gira em volta da origem (órbita), não em volta do próprio centro.

> [!warning] Pegadinhas
> - Escala negativa espelha o objeto **e inverte o winding** das faces → culling quebra.
> - Translação não é linear: não cabe numa matriz 3×3 → precisa de 4×4 ([[Matrizes de Transformação]]).

## Ver também
- [[Rotação]] · [[Matrizes de Transformação]] · [[Pipeline de Renderização]]
