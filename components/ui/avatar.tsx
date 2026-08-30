"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  url?: string;
  rounded?: "full" | "sm" | "md" | "lg" | "xl" | "none";
  size?: number;
}

function getDeterministicColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 75%, 45%)`;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, username, url, rounded = "full", size = 40, style, ...props },
    ref,
  ) => {
    const roundedClass = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    }[rounded];

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center shrink-0 overflow-hidden font-semibold text-white",
          roundedClass,
          className,
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: !url
            ? getDeterministicColor(username ? username : "user")
            : undefined,
          ...style,
        }}
        {...props}
      >
        {url ? (
          <Image
            src={url}
            alt={username}
            fill
            className="object-cover"
            sizes={`${size}px`}
          />
        ) : (
          <span style={{ fontSize: size * 0.4 }}>
            {username ? username.charAt(0).toUpperCase() : "?"}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
