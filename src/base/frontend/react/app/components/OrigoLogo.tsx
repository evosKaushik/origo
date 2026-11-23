type OrigoLogoProps = {
  className?: string;
};

export default function OrigoLogo({ className = "" }: OrigoLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 110"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Origo"
    >
      <text
        x="0"
        y="85"
        fill="white"
        fontSize="96"
        fontWeight="600"
        letterSpacing="3"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        ORIGO
      </text>

      <path
        d="M171 49 L193 85 L178 85 Z"
        fill="#781BFF"
      />
    </svg>
  );
}
