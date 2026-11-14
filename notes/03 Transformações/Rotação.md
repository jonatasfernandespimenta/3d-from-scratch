---
tags: [transformações]
---
# Rotação

> [!abstract] Resumo
> Girar em volta de um eixo **mantém aquele eixo** e mistura os outros dois com sin/cos.

| Eixo | Coordenadas alteradas |
|---|---|
| X | y, z |
| Y | x, z |
| Z | x, y |

## Fórmulas
Rotação em **Z** (a mesma da rotação 2D):
$$
\begin{aligned}
x' &= x\cos\theta - y\sin\theta \\
y' &= x\sin\theta + y\cos\theta \\
z' &= z
\end{aligned}
$$

> [!tip] De onde vem
> Ponto em coordenadas polares: $x = r\cos\alpha,\ y = r\sin\alpha$. Girar θ = somar ao ângulo:
> $x' = r\cos(\alpha + \theta) = r\cos\alpha\cos\theta - r\sin\alpha\sin\theta = x\cos\theta - y\sin\theta$.
> (identidade da soma de ângulos). Mesma coisa para y'.

Em **X** e **Y** é igual, trocando os eixos envolvidos.

## Widget
```dataviewjs
dv.view("_widgets/cube", { fill: true })
```

## Código (vector.c)
```c
vec3_t vec3_rotate_x(vec3_t v, float a) {
  return (vec3_t){ v.x, v.y * cos(a) - v.z * sin(a), v.y * sin(a) + v.z * cos(a) };
}
vec3_t vec3_rotate_y(vec3_t v, float a) {
  return (vec3_t){ v.x * cos(a) - v.z * sin(a), v.y, v.x * sin(a) + v.z * cos(a) };
}
vec3_t vec3_rotate_z(vec3_t v, float a) {
  return (vec3_t){ v.x * cos(a) - v.y * sin(a), v.x * sin(a) + v.y * cos(a), v.z };
}
```

> [!warning] Pegadinhas
> - **Ordem importa**: `rotX` depois `rotY` ≠ `rotY` depois `rotX`.
> - Gira em volta da **origem** → rotacionar antes de transladar.
> - Ângulo em **radianos**.
> - Combinar 3 ângulos (Euler) pode travar um eixo (gimbal lock) → quaternions resolvem (futuro).

## Ver também
- [[Seno e Cosseno]] · [[Matrizes de Transformação]] · [[Translação e Escala]]
