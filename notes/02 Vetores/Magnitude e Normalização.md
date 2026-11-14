---
tags: [vetores]
---
# Magnitude e Normalização

> [!abstract] Resumo
> **Magnitude** = comprimento do vetor (Pitágoras).
> **Normalizar** = dividir pela magnitude → vetor de tamanho **1** (só direção).

## Fórmulas
$$
\|\vec v\| = \sqrt{v_x^2 + v_y^2} \qquad \|\vec v\| = \sqrt{v_x^2 + v_y^2 + v_z^2} \qquad \hat v = \frac{\vec v}{\|\vec v\|}
$$

## Exemplo
`v = (3, 4)` → $\sqrt{3^2 + 4^2} = \sqrt{25} = 5$ → $\hat v = (0.6,\; 0.8)$

```
      ↗ |v| = 5
     /  │ v.y = 4
    /   │
   ──────
   v.x = 3
```

## Widget
```dataviewjs
dv.view("_widgets/vectors", { mode: "magnitude" })
```

## Usos
- **Velocidade** (rapidez = magnitude do vetor velocidade)
- **Distância** entre pontos: `vec3_length(vec3_sub(b, a))`
- **Normalização**: direções puras para normais, luz, câmera
- **Movimentação**: `pos += dir_normalizada * velocidade * dt` (anda igual em qualquer direção)

## Código
```c
float vec3_length(vec3_t v) { return sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }

void vec3_normalize(vec3_t *v) {
  float len = vec3_length(*v);
  v->x /= len;  v->y /= len;  v->z /= len;
}
```

> [!warning] Pegadinhas
> - Normalizar vetor de tamanho **0** → divisão por zero (NaN).
> - Para só **comparar** distâncias, compare `x² + y²` sem `sqrt` (mais rápido).
> - Diagonal sem normalizar anda mais rápido: `(1,1)` tem tamanho 1.41.

## Ver também
- [[Vetores]] · [[Produto Escalar (Dot)]] · [[Backface Culling]]
