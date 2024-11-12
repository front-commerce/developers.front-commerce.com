interface SinceVersionProps {
  tag: string;
  platform?: string;
  inline?: boolean;
}

export default function SinceVersion(props: SinceVersionProps) {
  const content = (
    <span className="inline-flex items-center rounded-full bg-pink-100 dark:bg-pink-800/50 px-3 py-2 text-xs font-medium text-pink-800 dark:text-pink-200">
      Since version {props.tag}
      {props.platform ? ` on ${props.platform}` : ""}
    </span>
  );

  if (props.inline) {
    // we double span it to avoid the height adapting to the parent
    return <span>{content}</span>;
  }

  return <p>{content}</p>;
}
