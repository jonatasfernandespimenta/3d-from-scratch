---
tags: [transformações, matrizes]
---
# Matrizes de Transformação

> [!abstract] Resumo
> Toda rotação/escala é uma **matriz** que multiplica o vetor.
> Vantagem: várias transformações **viram uma matriz só** (multiplica as matrizes uma vez, aplica em todos os vértices).

## Matriz × vetor
Cada linha da matriz faz um dot com o vetor:
$$
\begin{pmatrix} x' \\ y' \\ z' \end{pmatrix} =
\begin{pmatrix} m_{00} & m_{01} & m_{02} \\ m_{10} & m_{11} & m_{12} \\ m_{20} & m_{21} & m_{22} \end{pmatrix}
\begin{pmatrix} x \\ y \\ z \end{pmatrix}
\quad\Rightarrow\quad x' = m_{00}x + m_{01}y + m_{02}z
$$
> [!tip] Leitura visual
> **As colunas da matriz são para onde os eixos x, y, z vão.** No widget, gire o cubo e veja as colunas.

## Rotações
$$
R_z = \begin{pmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{pmatrix}
\quad
R_x = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta \\ 0 & \sin\theta & \cos\theta \end{pmatrix}
\quad
R_y = \begin{pmatrix} \cos\theta & 0 & -\sin\theta \\ 0 & 1 & 0 \\ \sin\theta & 0 & \cos\theta \end{pmatrix}
$$
($R_y$ com o sinal do meu `vec3_rotate_y`; em livros right-handed os sinais do sin aparecem trocados.)

Escala: $S = \text{diag}(s_x, s_y, s_z)$

## Combinar
Aplicar `y → x → z` (como no `update()`) = $M = R_z \cdot R_x \cdot R_y$ → **lê da direita para a esquerda**.

## Widget
```dataviewjs
dv.view("_widgets/cube")
```

## 4×4 e coordenadas homogêneas (próximo passo)
Translação não cabe em 3×3. Truque: vetor vira `(x, y, z, 1)`.
$$
T = \begin{pmatrix} 1 & 0 & 0 & t_x \\ 0 & 1 & 0 & t_y \\ 0 & 0 & 1 & t_z \\ 0 & 0 & 0 & 1 \end{pmatrix}
\qquad
M_{\text{world}} = T \cdot R \cdot S
$$

## Código
```c
typedef struct { float m[4][4]; } mat4_t;

vec4_t mat4_mul_vec4(mat4_t m, vec4_t v) {
  vec4_t r;
  r.x = m.m[0][0]*v.x + m.m[0][1]*v.y + m.m[0][2]*v.z + m.m[0][3]*v.w;
  r.y = m.m[1][0]*v.x + m.m[1][1]*v.y + m.m[1][2]*v.z + m.m[1][3]*v.w;
  r.z = m.m[2][0]*v.x + m.m[2][1]*v.y + m.m[2][2]*v.z + m.m[2][3]*v.w;
  r.w = m.m[3][0]*v.x + m.m[3][1]*v.y + m.m[3][2]*v.z + m.m[3][3]*v.w;
  return r;
}
```

> [!warning] Pegadinhas
> - `A·B ≠ B·A` → ordem das matrizes importa.
> - `w = 1` para pontos (transladam), `w = 0` para direções/normais (não transladam).

## Ver também
- [[Rotação]] · [[Translação e Escala]] · [[Produto Escalar (Dot)]] · [[Projeção Perspectiva]]
