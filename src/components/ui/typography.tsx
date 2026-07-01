import { cn } from "@/src/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Heading({
  children,
  className,
}: Props) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function Text({
  children,
  className,
}: Props) {
  return (
    <p
      className={cn(
        "text-sm text-[var(--muted)]",
        className
      )}
    >
      {children}
    </p>
  );
}