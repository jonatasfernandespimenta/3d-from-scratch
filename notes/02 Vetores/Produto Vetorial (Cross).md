---
tags: [vetores]
---
# Produto Vetorial (Cross Product)

> [!abstract] Resumo
> `a × b` devolve um **vetor perpendicular** aos dois (só existe em 3D).
> Uso principal: calcular a **normal de uma face** → iluminação, backface culling.

## Fórmula
$$
\vec N = \vec a \times \vec b = \begin{pmatrix} a_y b_z - a_z b_y \\ a_z b_x - a_x b_z \\ a_x b_y - a_y b_x \end{pmatrix}
$$

> [!tip] Truque para lembrar
> Cada componente usa **os outros dois** eixos, em ordem cíclica `x → y → z → x`:
> `Nx` usa y,z · `Ny` usa z,x · `Nz` usa x,y. Sempre "próximo·depois − depois·próximo".

> [!bug] Correção do caderno
> Anotei `Nz = ax·by − ay·bz`. O certo é **`Nz = ax·by − ay·bx`**.

## Magnitude = área
$$
\|\vec a \times \vec b\| = \|\vec a\|\,\|\vec b\|\sin\theta \qquad \text{Área}_{\triangle} = \frac{\|\vec a \times \vec b\|}{2}
$$
A magnitude é a área do **paralelogramo** formado por a e b; metade = área do triângulo.

## Widget
```dataviewjs
dv.view("_widgets/cross")
```

## Normal de uma face (triângulo A, B, C)
```c
vec3_t vec3_cross(vec3_t a, vec3_t b) {
  return (vec3_t){
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  };
}

vec3_t ab = vec3_sub(b, a);
vec3_t ac = vec3_sub(c, a);
vec3_t normal = vec3_cross(ab, ac);
vec3_normalize(&normal);   // só a direção importa
```

## Lembretes
- `a × b = −(b × a)` → **a ordem inverte a direção**. Por isso a ordem dos vértices (winding) importa.
- Vetores paralelos → `a × b = 0`.
- O resultado é perpendicular: `a · N = 0` e `b · N = 0` (bom teste).

> [!warning] Pegadinhas
> - Ordem dos vértices da face (horário vs anti-horário) + sistema de mão (left/right-handed) decidem pra onde a normal aponta. Meu renderer: **left-handed**, z entra na tela.

## Ver também
- [[Produto Escalar (Dot)]] · [[Backface Culling]] · [[Magnitude e Normalização]]
