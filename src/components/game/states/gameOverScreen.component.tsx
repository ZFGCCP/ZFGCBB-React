import React from "react";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onRestart,
}) => {
  return (
    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h2 className="display-5 text-white mb-3">Game Over!</h2>
        <p className="text-white fs-3 mb-4">Final Score: {score}</p>
        <button
          onClick={onRestart}
          className="btn btn-success btn-lg px-4 py-2"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
