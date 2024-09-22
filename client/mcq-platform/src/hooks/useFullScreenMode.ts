import { useEffect } from "react";

const useFullScreenMode = () => {
  const enterFullScreen = () => {
    const elem = document.documentElement; // Get the whole document

    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Failed to enable full-screen mode:", err.message);
      });
    }
  };

  const detectFullScreenExit = () => {
    if (!document.fullscreenElement) {
      alert("You have exited full-screen mode. Please return to full-screen.");
      enterFullScreen(); // Prompt user to re-enter full-screen mode
    }
  };

  useEffect(() => {
    // Add fullscreenchange event listener
    document.addEventListener("fullscreenchange", detectFullScreenExit);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("fullscreenchange", detectFullScreenExit);
    };
  }, []);

  return { enterFullScreen };
};

export default useFullScreenMode;
