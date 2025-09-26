type Props = {
  initials?: string;           // Texto al centro (por defecto "LR")
  outerColor?: string;         // color arco externo
  innerColor?: string;         // color arco interno
  size?: number;               // tamaño en px
};

export default function LogoSpinner({
  initials = "LR",
  outerColor = "#1F2544",      // azul oscuro parecido al de tu ejemplo
  innerColor = "#2563EB",      // azul vivo (Tailwind blue-600)
  size = 120,
}: Props) {
  const strokeW = 10;

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <style>{`
        @keyframes spin360 { to { transform: rotate(360deg); } }
        @keyframes spin360rev { to { transform: rotate(-360deg); } }
        .arc {
          transform-origin: 50% 50%;
          animation: spin360 1.4s linear infinite;
        }
        .arc2 {
          transform-origin: 50% 50%;
          animation: spin360rev 2s linear infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        role="img"
        aria-label="Logo animado"
      >
        {/* Arco externo */}
        <circle
          className="arc"
          cx="50" cy="50" r="32"
          fill="none"
          stroke={outerColor}
          strokeWidth={strokeW}
          strokeLinecap="round"
          /* Dash para que sea arco (no círculo completo) */
          strokeDasharray="140 120"
        />
        {/* Arco interno */}
        <circle
          className="arc2"
          cx="50" cy="50" r="22"
          fill="none"
          stroke={innerColor}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray="100 80"
        />
        {/* Iniciales */}
        <text
          x="50" y="54"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#0F172A"   /* casi negro azulado para buen contraste */
          style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }}
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
