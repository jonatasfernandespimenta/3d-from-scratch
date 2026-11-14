# ponytail: explicit native (arm64) SDL2; old Intel one in /usr/local shadows it on PATH
SDL2_CONFIG = /opt/homebrew/bin/sdl2-config
CFLAGS = -arch arm64 -Wall -std=c99 $(shell $(SDL2_CONFIG) --cflags)
LDLIBS = -arch arm64 -lm $(shell $(SDL2_CONFIG) --libs)
OBJS = $(patsubst %.c,%.o,$(wildcard src/*.c))

# ponytail: incremental build, only changed .c files recompile
build: renderer

renderer: $(OBJS)
	$(CC) $(OBJS) $(LDLIBS) -o renderer

src/%.o: src/%.c src/*.h
	$(CC) $(CFLAGS) -c $< -o $@

run: build
	./renderer

clean:
	rm -f renderer src/*.o
