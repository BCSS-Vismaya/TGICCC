import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the window top
    window.scrollTo(0, 0);

    // Scroll the main content scrollable container top if it exists
    const pageContent = document.querySelector(".page-content");
    if (pageContent) {
      pageContent.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
