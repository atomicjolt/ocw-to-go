import React from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [pathname] = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
