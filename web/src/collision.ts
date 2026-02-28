// ============================================================
// collision.ts — AABB intersection helpers
// Mirrors the C++ FloatRect::intersects() behaviour.
// ============================================================

import type { AABB } from './types.ts';

/**
 * Returns true if two AABBs overlap.
 * Equivalent to SFML's FloatRect::intersects().
 */
export function aabbIntersects(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
