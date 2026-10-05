import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    if (!("IntersectionObserver" in window)) { setEntered(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect(); }
    }, { threshold: 0.08 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return { ref, entered };
}
