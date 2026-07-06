"use client";

const suggestedUsers = [
  { name: "Sarah Chen", handle: "@sarahchen", avatar: "https://i.pravatar.cc/128?u=sarah", mutual: "12 mutual friends" },
  { name: "Marcus Okoro", handle: "@marcuso", avatar: "https://i.pravatar.cc/128?u=marcus", mutual: "8 mutual friends" },
  { name: "Aisha Patel", handle: "@aishap", avatar: "https://i.pravatar.cc/128?u=aisha", mutual: "Designers community" },
];

export default function SuggestedUsers() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-6">Suggested for you</h3>

      <div className="space-y-6">
        {suggestedUsers.map((user, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover" alt={user.name} />
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.handle}</p>
              </div>
            </div>

            <button className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors px-5 py-2 rounded-full border border-violet-200 hover:border-violet-300">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}