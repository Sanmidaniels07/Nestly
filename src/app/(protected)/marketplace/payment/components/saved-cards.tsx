"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { savedCards } from "@/src/mocks/payment";
import SavedCardItem from "./saved-card";

export default function SavedCards() {
  const [selected, setSelected] = useState(
    savedCards.find((c) => c.default)?.id ?? savedCards[0]?.id ?? ""
  );

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
            Saved cards
          </h2>
          <p className="text-[13px] text-[#64748B]">Pay faster using an existing card.</p>
        </div>

        <button className="flex shrink-0 items-center gap-1.5 rounded-xl border border-violet-200 px-3.5 py-2 text-[13px] font-medium text-violet-700 transition-colors hover:bg-violet-50">
          <Plus size={15} />
          Add card
        </button>
      </div>

      {savedCards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E2E0EE] py-8 text-center">
          <p className="text-[13.5px] text-[#94A3B8]">No saved cards yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {savedCards.map((card) => (
            <SavedCardItem
              key={card.id}
              card={card}
              selected={selected === card.id}
              onSelect={() => setSelected(card.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}