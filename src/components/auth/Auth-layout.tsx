interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-[var(--background)]
      px-5
      "
    >
      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-8
        shadow-lg
        "
      >
        <h1
          className="
          mb-2
          text-3xl
          font-bold
          text-[var(--foreground)]
          "
        >
          {title}
        </h1>

        <p
          className="
          mb-8
          text-sm
          text-[var(--muted)]
          "
        >
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
}