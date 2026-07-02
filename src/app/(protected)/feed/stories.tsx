"use client";

const stories = ["Daniel", "Sarah", "Michael", "Grace", "John", "Peace"];

export default function Stories() {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {stories.map((name, index) => (
        <div key={name} className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 p-1">
              <div className="h-full w-full rounded-full bg-white p-1">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-violet-400 to-purple-400" />
              </div>
            </div>
            {index === 0 && (
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 ring-2 ring-white" />
            )}
          </div>
          <p className="text-sm font-medium text-gray-700">{name}</p>
        </div>
      ))}
    </div>
  );
}