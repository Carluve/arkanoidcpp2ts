// ============================================================
// main.ts — Entry point
// Bootstraps asset loading and kicks off the Game engine.
// Replaces the C++ main() / srand(time(0)) / RenderWindow setup.
// ============================================================

import { loadAssets } from './assets.ts';
import { Game } from './game.ts';
import { InputManager } from './input.ts';

async function bootstrap(): Promise<void> {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
  if (!canvas) throw new Error('#gameCanvas not found in DOM');

  // Load all sprites before starting (mirrors t1.loadFromFile(...) calls)
  const assets = await loadAssets();

  const input = new InputManager();
  const game = new Game(canvas, assets, input);
  game.start();
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start Arkanoid:', err);
});
