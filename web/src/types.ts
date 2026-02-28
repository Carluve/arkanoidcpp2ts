// ============================================================
// types.ts — Shared interfaces and enums for the Arkanoid game
// ============================================================

/** Axis-aligned bounding box used for collision detection */
export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Simple 2-D vector */
export interface Vec2 {
  x: number;
  y: number;
}

/** All possible top-level game states */
export type GamePhase = 'title' | 'playing' | 'gameover' | 'won';

/** Immutable game configuration (mirrors the C++ constants) */
export interface GameConfig {
  /** Canvas logical width in pixels (matches the original 520 px) */
  readonly canvasWidth: number;
  /** Canvas logical height in pixels (matches the original 450 px) */
  readonly canvasHeight: number;
  /** Target frames per second (matches SFML setFramerateLimit(60)) */
  readonly targetFps: number;
  /** Number of block columns */
  readonly blockCols: number;
  /** Number of block rows */
  readonly blockRows: number;
  /** Horizontal spacing between block origins */
  readonly blockSpacingX: number;
  /** Vertical spacing between block origins */
  readonly blockSpacingY: number;
  /** Block visual width (drawn slightly smaller than spacing) */
  readonly blockWidth: number;
  /** Block visual height */
  readonly blockHeight: number;
  /** Starting ball horizontal speed (px/frame at 60 fps) */
  readonly ballSpeedX: number;
  /** Starting ball vertical speed (px/frame at 60 fps) */
  readonly ballSpeedY: number;
  /** Ball sprite size */
  readonly ballSize: number;
  /** Paddle movement speed (px/frame at 60 fps) */
  readonly paddleSpeed: number;
}

export const CONFIG: GameConfig = {
  canvasWidth: 520,
  canvasHeight: 450,
  targetFps: 60,

  blockCols: 10,
  blockRows: 10,
  // C++ uses block[n].setPosition(i*43, j*20), i/j start at 1
  blockSpacingX: 43,
  blockSpacingY: 20,
  blockWidth: 40,
  blockHeight: 16,

  // C++ initialises: float dx=6, dy=5
  ballSpeedX: 6,
  ballSpeedY: 5,
  // The sprite is 12×12 in the original AABB checks
  ballSize: 12,

  // C++ moves paddle by 6 px per frame
  paddleSpeed: 6,
};
