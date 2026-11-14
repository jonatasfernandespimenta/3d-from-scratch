---
tags: [fundamentos]
---
# Game Loop e FPS

> [!abstract] Resumo
> O programa roda num laço: **input → update → render**, repetido a cada frame.
> Para ter FPS fixo, espera o tempo que sobra do frame: `FRAME_TARGET_TIME = 1000 / FPS` ms.

## Código
```c
#define FPS 30
#define FRAME_TARGET_TIME (1000 / FPS)   // 33 ms

while (is_running) {
  process_input();   // teclado, fechar janela
  update();          // transforma vértices, projeta
  render();          // desenha no color buffer e apresenta
}

// dentro do update():
int time_to_wait = FRAME_TARGET_TIME - (SDL_GetTicks() - previous_frame_time);
if (time_to_wait > 0 && time_to_wait <= FRAME_TARGET_TIME) SDL_Delay(time_to_wait);
previous_frame_time = SDL_GetTicks();
```

## Delta time (próximo passo)
Em vez de `rotation += 0.01` por frame (depende do FPS), usar velocidade × tempo:
```c
float delta_time = (SDL_GetTicks() - previous_frame_time) / 1000.0f; // segundos
mesh.rotation.x += 0.6 * delta_time;   // 0.6 rad por segundo, em qualquer FPS
```

> [!warning] Pegadinhas
> - Sem limitar o FPS, a CPU vai a 100% e a animação fica mais rápida em máquinas rápidas.
> - `SDL_Delay` não é preciso ao milissegundo — por isso delta time é melhor.

## Ver também
- [[Pipeline de Renderização]] · [[Color Buffer]]
