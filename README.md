# 3D from scratch

Um renderer 3D por software escrito em **C + SDL2**, do zero: sem OpenGL e sem GPU. Cada pixel é calculado na mão e escrito num color buffer.
Feito acompanhando o curso [3D Computer Graphics Programming](https://pikuma.com/courses/learn-3d-computer-graphics-programming), da Pikuma.

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

A pasta `notes/` é um caderno de estudo de computação gráfica: cada conceito do curso virou uma nota curta e prática, feita para **consulta rápida**. A ideia é abrir uma nota e relembrar o assunto em menos de 2 minutos.
Dá para usar mesmo sem fazer o curso, como material de estudo ou de revisão.

### Como abrir
1. Instale o [Obsidian](https://obsidian.md) (gratuito).
2. Clone o repo e, no Obsidian, use **Open folder as vault** → escolha a pasta `notes/`.
3. Quando ele perguntar, clique em **Trust author and enable plugins**. Os plugins já vêm no repo, não precisa baixar nada.
4. Abra `🏠 Início`.

Opcional: instale as fontes [Libre Baskerville](https://fonts.google.com/specimen/Libre+Baskerville) e [Cascadia Code](https://github.com/microsoft/cascadia-code). Sem elas, o Obsidian usa Georgia e a fonte monoespaçada do sistema.

> Dá para ler as notas direto no GitHub (o texto e as fórmulas LaTeX aparecem), mas os **widgets interativos só rodam dentro do Obsidian**. No GitHub eles aparecem como um bloco de código.

### Formato das notas
Toda nota segue a mesma estrutura ([template](notes/_templates/Conceito.md)):

| Seção | O que tem |
|---|---|
| **Resumo** | a essência em 1–3 linhas |
| **Fórmula** | em LaTeX |
| **Código** | em C, no mesmo estilo do renderer (`vec3_t`, `draw_pixel`…) |
| **Widget** | visualização interativa, quando existe |
| **Pegadinhas** | erros comuns (divisão por zero, radianos × graus, ordem das operações…) |
| **Ver também** | links para os conceitos relacionados |

### Conteúdo

Comece pelo [Pipeline de Renderização](notes/01%20Fundamentos/Pipeline%20de%20Renderiza%C3%A7%C3%A3o.md), que mostra como tudo se encaixa num diagrama.

| Tema | Notas |
|---|---|
| Fundamentos | [Pixels e Coordenadas 2D](notes/01%20Fundamentos/Pixels%20e%20Coordenadas%202D.md) · [Color Buffer](notes/01%20Fundamentos/Color%20Buffer.md) · [Game Loop e FPS](notes/01%20Fundamentos/Game%20Loop%20e%20FPS.md) · [Seno e Cosseno](notes/01%20Fundamentos/Seno%20e%20Cosseno.md) |
| Vetores | [Vetores](notes/02%20Vetores/Vetores.md) · [Magnitude e Normalização](notes/02%20Vetores/Magnitude%20e%20Normaliza%C3%A7%C3%A3o.md) · [Produto Escalar (Dot)](notes/02%20Vetores/Produto%20Escalar%20%28Dot%29.md) · [Produto Vetorial (Cross)](notes/02%20Vetores/Produto%20Vetorial%20%28Cross%29.md) |
| Transformações | [Translação e Escala](notes/03%20Transforma%C3%A7%C3%B5es/Transla%C3%A7%C3%A3o%20e%20Escala.md) · [Rotação](notes/03%20Transforma%C3%A7%C3%B5es/Rota%C3%A7%C3%A3o.md) · [Matrizes de Transformação](notes/03%20Transforma%C3%A7%C3%B5es/Matrizes%20de%20Transforma%C3%A7%C3%A3o.md) |
| Projeção | [Projeção Perspectiva](notes/04%20Proje%C3%A7%C3%A3o/Proje%C3%A7%C3%A3o%20Perspectiva.md) |
| Rasterização | [Equação da Reta](notes/05%20Rasteriza%C3%A7%C3%A3o/Equa%C3%A7%C3%A3o%20da%20Reta.md) · [DDA](notes/05%20Rasteriza%C3%A7%C3%A3o/DDA.md) · [Bresenham](notes/05%20Rasteriza%C3%A7%C3%A3o/Bresenham.md) · [Rasterização de Triângulos](notes/05%20Rasteriza%C3%A7%C3%A3o/Rasteriza%C3%A7%C3%A3o%20de%20Tri%C3%A2ngulos.md) |
| Malhas e visibilidade | [Malhas e Arquivo OBJ](notes/06%20Malhas%20e%20Visibilidade/Malhas%20e%20Arquivo%20OBJ.md) · [Backface Culling](notes/06%20Malhas%20e%20Visibilidade/Backface%20Culling.md) |

### Widgets interativos

Ficam em [`notes/_widgets/`](notes/_widgets), são escritos em JS puro com canvas e rodam pelo plugin Dataview.

| Widget | O que dá para fazer |
|---|---|
| `pixels` | passar o mouse na grade e ver o índice no color buffer (`y·largura + x`) |
| `slope` | arrastar dois pontos e ver Δx, Δy, `m` e `c` da reta |
| `line` | ver **DDA** e **Bresenham** passo a passo, com as variáveis de cada iteração, e comparar os dois |
| `triangle` | ver a rasterização por scanline (flat-bottom + flat-top), linha por linha |
| `sine` | seno e cosseno no círculo unitário, com sliders de amplitude, frequência e fase |
| `vectors` | arrastar vetores e ver componentes, magnitude, normalização, soma, dot e ângulo |
| `cube` | girar um cubo, mover vértices, ligar culling e normais, e ver a **matriz de rotação ao vivo** |
| `projection` | vista lateral da câmera: mexer em `f`, `z` e `y` e ver `y' = f·y/z` |
| `cross` | produto vetorial em 3D com câmera orbital, área do paralelogramo e a conta de cada componente |
| `backface` | vista de cima de faces girando, com o ângulo e o dot que decidem se a face é descartada |

Para usar um widget numa nota:
````md
```dataviewjs
dv.view("_widgets/cube", { cull: true, normals: true })
```
````

### Plugins e visual
- **[Dataview](https://github.com/blacksmithgu/obsidian-dataview)**: roda os widgets (`dataviewjs`). Se aparecer só código, ative *Settings → Dataview → Enable JavaScript Queries*.
- **[Latex Suite](https://github.com/artisticat1/obsidian-latex-suite)**: atalhos para escrever LaTeX rápido.
- **Tema [Oat Latte](https://github.com/giselle-tr/Oat-Latte)** + snippet [`vault.css`](notes/.obsidian/snippets/vault.css): fundo bege, blocos de código escuros e largura de leitura de ~800 px.

### Contribuindo com as notas
As regras de escrita estão em [Instruções da Vault](notes/Instru%C3%A7%C3%B5es%20da%20Vault.md): ser objetivo, uma nota por conceito, sempre um exemplo numérico e links entre os conceitos. Achou um erro numa fórmula? Abra uma issue ou um PR.
