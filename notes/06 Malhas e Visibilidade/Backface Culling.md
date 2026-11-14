---
tags: [visibilidade, otimização]
---
# Backface Culling

> [!abstract] Resumo
> Não desenhar faces que estão **de costas** para a câmera (~metade das faces de um objeto fechado).
> Se o ângulo entre a **normal da face** e o **raio para a câmera** é **< 90°** → desenha. Senão → **cull**.

## Regra
$$
\vec N = (B - A) \times (C - A) \qquad \vec R = \text{câmera} - A
$$
$$
\vec N \cdot \vec R > 0 \;\Rightarrow\; \text{desenha} \qquad \vec N \cdot \vec R \le 0 \;\Rightarrow\; \text{cull}
$$
O dot é > 0 exatamente quando o ângulo é < 90° (ver [[Produto Escalar (Dot)]]).

- **Normal da face**: direção para onde a superfície aponta → [[Produto Vetorial (Cross)]].

## Widget — vista de cima
```dataviewjs
dv.view("_widgets/backface", { mode: "face" })
```

## Widget — no cubo
Ligue *backface culling* e *normais*:
```dataviewjs
dv.view("_widgets/cube", { cull: true, normals: true })
```

## Código
```c
vec3_t camera_position = {0, 0, 0};

// v[0..2] = vértices JÁ transformados (rotação + translação)
vec3_t ab = vec3_sub(v[1], v[0]);
vec3_t ac = vec3_sub(v[2], v[0]);
vec3_t normal = vec3_cross(ab, ac);
vec3_normalize(&normal);

vec3_t camera_ray = vec3_sub(camera_position, v[0]);
if (vec3_dot(normal, camera_ray) < 0) continue;   // de costas → pula
```

> [!warning] Pegadinhas
> - Depende da **ordem dos vértices** (winding). Inverter a ordem inverte a normal → culla as faces erradas.
> - Fazer **depois** de transformar e **antes** de projetar.
> - Só serve para objetos **fechados** (um plano solto some quando visto por trás).
> - Não resolve sobreposição de faces da frente → isso é o **z-buffer** / algoritmo do pintor.

## Ver também
- [[Produto Escalar (Dot)]] · [[Produto Vetorial (Cross)]] · [[Malhas e Arquivo OBJ]] · [[Pipeline de Renderização]]
