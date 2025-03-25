import React from "react";

interface TitleScreenProps {
  onStartGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  return (
    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-90">
      <div className="text-center">
        <h1 className="display-2 text-white mb-4">Space Invaders</h1>
        <div className="mb-5">asdf</div>
        <div className="mb-4">
          <div className="text-white mb-2 d-none d-md-block">
            Use ← → arrows to move
          </div>
          <div className="text-white mb-2 d-none d-md-block">
            Press SPACE to shoot
          </div>
          <div className="text-white mb-2 d-md-none">
            Touch left/right sides to move
          </div>
          <div className="text-white mb-2 d-md-none">Touch center to shoot</div>
        </div>
        <button
          onClick={onStartGame}
          className="btn btn-success btn-lg px-5 py-3"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
