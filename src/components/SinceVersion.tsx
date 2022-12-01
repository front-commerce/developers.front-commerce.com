import React from "react";

interface SinceVersionProps {
  tag: string;
}

export default function SinceVersion(props: SinceVersionProps) {
  return (
    <p>
      <span className="inline-flex items-center rounded-full bg-pink-100 dark:bg-pink-800/50 px-3 py-2 text-xs font-medium text-pink-800 dark:text-pink-200">
        Since version {props.tag}
      </span>
    </p>
  );
}
