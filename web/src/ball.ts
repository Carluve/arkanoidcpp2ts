// ============================================================
// ball.ts — Ball entity
// C++ original: float x=300, y=300; float dx=6, dy=5;
// The sprite AABB used in collision was FloatRect(x+3,y+3,6,6)
// and FloatRect(x,y,12,12) for the paddle.
// We keep the same coordinate semantics: (x,y) is the top-left
// of the 12×12 sprite.
// ============================================================

import type { AABB } from './types.ts';
import { CONFIG } from './types.ts';

export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;

  /** Sprite display size (12 px, matches original) */
  readonly size: number = CONFIG.ballSize;

  constructor(x: number = 300, y: number = 300) {
    this.x = x;
    this.y = y;
    this.dx = CONFIG.ballSpeedX;
    this.dy = CONFIG.ballSpeedY;
  }

  /**
   * Move ball by dx on the X axis (first half of C++ loop).
   * dt is a normalised time step: 1.0 == one frame at 60 fps.
   */
  moveX(dt: number): void {
    this.x += this.dx * dt;
  }

  /**
   * Move ball by dy on the Y axis (second half of C++ loop).
   */
  moveY(dt: number): void {
    this.y += this.dy * dt;
  }

  /**
   * Wall bounce — mirrors the C++ boundary checks.
   * Original: if (x<0 || x>520) dx=-dx;  if (y<0 || y>450) dy=-dy;
   */
  bounceWalls(): void {
    if (this.x < 0 || this.x + this.size > CONFIG.canvasWidth) {
      this.dx = -this.dx;
      // Clamp so the ball never escapes
      if (this.x < 0) this.x = 0;
      if (this.x + this.size > CONFIG.canvasWidth) {
        this.x = CONFIG.canvasWidth - this.size;
      }
    }
    if (this.y < 0) {
      this.dy = -this.dy;
      this.y = 0;
    }
  }

  /** Returns true when the ball has fallen below the bottom edge */
  isOutOfBounds(): boolean {
    return this.y > CONFIG.canvasHeight;
  }

  /**
   * Returns the tight collision box used against blocks.
   * Original: FloatRect(x+3, y+3, 6, 6)
   */
  get blockHitbox(): AABB {
    return { x: this.x + 3, y: this.y + 3, width: 6, height: 6 };
  }

  /**
   * Returns the collision box used against the paddle.
   * Original: FloatRect(x, y, 12, 12)
   */
  get paddleHitbox(): AABB {
    return { x: this.x, y: this.y, width: this.size, height: this.size };
  }

  /** Randomise dy on paddle hit — mirrors: dy = -(rand()%5+2) */
  bounceOffPaddle(): void {
    this.dy = -(Math.floor(Math.random() * 5) + 2);
  }

  reset(x: number = 300, y: number = 300): void {
    this.x = x;
    this.y = y;
    this.dx = CONFIG.ballSpeedX;
    this.dy = CONFIG.ballSpeedY;
  }
}
