// ============================================================
// brick.ts — Brick entity
// C++ original: block[n].setPosition(i*43, j*20)  i,j ∈ [1..10]
// "Destroyed" bricks were moved off-screen: setPosition(-100, 0)
// Here we use an explicit `alive` flag instead.
// ============================================================

import { CONFIG } from './types.ts';

export interface BrickData {
  x: number;
  y: number;
  alive: boolean;
  /** Index into GameAssets.blocks (0–4) for texture variety */
  textureIndex: number;
}

/** Build the initial 10×10 grid of bricks, matching C++ layout. */
export function createBricks(): BrickData[] {
  const bricks: BrickData[] = [];
  for (let i = 1; i <= CONFIG.blockCols; i++) {
    for (let j = 1; j <= CONFIG.blockRows; j++) {
      bricks.push({
        x: i * CONFIG.blockSpacingX,
        y: j * CONFIG.blockSpacingY,
        alive: true,
        // Vary textures by row (j mod 5) to add visual interest
        textureIndex: (j - 1) % 5,
      });
    }
  }
  return bricks;
}
