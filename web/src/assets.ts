// ============================================================
// assets.ts — Async image loader (replaces SFML Texture::loadFromFile)
// ============================================================

export interface GameAssets {
  background: HTMLImageElement;
  ball: HTMLImageElement;
  paddle: HTMLImageElement;
  /** block sprites indexed 0-4 (block01.png … block05.png) */
  blocks: HTMLImageElement[];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/** Load all game assets and return them as a typed bundle. */
export async function loadAssets(): Promise<GameAssets> {
  const [background, ball, paddle, b1, b2, b3, b4, b5] = await Promise.all([
    loadImage('/images/background.jpg'),
    loadImage('/images/ball.png'),
    loadImage('/images/paddle.png'),
    loadImage('/images/block01.png'),
    loadImage('/images/block02.png'),
    loadImage('/images/block03.png'),
    loadImage('/images/block04.png'),
    loadImage('/images/block05.png'),
  ]);

  return {
    background,
    ball,
    paddle,
    blocks: [b1, b2, b3, b4, b5],
  };
}
