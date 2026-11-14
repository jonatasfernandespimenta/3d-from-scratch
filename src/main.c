#include "SDL_events.h"
#include "SDL_keycode.h"
#include "SDL_render.h"
#include "SDL_timer.h"
#include "SDL_video.h"
#include "array.h"
#include "display.h"
#include "mesh.h"
#include "vector.h"
#include <SDL2/SDL.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>

triangle_t *triangles_to_render = NULL;

#define N_POINTS (9 * 9 * 9)
vec3_t cube_points[N_POINTS]; // 9x9x9 cube
vec2_t projected_points[N_POINTS];

float fov_factor = 640;

uint32_t previous_frame_time = 0;

vec3_t camera_position = {0, 0, -5};

bool is_running = false;

void setup(void) {
  color_buffer =
      (uint32_t *)malloc(sizeof(uint32_t) * window_width * window_height);

  color_buffer_texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_ARGB8888,
                                           SDL_TEXTUREACCESS_STREAMING,
                                           window_width, window_height);
  // load_cube_mesh_data();
  load_obj_file_data("./assets/f22.obj");
}

void process_input(void) {
  SDL_Event event;
  while (SDL_PollEvent(&event)) {
    switch (event.type) {

    case SDL_QUIT:
      is_running = false;
      break;

    case SDL_KEYDOWN:
      if (event.key.keysym.sym == SDLK_ESCAPE) {
        is_running = false;
      }
      break;
    }
  }
}

vec2_t project(vec3_t point) {
  vec2_t projected_point = {(fov_factor * point.x) / point.z,
                            (fov_factor * point.y) / point.z};

  return projected_point;
}

void update(void) {
  int time_to_wait = FRAME_TARGET_TIME - (SDL_GetTicks() - previous_frame_time);

  if (time_to_wait > 0 && time_to_wait <= FRAME_TARGET_TIME) {
    SDL_Delay(time_to_wait);
  }

  previous_frame_time = SDL_GetTicks();

  // Initialize the array of triangles to render
  triangles_to_render = NULL;

  mesh.rotation.y += 0.00;
  mesh.rotation.z += 0.00;
  mesh.rotation.x += 0.01;

  int num_faces = array_length(mesh.faces);
  for (int i = 0; i < num_faces; i++) {
    face_t mesh_face = mesh.faces[i];

    vec3_t face_vertices[3];
    face_vertices[0] = mesh.vertices[mesh_face.a - 1];
    face_vertices[1] = mesh.vertices[mesh_face.b - 1];
    face_vertices[2] = mesh.vertices[mesh_face.c - 1];

    triangle_t projected_triangle;

    // loop all 3 vertices of this current face and apply transformations
    for (int j = 0; j < 3; j++) {
      vec3_t transformed_vertex = face_vertices[j];

      transformed_vertex = vec3_rotate_y(transformed_vertex, mesh.rotation.y);
      transformed_vertex = vec3_rotate_x(transformed_vertex, mesh.rotation.x);
      transformed_vertex = vec3_rotate_z(transformed_vertex, mesh.rotation.z);

      // Translate the vertex away from camera_position
      transformed_vertex.z -= camera_position.z;

      vec2_t projected_point = project(transformed_vertex);

      // Scale and translated the projected points to the middle of screen
      projected_point.x += (window_width / 2.0);
      projected_point.y += (window_height / 2.0);

      projected_triangle.points[j] = projected_point;
    }
    // triangles_to_render[i] = projected_triangle;
    array_push(triangles_to_render, projected_triangle);
  }

  /* for (int i = 0; i < N_POINTS; i++) {
    vec3_t point = cube_points[i];

    vec3_t transformed_point = vec3_rotate_y(point, cube_rotation.y);
    transformed_point = vec3_rotate_x(transformed_point, cube_rotation.x);
    transformed_point = vec3_rotate_z(transformed_point, cube_rotation.z);

    transformed_point.z -= camera_position.z;

    vec2_t projected_point = project(transformed_point);

    projected_points[i] = projected_point;
  }*/
}

void render(void) {

  // Loop all projected triangles and render them
  int num_triangles = array_length(triangles_to_render);

  int num_faces = array_length(mesh.faces);
  for (int i = 0; i < num_faces; i++) {
    triangle_t triangle = triangles_to_render[i];

    draw_filled_rect(triangle.points[0].x, triangle.points[0].y, 3, 3,
                     0xFFFFFF00);
    draw_filled_rect(triangle.points[1].x, triangle.points[1].y, 3, 3,
                     0xFFFFFF00);
    draw_filled_rect(triangle.points[2].x, triangle.points[2].y, 3, 3,
                     0xFFFFFF00);

    draw_triangle(triangle.points[0].x, triangle.points[0].y,
                  triangle.points[1].x, triangle.points[1].y,
                  triangle.points[2].x, triangle.points[2].y, 0xFFFFFF00);
  }

  // clear the array of triangles to render every frame loop
  array_free(triangles_to_render);

  render_color_buffer();
  clear_color_buffer(0x00000000);

  SDL_RenderPresent(renderer);
}

void destroy_window(void) {
  SDL_DestroyRenderer(renderer);
  SDL_DestroyWindow(window);
  SDL_Quit();
}

void free_resources(void) {
  free(color_buffer);
  array_free(mesh.faces);
  array_free(mesh.vertices);
}

int main(void) {
  // Create a SDL window
  is_running = initialize_window();

  setup();

  while (is_running) {
    process_input();
    update();
    render();
  }

  destroy_window();
  free_resources();

  return 0;
}
