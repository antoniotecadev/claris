import { useState } from "react";
import { normalizeMediaUrl } from "@/lib/media-url";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  name: string;
  url?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-11 h-11 text-[13px]",
  lg: "w-12 h-12 text-[13px]",
  xl: "w-14 h-14 text-base",
};

export function Avatar({ name, url, size = "md", className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const dim = sizeClasses[size];
  const avatarUrl = normalizeMediaUrl(url);

  if (avatarUrl && !failed) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setFailed(true)}
        className={`${dim} rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }

  return (
    <img
      src="/avatar-placeholder.svg"
      alt={name}
      className={`${dim} rounded-full object-cover ring-2 ring-white ${className}`}
    />
  );
}
