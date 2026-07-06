"use client";

const marketplacePicks = [
  {
    title: "Wireless Earbuds",
    price: "$89",
    image: "🎧",
  },
  {
    title: "Minimal Desk Lamp",
    price: "$45",
    image: "💡",
  },
];

export default function MarketplacePicks() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Marketplace Picks</h3>
        <span className="text-violet-600 text-sm font-medium cursor-pointer hover:underline">Browse all →</span>
      </div>

      <div className="space-y-6">
        {marketplacePicks.map((item, i) => (
          <div key={i} className="flex gap-4 items-center group cursor-pointer">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl transition-transform group-hover:scale-110">
              {item.image}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-violet-600 font-semibold">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}