import type { SpaceGameState, SpaceGameEntities } from "@/types/game/game";
import { useState, useCallback } from "react";
import { Game } from "../game.component";
import { GameBoard } from "../states/gameBoard.component";
import { GameOverScreen } from "../states/gameOverScreen.component";
import { TitleScreen } from "../states/titleScreen.component";

const MIN_GAME_WIDTH = 320;
const MIN_GAME_HEIGHT = 480;

const initialGameState: SpaceGameState = {
  isRunning: false,
  isPaused: false,
  width: MIN_GAME_WIDTH,
  height: MIN_GAME_HEIGHT,
  playerPosition: MIN_GAME_WIDTH / 2,
  playerWidth: 0,
  alienDirection: 1,
  alienStepTime: 0,
  alienLastStep: 0,
  score: 0,
  gameOver: false,
  gameStarted: false,
  keysPressed: new Set(),
  shouldDropAliens: false,
};

export const SpaceInvadersGame: React.FC = () => {
  const [score, setScore] = useState(0);

  const handleScoreUpdate = useCallback(() => {
    setScore((prev) => prev + 100);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
  }, []);

  return (
    <Game<SpaceGameState, SpaceGameEntities>
      initialState={{
        ...initialGameState,
        alienDirection: 1,
        alienStepTime: 750,
        alienLastStep: 0,
      }}
      minDimensions={{ width: MIN_GAME_WIDTH, height: MIN_GAME_HEIGHT }}
      maxDimensions={{ width: 1200, height: 900 }}
      aspectRatio={4 / 3}
      renderTitle={({ onStartGame }) => (
        <TitleScreen onStartGame={onStartGame} />
      )}
      renderGameOver={({ onRestart }) => (
        <GameOverScreen
          score={score}
          onRestart={() => {
            handleRestart();
            onRestart();
          }}
        />
      )}
      renderGame={({
        gameState,
        debugData,
        dimensions,
        dimensionsRef,
        gameStateRef,
        entitiesRef,
        updateGameState,
        onGameTick,
      }) => (
        <GameBoard
          gameState={gameState}
          debugData={debugData}
          dimensions={dimensions}
          dimensionsRef={dimensionsRef}
          gameStateRef={gameStateRef}
          entitiesRef={entitiesRef}
          updateGameState={updateGameState}
          onScoreUpdate={handleScoreUpdate}
          onGameTick={onGameTick}
          score={score}
        />
      )}
    />
  );
};
