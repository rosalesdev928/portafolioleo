import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 450);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return <div className="preloader" aria-hidden="true"><span>LR</span></div>;
}