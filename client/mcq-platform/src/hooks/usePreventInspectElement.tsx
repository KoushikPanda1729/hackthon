import { useEffect } from "react";

const usePreventInspectElement = () => {
  useEffect(() => {
    // Prevent F12 (open DevTools) and Ctrl+Shift+I (Inspect Element)
    const preventInspect = (e: KeyboardEvent) => {
      if (
        e.key === "F12" || // F12 for DevTools
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl+Shift+I for Inspect
        (e.ctrlKey && e.shiftKey && e.key === "J") || // Ctrl+Shift+J for Console
        (e.ctrlKey && e.key === "U") // Ctrl+U for viewing page source
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", preventInspect);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", preventInspect);
    };
  }, []);
};

export default usePreventInspectElement;
