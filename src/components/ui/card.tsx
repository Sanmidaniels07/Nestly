import { cn } from "@/src/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        `
        rounded-[28px]
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-6
        shadow-sm
        `,
        className
      )}
    >
      {children}
    </div>
  );
}