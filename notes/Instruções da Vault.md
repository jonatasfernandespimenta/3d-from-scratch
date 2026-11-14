---
tags: [meta]
---
# Instruções da Vault

> [!abstract] Propósito
> Vault de **consulta rápida** do que aprendi construindo um renderer 3D do zero (C + SDL, projeto em `../src`).
> Abrir uma nota = relembrar o assunto em **< 2 minutos**.

## Regras de escrita
1. **Objetivo.** Frase curta, sem enrolação. Se cabe numa fórmula, é uma fórmula.
2. **Uma nota = um conceito.** Nome da nota = nome do conceito (`Produto Vetorial (Cross)`).
3. **Sempre a mesma estrutura** (use o template `Conceito`, `Cmd+P → Templates: Insert`):
   - `> [!abstract] Resumo` — 1 a 3 linhas. A essência.
   - **Fórmula** — em LaTeX.
   - **Código** — em C, no estilo do projeto (`vec3_t`, `draw_pixel`…).
   - **Widget** — se existir um em `_widgets/`.
   - `> [!warning] Pegadinhas` — erros que eu já cometi ou vou cometer.
   - **Ver também** — links `[[ ]]`.
4. **Linkar sempre.** Mencionou outro conceito → `[[link]]`. É isso que faz o grafo funcionar.
5. **Exemplo numérico** sempre que possível (ex: `(3,4) → 5`). Número concreto fixa melhor que teoria.
6. **Nada de copiar livro.** Escrever com as minhas palavras.
7. **Fluxos e diagramas → Mermaid** (` ```mermaid `), nativo no Obsidian. ASCII só para grades/esboços pequenos.
8. Nota nova sem lugar definido → `00 Inbox/`. Depois mover para a pasta certa.

## Pastas
| Pasta | Conteúdo |
|---|---|
| `00 Inbox` | rascunhos, coisas a organizar |
| `01 Fundamentos` | pixels, color buffer, loop, trigonometria, pipeline |
| `02 Vetores` | vetores, magnitude, dot, cross |
| `03 Transformações` | translação, escala, rotação, matrizes |
| `04 Projeção` | 3D → 2D |
| `05 Rasterização` | retas, DDA, Bresenham, triângulos |
| `06 Malhas e Visibilidade` | mesh, OBJ, backface culling |
| `_widgets` | widgets interativos (JS) |
| `_templates` | templates de nota |

## Sintaxe útil
- Fórmula inline: `$x' = \frac{f x}{z}$` → $x' = \frac{f x}{z}$
- Bloco: `$$ ... $$`. **Latex Suite**: digite `mk` → `$ $`, `dm` → `$$ $$`, `/` vira fração, `x2` vira `x^2`.
- Callouts: `> [!abstract]`, `> [!tip]`, `> [!warning]`, `> [!example]`, `> [!question]` (dúvida em aberto).
- Widget:
  ````
  ```dataviewjs
  dv.view("_widgets/cube")
  ```
  ````
  Widgets disponíveis: `pixels`, `line` (`{algo:"dda"}`), `triangle`, `sine`, `slope`, `vectors` (`{mode:"magnitude"|"dot"}`), `cube` (`{cull:true, normals:true}`), `projection`, `cross`, `backface` (`{mode:"cube"}`).

## Plugins instalados
- **Dataview** — roda os widgets (`dataviewjs`). Se aparecer só código: *Settings → Dataview → Enable JavaScript Queries*.
- **Latex Suite** — atalhos para digitar LaTeX rápido. LaTeX em si já é nativo do Obsidian.
