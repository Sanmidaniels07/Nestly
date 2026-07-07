"use client";

interface Props {
  value: "All" | "New" | "Used";
  onChange: (value: "All" | "New" | "Used") => void;
}

const conditions: ("All" | "New" | "Used")[] = ["All", "New", "Used"];

export default function ConditionFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {conditions.map((condition) => {
        const active = value === condition;

        return (
          <button
            key={condition}
            onClick={() => onChange(condition)}
            className={`
              rounded-full px-4 py-2 text-[13px] font-medium transition-colors
              ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                  : "border border-[#ECE9F6] bg-white text-[#475569] hover:border-violet-200"
              }
            `}
          >
            {condition}
          </button>
        );
      })}
    </div>
  );
}