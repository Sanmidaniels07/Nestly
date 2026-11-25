import { brandCss, isBrandHex } from "@/src/lib/brand-color";

interface Props {
  // The store's brand colour ("#rrggbb"); none = Nestly's colours.
  color?: string | null;
  children: React.ReactNode;
}

// Everything inside uses the seller's brand colour in place of Nestly violet,
// shaded so text and buttons stay readable in light and dark mode (see
// lib/brand-color). `display: contents` keeps it out of the layout.
export default function BrandScope({ color, children }: Props) {
  if (!isBrandHex(color)) return <>{children}</>;
  const id = color.slice(1).toLowerCase();
  return (
    <div data-brand={id} className="contents">
      {/* Only ever a validated hex goes in here. */}
      <style href={`brand-${id}`} precedence="default">
        {brandCss(color)}
      </style>
      {children}
    </div>
  );
}
