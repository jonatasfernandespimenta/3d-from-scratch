# _widgets

Cada `.js` aqui é um widget interativo. Para usar numa nota:

````
```dataviewjs
dv.view("_widgets/cube")
```
````

Alguns aceitam opções: `dv.view("_widgets/line", { algo: "dda" })`.

Todos começam com o mesmo bloco de helpers (copiado de propósito: `dv.view` não tem `import`).
