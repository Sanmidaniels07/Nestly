"use client";

interface Props {
  value: "All" | "NEW" | "USED";
  onChange: (value: "All" | "NEW" | "USED") => void;
}

const conditions: { label: string; value: "All" | "NEW" | "USED" }[] = [
  { label: "All", value: "All" },
  { label: "New", value: "NEW" },
  { label: "Used", value: "USED" },
];

export default function ConditionFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {conditions.map((condition) => {
        const active = value === condition.value;

        return (
          <button
            key={condition.value}
            onClick={() => onChange(condition.value)}
            className={`
              rounded-full px-4 py-2 text-[13px] font-medium transition-colors
              ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                  : "border border-[#ECE9F6] bg-white text-[#475569] hover:border-violet-200"
              }
            `}
          >
            {condition.label}
          </button>
        );
      })}
    </div>
  );
}
