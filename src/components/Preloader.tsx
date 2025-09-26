// Preloader.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  done?: boolean;
  minDuration?: number;
  color?: string;
  size?: number;
  text?: string; // ⬅️ texto central
};

export default function Preloader({
  done = false,
  minDuration = 3000,
  color = "#22c55e", // verde
  size = 100,
  text = "LR",       // ⬅️ tus iniciales
}: Props) {
  const [mountedAt] = useState(() => Date.now());
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHide(true), minDuration);
    return () => clearTimeout(t);
  }, [minDuration]);

  useEffect(() => {
    if (done) {
      const elapsed = Date.now() - mountedAt;
      const left = Math.max(0, minDuration - elapsed);
      const t = setTimeout(() => setHide(true), left);
      return () => clearTimeout(t);
    }
  }, [done, minDuration, mountedAt]);

  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: hide ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff", // fondo blanco
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Texto en el centro */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
            fontSize: size * 0.28,
            color: color,
          }}
        >
          {text}
        </div>

        {/* círculo girando */}
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 2 }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25} // muestra un arco
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}

