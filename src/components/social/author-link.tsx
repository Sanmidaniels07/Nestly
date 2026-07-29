"use client";

import Link from "next/link";
import UserAvatar from "@/src/components/ui/user-avatar";

export interface AuthorLike {
  id: string;
  name: string;
  username?: string | null;
  avatar?: string | null;
}

interface AvatarProps {
  author?: AuthorLike | null;
  size?: number;
  className?: string;
}

export function AuthorAvatarLink({ author, size = 44, className = "" }: AvatarProps) {
  if (!author) return <UserAvatar size={size} className={className} />;

  return (
    <Link href={`/users/${author.username ?? author.id}`} className={`shrink-0 ${className}`}>
      <UserAvatar name={author.name} src={author.avatar} size={size} />
    </Link>
  );
}

interface NameProps {
  author?: AuthorLike | null;
  className?: string;
}

export function AuthorNameLink({ author, className = "" }: NameProps) {
  if (!author) return <span className={className}>Unknown user</span>;

  return (
    <Link
      href={`/users/${author.username ?? author.id}`}
      className={`transition-colors hover:text-violet-600 ${className}`}
    >
      {author.name}
    </Link>
  );
}
