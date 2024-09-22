import { useEffect } from "react";

const useDisableCopyPaste = () => {
  useEffect(() => {
    // Disable text selection
    const disableSelect = (e: Event) => e.preventDefault();
    document.addEventListener("selectstart", disableSelect);

    // Disable right-click
    const disableRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    // Disable keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v")) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", disableKeyboardShortcuts);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("selectstart", disableSelect);
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableKeyboardShortcuts);
    };
  }, []);
};

export default useDisableCopyPaste;
