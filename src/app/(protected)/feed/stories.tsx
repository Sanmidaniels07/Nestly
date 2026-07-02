"use client";

const stories = [
  "Daniel",
  "Sarah",
  "Michael",
  "Grace",
  "John",
  "Peace",
];

export default function Stories() {
  return (
    <div
      className="
      flex
      gap-5
      overflow-x-auto
      pb-2
    "
    >
      {stories.map((name) => (
        <div
          key={name}
          className="
          flex
          flex-col
          items-center
          gap-2
          shrink-0
        "
        >
          <div
            className="
            h-16
            w-16
            rounded-full
            bg-gradient-to-br
            from-violet-500
            to-indigo-500
            p-[3px]
          "
          >
            <div
              className="
              h-full
              w-full
              rounded-full
              bg-white
            "
            />
          </div>

          <p
            className="
            text-xs
            font-medium
          "
          >
            {name}
          </p>
        </div>
      ))}
    </div>
  );
}