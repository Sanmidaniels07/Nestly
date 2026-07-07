"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const distances = ["Any", "2 km", "5 km", "10 km", "20 km", "50 km"];

export default function DistanceFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {distances.map((distance) => {
        const active = value === distance;

        return (
          <button
            key={distance}
            onClick={() => onChange(distance)}
            className={`
              rounded-full px-4 py-2 text-[13px] font-medium transition-colors
              ${active ? "bg-violet-600 text-white" : "border border-[#ECE9F6] text-[#475569] hover:border-violet-200"}
            `}
          >
            {distance}
          </button>
        );
      })}
    </div>
  );
}