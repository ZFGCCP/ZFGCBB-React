export interface GameState {
  playerPosition: number;
  alienDirection: number;
  score: number;
  gameOver: boolean;
  keysPressed: Set<string>;
}

export interface GameObject {
  x: number;
  y: number;
  isAlive?: boolean;
}
