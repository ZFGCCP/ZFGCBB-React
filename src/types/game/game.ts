export interface Dimensions {
  width: number;
  height: number;
}

export interface GameEngineState {
  isRunning: boolean;
  isPaused: boolean;
  width: number;
  height: number;
  gameStarted?: boolean;
  gameOver?: boolean;
}

export interface SpaceGameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isAlive: boolean;
  type: "alien" | "bullet" | "player";
  color: string;
}

export type AnimationCallback = (deltaTime: number, timestamp: number) => void;

export interface DebugData {
  fps: number;
  entities: number;
  gameState: "initializing" | "running" | "paused" | "stopped" | "game over";
  memoryUsage: number;
  timeRunning: number;
  updateLag: number;
  vsyncFps: number;
  [key: string]: number | string | boolean;
}

export interface SpaceGameState extends GameEngineState {
  playerPosition: number;
  playerWidth: number;
  alienDirection: number;
  alienStepTime: number; // Time between alien steps
  alienLastStep: number; // Last time aliens moved
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  keysPressed: Set<string>;
  shouldDropAliens: boolean;
}

export interface SpaceGameEntities {
  objects: Map<string, SpaceGameObject>;
}
