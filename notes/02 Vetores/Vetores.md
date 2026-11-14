---
tags: [vetores]
---
# Vetores

> [!abstract] Resumo
> Vetor = **direção + tamanho**, guardado como componentes `(x, y)` ou `(x, y, z)`.
> Ponto = *onde*. Vetor = *quanto e para onde* (diferença entre dois pontos).

## Operações
$$
\vec a + \vec b = (a_x + b_x,\; a_y + b_y) \qquad \vec a - \vec b = (a_x - b_x,\; a_y - b_y) \qquad k\vec a = (k a_x,\; k a_y)
$$
- **Soma**: encadeia deslocamentos (ponta de um no início do outro).
- **Subtração** `B − A`: vetor que vai **de A até B**. ← usado em todo lugar (arestas, raio da câmera).
- **Escala** `k·a`: muda o tamanho; `k < 0` inverte o sentido.

## Widget
```dataviewjs
dv.view("_widgets/vectors")
```

## Código
```c
typedef struct { float x, y; } vec2_t;
typedef struct { float x, y, z; } vec3_t;

vec3_t vec3_add(vec3_t a, vec3_t b) { return (vec3_t){a.x + b.x, a.y + b.y, a.z + b.z}; }
vec3_t vec3_sub(vec3_t a, vec3_t b) { return (vec3_t){a.x - b.x, a.y - b.y, a.z - b.z}; }
vec3_t vec3_mul(vec3_t v, float k)  { return (vec3_t){v.x * k, v.y * k, v.z * k}; }
vec3_t vec3_div(vec3_t v, float k)  { return (vec3_t){v.x / k, v.y / k, v.z / k}; }
```

## Resumo das "multiplicações"
| Operação | Resultado | Para que serve |
|---|---|---|
| `k · a` | vetor | escalar tamanho |
| [[Produto Escalar (Dot)\|a · b]] | **número** | ângulo, "está de frente?", luz |
| [[Produto Vetorial (Cross)\|a × b]] | **vetor** ⟂ | normal de face, área |

> [!warning] Pegadinhas
> - `B − A` ≠ `A − B` (sentidos opostos).
> - Não existe "vetor × vetor" componente a componente nesse contexto — é dot ou cross.

## Ver também
- [[Magnitude e Normalização]] · [[Produto Escalar (Dot)]] · [[Produto Vetorial (Cross)]]
