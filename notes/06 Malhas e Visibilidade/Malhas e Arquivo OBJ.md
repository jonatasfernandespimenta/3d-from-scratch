---
tags: [malha]
---
# Malhas (Mesh) e Arquivo OBJ

> [!abstract] Resumo
> Malha = **lista de vértices** + **lista de faces** (cada face guarda os *índices* de 3 vértices).
> Vértices compartilhados não se repetem → economia de memória.

## Estrutura
```c
typedef struct { int a, b, c; } face_t;   // índices (OBJ começa em 1!)

typedef struct {
  vec3_t *vertices;   // array dinâmico
  face_t *faces;
  vec3_t rotation;
} mesh_t;
```
Cubo = **8 vértices**, **12 faces** (6 lados × 2 triângulos).

## Formato OBJ (texto)
```
v 1.0 1.0 -1.0        ← vértice x y z
vt 0.5 0.5            ← coordenada de textura (UV)
vn 0.0 0.0 -1.0       ← normal
f 1/1/1 2/2/1 3/3/1   ← face: vértice/textura/normal (índices começam em 1)
```

## Código (leitura)
```c
while (fgets(line, sizeof line, f)) {
  if (strncmp(line, "v ", 2) == 0) {
    vec3_t v;
    sscanf(line, "v %f %f %f", &v.x, &v.y, &v.z);
    array_push(mesh.vertices, v);
  }
  if (strncmp(line, "f ", 2) == 0) {
    face_t face;
    sscanf(line, "f %d/%*d/%*d %d/%*d/%*d %d/%*d/%*d", &face.a, &face.b, &face.c);
    array_push(mesh.faces, face);
  }
}
// uso: mesh.vertices[face.a - 1]
```

> [!warning] Pegadinhas
> - Índices do OBJ começam em **1** → `- 1` ao acessar o array.
> - `%*d` lê e descarta (pula textura/normal).
> - Faces com 4+ vértices (quads) ou formato `f 1 2 3` / `f 1//1` quebram esse `sscanf`. Exportar do Blender com **Triangulate Faces**.
> - Buffer de linha pequeno (100) corta linhas longas.
> - Checar `fopen` != NULL.

## Ver também
- [[Pipeline de Renderização]] · [[Backface Culling]] · [[Produto Vetorial (Cross)]]
