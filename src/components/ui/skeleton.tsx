import { CSSProperties } from "react";
import { cn } from "@/src/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export default function Skeleton({ className, style }: SkeletonProps) {
  return <div style={style} className={cn("animate-pulse rounded-lg bg-[#F7F7FB]", className)} />;
}
