# Arkanoid C++ → TypeScript (Cloudflare Pages)

> Migración completa de un juego clásico Arkanoid escrito en C++ con SFML hacia TypeScript + HTML5 Canvas, desplegado en **Cloudflare Pages** mediante **Vibe Coding**.

![Arkanoid desplegado en Cloudflare Pages](prompt/05-arkanoid-cloudflare-deploy.png)

**Jugar ahora:** [cbcb0820.arkanoid-5s6.pages.dev](https://cbcb0820.arkanoid-5s6.pages.dev)

---

## Descripción

Este repositorio contiene dos versiones del juego **Arkanoid** (estilo Breakout):

1. **Versión original en C++** — Usa la librería gráfica [SFML](https://www.sfml-dev.org/) para renderizado de escritorio.
2. **Versión web en TypeScript** — Usa HTML5 Canvas, Vite y se despliega en Cloudflare Pages.

La migración fue realizada en una sola sesión de **Vibe Coding** usando [OpenCode](https://opencode.ai) + Claude Opus vía Cloudflare AI Gateway.

---

## Estructura del proyecto

```
arkanoidcpp2ts/
├── main.cpp              # Código fuente C++ original (SFML)
├── images/               # Assets originales del juego
│   ├── background.jpg
│   ├── ball.png
│   ├── block01.png … block05.png
��   └── paddle.png
├── prompt/               # Prompt de migración y capturas del proceso
│   ├��─ prompt-migracion.md
│   └── *.png
├── web/                  # Proyecto TypeScript (Vite)
│   ├── src/
│   │   ├── main.ts       # Bootstrap (equivale a main() en C++)
│   │   ├── game.ts       # Game loop, update, render, HUD
│   │   ├── ball.ts       # Entidad Ball (posición, velocidad, hitboxes)
│   │   ├── paddle.ts     # Entidad Paddle (movimiento, bounds)
│   │   ├── brick.ts      # Grid de bloques 10×10
│   │   ├── collision.ts  # AABB intersection (FloatRect::intersects)
│   │   ├── input.ts      # InputManager (reemplaza SFML Keyboard)
│   │   ├── assets.ts     # Carga async de imágenes (reemplaza SFML Texture)
│   │   └── types.ts      # Interfaces, CONFIG, GamePhase
│   ├── public/images/    # Assets copiados para el build web
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json     # TypeScript strict: true
│   └── wrangler.toml     # Configuración Cloudflare Pages
├── LICENSE
└── README.md
```

---

## Características del juego

- Ventana de juego de 520 x 450 px (responsiva, preserva aspect ratio)
- 100 bloques distribuidos en una cuadricula 10 x 10 con 5 texturas de colores
- Pelota con movimiento y rebote en paredes y bloques (split-axis AABB)
- Paleta controlada con las teclas izquierda/derecha del teclado
- Velocidad de la pelota aleatoria al rebotar contra la paleta
- HUD con puntuacion y vidas
- Pantallas de titulo, Game Over y victoria
- Delta-time normalizado: la fisica corre igual a cualquier refresh rate

---

## Mapeo C++ → TypeScript

| Concepto C++ (SFML) | Equivalente TypeScript (Web) |
|---|---|
| `RenderWindow` + `setFramerateLimit(60)` | `<canvas>` + `requestAnimationFrame` + delta-time |
| `while (app.isOpen())` | `Game.loop()` con rAF recursivo |
| `Texture::loadFromFile()` | `loadAssets()` — `Promise<HTMLImageElement>` |
| `Sprite` + `setPosition` / `draw` | `ctx.drawImage()` en Canvas 2D |
| `FloatRect::intersects()` | `aabbIntersects()` — AABB pura |
| `Keyboard::isKeyPressed()` | `InputManager` con `Set<string>` via `keydown`/`keyup` |
| `srand(time(0))` + `rand()%5+2` | `Math.random()` + `Math.floor()` |
| `Sprite block[1000]` | `BrickData[]` con flag `alive` |

---

## Ejecucion local

### Version C++ (original)

```bash
# Instalar SFML en macOS (Homebrew)
brew install sfml

# Compilar
g++ main.cpp -o arkanoid -lsfml-graphics -lsfml-window -lsfml-system

# Ejecutar
./arkanoid
```

### Version TypeScript (web)

```bash
cd web
npm install
npm run dev        # Servidor local Vite → http://localhost:5173
npm run build      # Build de produccion → web/dist/
```

---

## Despliegue en Cloudflare Pages

### Opcion 1: Wrangler CLI

```bash
cd web
npm run deploy     # build + wrangler pages deploy
```

### Opcion 2: Git integration (CI/CD)

1. Conectar el repositorio en **Cloudflare Dashboard → Pages → Connect to Git**
2. **Build command:** `cd web && npm install && npm run build`
3. **Build output directory:** `web/dist`

---

## Proceso de migracion (Vibe Coding)

La migracion fue ejecutada de forma autonoma por un agente de IA en una sola sesion. El prompt completo y las capturas del proceso estan documentados en [`prompt/prompt-migracion.md`](prompt/prompt-migracion.md).

| Fase | Descripcion | Estado |
|------|-------------|--------|
| 1 | Analisis y documentacion del codigo C++ original | Completado |
| 2 | Scaffold del proyecto Vite + TypeScript | Completado |
| 3 | Migracion de la logica de juego a TypeScript | Completado |
| 4 | Implementacion del renderizado con Canvas API | Completado |
| 5 | Despliegue en Cloudflare Pages con Wrangler | Completado |

### Stack tecnologico

- **Lenguaje:** TypeScript (strict mode)
- **Build:** [Vite](https://vite.dev/)
- **Rendering:** HTML5 Canvas 2D API
- **Deploy:** [Cloudflare Pages](https://pages.cloudflare.com/) + [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- **Metodologia:** Vibe Coding con [OpenCode](https://opencode.ai) + Claude Opus via Cloudflare AI Gateway

---

## Creditos

El codigo C++ original esta basado en el trabajo de:

- [**Kttra/RetroGamesCplus**](https://github.com/Kttra/RetroGamesCplus) — Coleccion de juegos retro implementados en C++ con SFML.

---

## Licencia

Este proyecto esta licenciado bajo los terminos de la **GNU General Public License v3.0**.

Ver el archivo [LICENSE](LICENSE) para mas detalles.
