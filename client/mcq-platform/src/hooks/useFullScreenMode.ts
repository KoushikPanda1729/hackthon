import { useEffect } from "react";

const useFullScreenMode = () => {
  const enterFullScreen = () => {
    const elem = document.documentElement; // Get the whole document

    if (elem.requestFullscreen) {
      elem.requestFullscreen(); // Standard fullscreen API
    }
  };

  const detectFullScreenExit = () => {
    if (!document.fullscreenElement) {
      alert("You have exited full-screen mode. Please return to full-screen.");
      enterFullScreen(); // Prompt user to re-enter full screen
    }
  };

  useEffect(() => {
    // Enter full-screen when the component mounts
    enterFullScreen();

    // Detect if the user exits full-screen mode
    document.addEventListener("fullscreenchange", detectFullScreenExit);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("fullscreenchange", detectFullScreenExit);
    };
  }, []);
};

export default useFullScreenMode;
