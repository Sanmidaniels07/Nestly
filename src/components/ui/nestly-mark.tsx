export default function NestlyMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nestly-mark-gradient" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* Outer twig ring */}
      <circle
        cx="20" cy="20" r="16"
        stroke="url(#nestly-mark-gradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="9 5.5"
        opacity="0.35"
      />
      {/* Middle twig ring */}
      <circle
        cx="20" cy="20" r="12"
        stroke="url(#nestly-mark-gradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="7 4.5"
        strokeDashoffset="4"
        opacity="0.65"
      />
      {/* Inner twig ring */}
      <circle
        cx="20" cy="20" r="8"
        stroke="url(#nestly-mark-gradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="5.5 3.5"
        strokeDashoffset="2.5"
      />
      {/* The egg, held at the center */}
      <circle cx="20" cy="20" r="3.2" fill="url(#nestly-mark-gradient)" />
    </svg>
  );
}