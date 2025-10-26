"use client"

interface DecorativeCircleProps {
  size?: "sm" | "md" | "lg";
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  color?: "primary" | "accent" | "secondary";
  opacity?: number;
}

export default function DecorativeCircle({
  size = "md",
  position,
  color = "primary",
  opacity = 0.1,
}: DecorativeCircleProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const positionClasses = {
    "top-left": "-top-16 -left-16",
    "top-right": "-top-16 -right-16",
    "bottom-left": "-bottom-16 -left-16",
    "bottom-right": "-bottom-16 -right-16",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  const colorClasses = {
    primary: "bg-primary",
    accent: "bg-accent-foreground",
    secondary: "bg-secondary-foreground",
  };

  return (
    <div
      className={`absolute ${sizeClasses[size]} ${positionClasses[position]} ${colorClasses[color]} rounded-full blur-3xl pointer-events-none`}
      style={{ opacity }}
    />
  );
}
