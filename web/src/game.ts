// ============================================================
// game.ts — Main game engine
// Implements the requestAnimationFrame loop with delta-time
// normalisation so physics run at the same speed regardless of
// the monitor's refresh rate.
//
// C++ reference mapping:
//   app.setFramerateLimit(60)  →  deltaTime normalised to 1/60 s
//   while (app.isOpen())       →  requestAnimationFrame
//   app.clear / draw / display →  ctx.clearRect / draw calls
// ============================================================

import type { GamePhase } from './types.ts';
import { CONFIG } from './types.ts';
import type { GameAssets } from './assets.ts';
import { Ball } from './ball.ts';
import { Paddle } from './paddle.ts';
import type { BrickData } from './brick.ts';
import { createBricks } from './brick.ts';
import { aabbIntersects } from './collision.ts';
import { InputManager } from './input.ts';

/** One "frame" duration at the target FPS in milliseconds */
const FRAME_MS = 1000 / CONFIG.targetFps;

export class Game {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly assets: GameAssets;
  private readonly input: InputManager;

  private phase: GamePhase = 'title';
  private rafId: number = 0;
  private lastTimestamp: number = 0;

  private ball: Ball;
  private paddle: Paddle;
  private bricks: BrickData[];

  private score: number = 0;
  private lives: number = 3;

  constructor(
    canvas: HTMLCanvasElement,
    assets: GameAssets,
    input: InputManager,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context from canvas');

    this.canvas = canvas;
    this.ctx = ctx;
    this.assets = assets;
    this.input = input;

    // Set logical canvas size to match the original C++ window
    this.canvas.width = CONFIG.canvasWidth;
    this.canvas.height = CONFIG.canvasHeight;
    this.fitCanvas();
    window.addEventListener('resize', () => this.fitCanvas());

    // Space / tap to start
    this.canvas.addEventListener('click', () => this.handleStart());
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') this.handleStart();
    });

    // Initialise entities
    this.ball = new Ball();
    this.paddle = new Paddle(
      this.assets.paddle.naturalWidth,
      this.assets.paddle.naturalHeight,
    );
    this.bricks = createBricks();
  }

  // ----------------------------------------------------------
  // Public API
  // ----------------------------------------------------------

  start(): void {
    this.lastTimestamp = performance.now();
    this.rafId = requestAnimationFrame((ts) => this.loop(ts));
  }

  stop(): void {
    cancelAnimationFrame(this.rafId);
  }

  // ----------------------------------------------------------
  // Private — lifecycle
  // ----------------------------------------------------------

  private handleStart(): void {
    if (this.phase === 'title' || this.phase === 'gameover' || this.phase === 'won') {
      this.resetGame();
      this.phase = 'playing';
      const overlay = document.getElementById('overlay');
      if (overlay) overlay.classList.add('hidden');
    }
  }

  private resetGame(): void {
    this.score = 0;
    this.lives = 3;
    this.ball.reset();
    this.paddle.reset();
    this.bricks = createBricks();
  }

  private endGame(won: boolean): void {
    this.phase = won ? 'won' : 'gameover';
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      const h1 = overlay.querySelector('h1');
      const p = overlay.querySelector('p');
      if (h1) h1.textContent = won ? 'YOU WIN!' : 'GAME OVER';
      if (p) p.textContent = `Score: ${this.score} — Press SPACE or tap to retry`;
    }
  }

  // ----------------------------------------------------------
  // Private — canvas sizing (preserve aspect ratio)
  // ----------------------------------------------------------

  private fitCanvas(): void {
    const ratio = CONFIG.canvasWidth / CONFIG.canvasHeight;
    const windowRatio = window.innerWidth / window.innerHeight;
    let w: number, h: number;

    if (windowRatio > ratio) {
      // Window is wider than game → constrain by height
      h = window.innerHeight;
      w = h * ratio;
    } else {
      w = window.innerWidth;
      h = w / ratio;
    }

    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
  }

  // ----------------------------------------------------------
  // Private — main loop
  // ----------------------------------------------------------

  /**
   * requestAnimationFrame callback.
   * Accumulates elapsed real time and steps the simulation in
   * fixed FRAME_MS increments so physics are decoupled from FPS.
   */
  private loop(timestamp: number): void {
    const elapsed = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // dt: normalised time step (1.0 == one 60 fps frame)
    const dt = elapsed / FRAME_MS;

    if (this.phase === 'playing') {
      this.update(dt);
    }

    this.render();

    this.rafId = requestAnimationFrame((ts) => this.loop(ts));
  }

  // ----------------------------------------------------------
  // Private — update (physics + input, mirrors the C++ loop body)
  // ----------------------------------------------------------

  private update(dt: number): void {
    // ---- Paddle input ----
    // C++: if (Keyboard::isKeyPressed(Keyboard::Right)) sPaddle.move(6,0);
    if (this.input.isPressed('ArrowRight')) this.paddle.moveRight(dt);
    if (this.input.isPressed('ArrowLeft'))  this.paddle.moveLeft(dt);

    // ---- Ball X axis + block collision ----
    // C++ checks x collision BEFORE moving y (split-axis AABB)
    this.ball.moveX(dt);
    for (const brick of this.bricks) {
      if (!brick.alive) continue;
      const blockAABB = {
        x: brick.x,
        y: brick.y,
        width: CONFIG.blockWidth,
        height: CONFIG.blockHeight,
      };
      if (aabbIntersects(this.ball.blockHitbox, blockAABB)) {
        brick.alive = false;
        this.ball.dx = -this.ball.dx;
        this.score += 10;
      }
    }

    // ---- Ball Y axis + block collision ----
    this.ball.moveY(dt);
    for (const brick of this.bricks) {
      if (!brick.alive) continue;
      const blockAABB = {
        x: brick.x,
        y: brick.y,
        width: CONFIG.blockWidth,
        height: CONFIG.blockHeight,
      };
      if (aabbIntersects(this.ball.blockHitbox, blockAABB)) {
        brick.alive = false;
        this.ball.dy = -this.ball.dy;
        this.score += 10;
      }
    }

    // ---- Wall bounces ----
    this.ball.bounceWalls();

    // ---- Paddle collision ----
    // C++: if (FloatRect(x,y,12,12).intersects(sPaddle.getGlobalBounds())) dy=-(rand()%5+2);
    if (aabbIntersects(this.ball.paddleHitbox, this.paddle.bounds)) {
      this.ball.bounceOffPaddle();
      // Prevent the ball from sticking inside the paddle
      this.ball.y = this.paddle.y - this.ball.size;
    }

    // ---- Ball out of bounds (lost life) ----
    if (this.ball.isOutOfBounds()) {
      this.lives--;
      if (this.lives <= 0) {
        this.endGame(false);
      } else {
        this.ball.reset();
        this.paddle.reset();
      }
    }

    // ---- Win condition (all bricks cleared) ----
    if (this.bricks.every((b) => !b.alive)) {
      this.endGame(true);
    }
  }

  // ----------------------------------------------------------
  // Private — render (mirrors C++ app.clear / draw / display)
  // ----------------------------------------------------------

  private render(): void {
    const { ctx, canvas, assets } = this;

    // app.clear() + sBackground draw
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);

    if (this.phase === 'playing' || this.phase === 'gameover' || this.phase === 'won') {
      // Draw bricks
      for (const brick of this.bricks) {
        if (!brick.alive) continue;
        ctx.drawImage(
          assets.blocks[brick.textureIndex],
          brick.x,
          brick.y,
          CONFIG.blockWidth,
          CONFIG.blockHeight,
        );
      }

      // Draw paddle — sBall.setPosition(x,y)
      ctx.drawImage(
        assets.paddle,
        this.paddle.x,
        this.paddle.y,
        this.paddle.width,
        this.paddle.height,
      );

      // Draw ball
      ctx.drawImage(
        assets.ball,
        this.ball.x,
        this.ball.y,
        this.ball.size,
        this.ball.size,
      );

      // HUD: score + lives
      this.renderHud();
    }
  }

  private renderHud(): void {
    const { ctx } = this;
    ctx.save();
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText(`Score: ${this.score}`, 8, 14);
    ctx.fillText(`Lives: ${this.lives}`, CONFIG.canvasWidth - 70, 14);
    ctx.restore();
  }
}
