// The "Nestly" wordmark that sits beside the ring mark: the title serif,
// upright and semi-bold with tight spacing, so it reads as a logo rather
// than a heading. One component, so it looks the same everywhere.

interface Props {
  // Tailwind text size, e.g. "text-[22px]".
  size?: string;
  // Colour class - defaults to the page's ink colour.
  color?: string;
  className?: string;
  as?: "span" | "p" | "div";
}

export default function NestlyWordmark({ size = "text-[22px]", color = "text-ink", className = "", as: Tag = "span" }: Props) {
  return (
    <Tag className={`font-[family-name:var(--font-fraunces)] font-semibold leading-none tracking-[-0.02em] ${size} ${color} ${className}`}>
      Nestly
    </Tag>
  );
}
