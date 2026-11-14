---
tags: [projeção]
---
# Projeção Perspectiva (3D → 2D)

> [!abstract] Resumo
> Divide x e y pela profundidade z: **longe = pequeno**.
> $x' = \frac{f\,x}{z}$, $y' = \frac{f\,y}{z}$ — depois soma o centro da tela.

```dataviewjs
dv.view("_widgets/projection")
```

## Fórmulas
$$
x' = \frac{f \cdot x}{z} \qquad y' = \frac{f \cdot y}{z}
$$
- **f** = distância focal (no código: `fov_factor`, em pixels)
- **z** = profundidade

**Por quê?** Semelhança de triângulos: $\frac{y'}{f} = \frac{y}{z}$.

- **z maior** → objeto **menor** na tela
- **f maior** → imagem **mais ampliada** (zoom, campo de visão menor)

## Código
```c
float fov_factor = 640;

vec2_t project(vec3_t p) {
  return (vec2_t){ (fov_factor * p.x) / p.z, (fov_factor * p.y) / p.z };
}

// no update(): centralizar na tela
vec2_t s = project(v);
s.x += window_width / 2.0;
s.y += window_height / 2.0;
```

## Ortográfica (comparação)
`x' = x · escala`, `y' = y · escala` — ignora z, sem perspectiva (plantas, jogos isométricos).

## FOV em ângulo (próximo passo)
$$
f = \frac{1}{\tan(\text{fov}/2)}
$$
Na matriz de projeção 4×4, o `w` recebe o z e a divisão vira $x/w$ (*perspective divide*).

> [!warning] Pegadinhas
> - `z = 0` → divisão por zero; `z < 0` (atrás da câmera) → imagem invertida. Por isso o objeto é empurrado para `z > 0` e no futuro precisa de **clipping**.
> - Sem somar `(w/2, h/2)` o objeto fica no canto superior esquerdo.
> - y da tela é para baixo → objeto pode aparecer de cabeça para baixo.

## Ver também
- [[Pipeline de Renderização]] · [[Translação e Escala]] · [[Matrizes de Transformação]]
