interface UserAvatarProps {
  name?: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  name,
  size = 44,
  className = "",
}: UserAvatarProps) {
  const initial = name?.trim()?.charAt(0).toUpperCase() || "?";

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 font-semibold text-white ${className}`}
    >
      {initial}
    </div>
  );
}
