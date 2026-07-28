interface UserAvatarProps {
  name?: string;
  src?: string | null;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  name,
  src,
  size = 44,
  className = "",
}: UserAvatarProps) {
  const initial = name?.trim()?.charAt(0).toUpperCase() || "?";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "User avatar"}
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 font-semibold text-white ${className}`}
    >
      {initial}
    </div>
  );
}
