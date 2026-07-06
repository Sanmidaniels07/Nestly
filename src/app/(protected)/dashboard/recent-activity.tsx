"use client";

const activities = [
  {
    type: "like",
    content: "Sarah liked your post about community building",
    time: "2h ago",
    icon: "❤️",
  },
  {
    type: "comment",
    content: "Marcus commented on your photo",
    time: "5h ago",
    icon: "💬",
  },
  {
    type: "join",
    content: "You joined the 'Product Designers' tribe",
    time: "Yesterday",
    icon: "🌱",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>

      <div className="space-y-6">
        {activities.map((activity, i) => (
          <div key={i} className="flex gap-4">
            <div className="text-2xl mt-0.5">{activity.icon}</div>
            <div className="flex-1">
              <p className="text-gray-700 leading-snug">{activity.content}</p>
              <p className="text-xs text-gray-500 mt-1.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}