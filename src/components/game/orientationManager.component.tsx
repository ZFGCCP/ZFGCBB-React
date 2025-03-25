import React, { useEffect, useState } from "react";

interface OrientationManagerProps {
  children: React.ReactNode;
}

export const OrientationManager: React.FC<OrientationManagerProps> = ({
  children,
}) => {
  const [isCorrectOrientation, setIsCorrectOrientation] = useState(true);

  useEffect(() => {
    const checkOrientation = () => {
      setIsCorrectOrientation(true);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isCorrectOrientation) {
    return (
      <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
        <div className="text-center text-white">
          <h2 className="h3 mb-3">Please Rotate Your Device</h2>
          <p className="mb-0">
            For the best gaming experience, please rotate your device.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
