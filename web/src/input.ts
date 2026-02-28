// ============================================================
// input.ts — Keyboard and touch/mouse input handler
// Replaces SFML Keyboard::isKeyPressed() with DOM event listeners
// ============================================================

export class InputManager {
  private readonly keys: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      // Prevent arrow keys from scrolling the page
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
  }

  /** Returns true while the key with the given KeyboardEvent.code is held */
  isPressed(code: string): boolean {
    return this.keys.has(code);
  }

  /** Flush a single-frame key press (useful for start/pause) */
  consume(code: string): boolean {
    if (this.keys.has(code)) {
      this.keys.delete(code);
      return true;
    }
    return false;
  }
}
