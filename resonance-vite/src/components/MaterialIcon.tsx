interface MaterialIconProps {
  name: string;
  filled?: boolean;
  size?: number;
  weight?: number;
  className?: string;
}

export function MaterialIcon({
  name,
  filled = false,
  size = 20,
  weight = 450,
  className = '',
}: MaterialIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-rounded select-none ${className}`}
      style={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
