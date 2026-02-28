// ============================================================
// paddle.ts — Paddle entity
// C++ original: sPaddle.setPosition(300,440); move(±6,0)
// Paddle sprite is ~104��14 px in the original assets.
// We query the actual image dimensions at runtime.
// ============================================================

import { CONFIG } from './types.ts';

export class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(imgWidth: number, imgHeight: number) {
    this.width = imgWidth;
    this.height = imgHeight;
    // C++ initial position: sPaddle.setPosition(300, 440)
    this.x = 300;
    this.y = 440;
  }

  moveLeft(dt: number): void {
    this.x -= CONFIG.paddleSpeed * dt;
    if (this.x < 0) this.x = 0;
  }

  moveRight(dt: number): void {
    this.x += CONFIG.paddleSpeed * dt;
    const maxX = CONFIG.canvasWidth - this.width;
    if (this.x > maxX) this.x = maxX;
  }

  /** AABB of the paddle (used in FloatRect intersection check) */
  get bounds(): { x: number; y: number; width: number; height: number } {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  reset(): void {
    this.x = 300;
    this.y = 440;
  }
}
