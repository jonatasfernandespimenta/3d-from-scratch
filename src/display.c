#include "display.h"
#include <stdint.h>

SDL_Window *window = NULL;
SDL_Renderer *renderer = NULL;
SDL_Texture *color_buffer_texture = NULL;

int window_width = 800;
int window_height = 600;

uint32_t *color_buffer = NULL;

void render_color_buffer(void) {
  SDL_UpdateTexture(color_buffer_texture, NULL, color_buffer,
                    (int)(window_width * sizeof(uint32_t)));

  SDL_RenderCopy(renderer, color_buffer_texture, NULL, NULL);
}

void draw_filled_rect(int x, int y, int width, int height, uint32_t color) {
  for (int localX = 0; localX < width; localX++) {
    for (int localY = 0; localY < height; localY++) {
      // color_buffer[(window_width * (localY + y)) + (localX + x)] = color;
      draw_pixel(x + localX, y + localY, color);
    }
  }
}

void draw_pixel(int x, int y, uint32_t color) {
  if (x >= 0 && x < window_width && y >= 0 && y < window_height) {
    color_buffer[(window_width * y) + x] = color;
  }
}

void draw_line(int x0, int y0, int x1, int y1, uint32_t color) {
  int delta_x = x1 - x0;
  int delta_y = y1 - y0;

  int longest_side_length =
      (abs(delta_x) >= abs(delta_y)) ? abs(delta_x) : abs(delta_y);

  float x_inc = (float)delta_x / longest_side_length;
  float y_inc = (float)delta_y / longest_side_length;

  float current_x = x0;
  float current_y = y0;

  for (int i = 0; i <= longest_side_length; i++) {
    draw_pixel(round(current_x), round(current_y), color);

    current_x += x_inc;
    current_y += y_inc;
  }
}

void draw_triangle(int x0, int y0, int x1, int y1, int x2, int y2,
                   uint32_t color) {
  draw_line(x0, y0, x1, y1, color);
  draw_line(x1, y1, x2, y2, color);
  draw_line(x2, y2, x0, y0, color);
}

void clear_color_buffer(uint32_t color) {
  for (int y = 0; y < window_height; y++) {
    for (int x = 0; x < window_width; x++) {
      color_buffer[(window_width * y) + x] = color;
    }
  }
}

bool initialize_window(void) {
  if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
    fprintf(stderr, "Error initializing SDL \n");
    return false;
  }

  SDL_DisplayMode display_mode;
  SDL_GetCurrentDisplayMode(0, &display_mode);

  window_width = display_mode.w;
  window_height = display_mode.h;

  // ponytail: FULLSCREEN_DESKTOP = no video mode switch, so macOS doesn't
  // minimize the window when it loses focus (e.g. terminal keeps focus)
  window = SDL_CreateWindow(NULL, SDL_WINDOWPOS_CENTERED,
                            SDL_WINDOWPOS_CENTERED, window_width, window_height,
                            SDL_WINDOW_FULLSCREEN_DESKTOP);

  if (!window) {
    fprintf(stderr, "Error creating SDL window \n");
    return false;
  }

  renderer = SDL_CreateRenderer(window, -1, 0);

  if (!renderer) {
    fprintf(stderr, "Error creatin STDL Renderer \n");
    return false;
  }

  SDL_RaiseWindow(window);

  return true;
}
