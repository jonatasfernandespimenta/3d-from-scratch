# 3D from scratch

Um renderer 3D por software escrito em **C + SDL2**, do zero: sem OpenGL e sem GPU. Cada pixel é calculado na mão e escrito num color buffer.
Junto vem uma **vault Obsidian** (`notes/`) com o que estou aprendendo pelo caminho, com fórmulas, código e widgets interativos.

## Renderer

O que já funciona:
- color buffer próprio, apresentado via textura SDL
- game loop com FPS fixo
- vetores 2D/3D e rotação nos eixos X, Y e Z
- projeção perspectiva (`x' = f·x / z`)
- desenho de linhas (DDA) e triângulos em wireframe
- leitura de malhas `.obj` (`assets/f22.obj`, `assets/cube.obj`)

### Rodar

Precisa do SDL2 (`brew install sdl2`).

```sh
make run      # compila e abre em tela cheia (ESC para sair)
make clean
```

O `Makefile` aponta para o SDL2 do Homebrew em `/opt/homebrew` (Apple Silicon). Em outro sistema, ajuste `SDL2_CONFIG`.

### Estrutura

```
src/
  main.c      game loop: setup → process_input → update → render
  display.c   janela, color buffer, draw_pixel, draw_line, draw_triangle
  vector.c    vec2_t / vec3_t, rotações
  mesh.c      cubo + leitura de .obj
  array.c     array dinâmico (array_push / array_length)
assets/       modelos .obj
notes/        vault Obsidian
```

## Notas (vault Obsidian)

Abra a pasta `notes/` no Obsidian com **Open folder as vault** e ative os community plugins quando ele pedir.

- Comece por `🏠 Início.md`, um mapa na ordem do pipeline de renderização.
- As regras de escrita estão em `Instruções da Vault.md`.
- Assuntos: pixels e color buffer, vetores (magnitude, dot, cross), transformações e matrizes, projeção perspectiva, DDA/Bresenham, rasterização de triângulos, malhas OBJ, backface culling.
- **Widgets interativos** (em `notes/_widgets/`, rodam via Dataview): algoritmos de linha passo a passo, preenchimento de triângulo, cubo 3D com matriz ao vivo, vetores arrastáveis, seno/cosseno com sliders, projeção, produto vetorial e backface culling.

Já vem configurado com os plugins Dataview e Latex Suite, o tema Oat Latte e um snippet CSS próprio. As fontes são Libre Baskerville e Cascadia Code.
