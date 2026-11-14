---
tags: [vetores]
---
# Produto Escalar (Dot Product)

> [!abstract] Resumo
> `a · b` devolve **um número** que diz o quanto dois vetores apontam para o mesmo lado.
> `> 0` mesmo lado (< 90°) · `= 0` perpendiculares · `< 0` lados opostos (> 90°).

## Fórmulas
$$
\vec a \cdot \vec b = a_x b_x + a_y b_y + a_z b_z = \|\vec a\|\,\|\vec b\|\cos\theta
$$
$$
\theta = \arccos\!\left(\frac{\vec a \cdot \vec b}{\|\vec a\|\,\|\vec b\|}\right)
$$
Com vetores **normalizados**: $\hat a \cdot \hat b = \cos\theta$ (entre −1 e 1).

| $\hat a \cdot \hat b$ | Ângulo | Significado |
|---|---|---|
| `+1` | 0° | mesma direção |
| `0` | 90° | perpendiculares |
| `−1` | 180° | direções opostas |

## Exemplo
- 2D: `a = (3, 4)`, `b = (4, −1)` → `3·4 + 4·(−1) = 8` → positivo, ângulo < 90°.
- 3D: `a = (1, 2, 3)`, `b = (4, 5, 6)` → `1·4 + 2·5 + 3·6 = 32`.

## Widget
```dataviewjs
dv.view("_widgets/vectors", { mode: "dot" })
```

## Usos
- **[[Backface Culling]]**: `dot(normal, câmera − vértice) < 0` → face de costas, não desenha.
- **Iluminação difusa (flat)**: $I = \max(0,\ \hat N \cdot \hat L)$, com $\hat L$ apontando da superfície **para** a luz.
  ≈1 luz de frente · ≈0 luz de lado · negativo = luz por trás → vira 0.
  O **cross** dá a normal do triângulo e o **dot** diz quanta luz ele recebe.
- **Frente/atrás (game dev)**: `D = dot(forward, dir_inimigo)`, ambos normalizados.
  `D > 0` à frente · `D < 0` atrás · `D = 0` exatamente ao lado. Comparar com `cos(fov/2)` dá o cone de visão.
- **Projeção**: `a·b̂` = tamanho da "sombra" de a sobre b.

## Código
```c
float vec3_dot(vec3_t a, vec3_t b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
```

> [!warning] Pegadinhas
> - Resultado é **escalar**, não vetor.
> - É comutativo: `a·b = b·a` (diferente do cross).
> - Cross → **vetor** perpendicular; dot → **número** que mede alinhamento.
> - Para interpretar como cosseno, os dois precisam estar normalizados.

## Ver também
- [[Produto Vetorial (Cross)]] · [[Backface Culling]] · [[Seno e Cosseno]]
