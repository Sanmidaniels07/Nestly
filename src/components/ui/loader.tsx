export default function Spinner({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`spinner-rotate ${className}`}
      role="status"
      aria-label="Loading"
    >
      <defs>
        <linearGradient id="spinner-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="url(#spinner-gradient)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="2.4 3.6"
      />
    </svg>
  );
}