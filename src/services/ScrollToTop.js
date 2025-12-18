import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location  = useLocation();
  const pathname = window.location.pathname

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", 
      });
    }, 1);
  }, [location, pathname]);

  return null;
}
