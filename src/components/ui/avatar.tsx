interface AvatarProps {
  image?: string;
  name: string;
}

export default function Avatar({
  image,
  name,
}: AvatarProps) {
  return (
    <div
      className="
      flex
      h-12
      w-12
      items-center
      justify-center
      overflow-hidden
      rounded-full
      bg-slate-200
      "
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}