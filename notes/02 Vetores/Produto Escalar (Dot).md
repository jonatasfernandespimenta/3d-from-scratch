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

## Exemplo
`a = (3, 4)`, `b = (4, −1)` → `3·4 + 4·(−1) = 8` → positivo, ângulo < 90°.

## Widget
```dataviewjs
dv.view("_widgets/vectors", { mode: "dot" })
```

## Usos no renderer
- **[[Backface Culling]]**: `dot(normal, câmera − vértice) < 0` → face de costas, não desenha.
- **Iluminação flat**: brilho = `dot(normal, -direção_luz)` (mais alinhado = mais claro).
- **Projeção**: `a·b̂` = tamanho da "sombra" de a sobre b.

## Código
```c
float vec3_dot(vec3_t a, vec3_t b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
```

> [!warning] Pegadinhas
> - Resultado é **escalar**, não vetor.
> - É comutativo: `a·b = b·a` (diferente do cross).
> - Para interpretar como cosseno, os dois precisam estar normalizados.

## Ver também
- [[Produto Vetorial (Cross)]] · [[Backface Culling]] · [[Seno e Cosseno]]
