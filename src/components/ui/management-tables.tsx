"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  minWidth?: number;
}

export default function ManagementTable({ children, minWidth = 1100 }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth }}>
          {children}
        </table>
      </div>
    </section>
  );
}