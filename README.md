# Arkanoid C++ → TypeScript (Cloudflare Workers)

> Proyecto de migración de un juego clásico Arkanoid escrito en C++ con SFML hacia TypeScript, desplegado en **Cloudflare Workers** mediante **Vibe Coding**.

---

## Descripción del proyecto original

Este repositorio contiene la implementación de un juego **Arkanoid** (estilo Breakout) escrito en **C++** utilizando la librería gráfica [SFML](https://www.sfml-dev.org/).

### Características actuales (C++)

- Ventana de juego de 520 × 450 píxeles
- 100 bloques distribuidos en una cuadrícula 10 × 10
- Pelota con movimiento autónomo y rebote en paredes y bloques
- Paleta controlada con las teclas ← → del teclado
- Velocidad de la pelota aleatoria al rebotar contra la paleta
- Assets en PNG/JPG: fondo, pelota, paleta y bloques
- Limitado a 60 FPS via SFML

### Estructura del proyecto

```
arkanoidcpp2ts/
├── main.cpp          # Código fuente C++ (SFML)
├── images/
│   ├── background.jpg
│   ├── ball.png
│   ├── block01.png
│   ├── block02.png
│   ├── block03.png
│   ├── block04.png
│   ├── block05.png
│   └── paddle.png
└── README.md
```

---

## Dependencias (versión C++)

| Dependencia | Versión recomendada |
|-------------|---------------------|
| C++ compiler (g++ / clang++) | C++17 o superior |
| [SFML](https://www.sfml-dev.org/) | 2.5+ |

### Compilar y ejecutar

```bash
# Instalar SFML en macOS (Homebrew)
brew install sfml

# Compilar
g++ main.cpp -o arkanoid -lsfml-graphics -lsfml-window -lsfml-system

# Ejecutar
./arkanoid
```

---

## Hoja de ruta: Migración a TypeScript + Cloudflare Workers

Este proyecto servirá como base para una migración completa usando **Vibe Coding** — un proceso de desarrollo asistido por IA donde el código se genera, refactoriza y valida de forma conversacional con un agente de IA.

### Objetivo

Reimplementar el juego Arkanoid íntegramente en **TypeScript**, eliminando la dependencia de SFML y el entorno de escritorio, para desplegarlo como una aplicación web ejecutándose en **Cloudflare Workers** con renderizado en el cliente mediante la API Canvas de HTML5.

### Plan de migración

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Análisis y documentación del código C++ original | ✅ |
| 2 | Diseño de la arquitectura TypeScript (Worker + cliente) | 🔲 |
| 3 | Migración de la lógica de juego a TypeScript | 🔲 |
| 4 | Implementación del renderizado con Canvas API | 🔲 |
| 5 | Despliegue en Cloudflare Workers con Wrangler | 🔲 |
| 6 | Pruebas y optimización | 🔲 |

### Stack tecnológico objetivo

- **Lenguaje:** TypeScript
- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/)
- **Rendering:** HTML5 Canvas API
- **Deploy:** [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- **Metodología:** Vibe Coding (desarrollo asistido por IA)

---

## Créditos

El código C++ original está basado en el trabajo de:

- [**Kttra/RetroGamesCplus**](https://github.com/Kttra/RetroGamesCplus) — Colección de juegos retro implementados en C++ con SFML.

---

## Licencia

Este proyecto está licenciado bajo los términos de la **GNU General Public License v3.0**.

```
Copyright (C) 2026

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
```

Ver el archivo [LICENSE](LICENSE) para más detalles.
