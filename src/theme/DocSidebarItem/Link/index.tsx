import type { Props } from "@theme/DocSidebarItem/Link";
import Link from "@theme-original/DocSidebarItem/Link";

export default function LinkWrapper(props: Props) {
  if (!props.item?.className?.includes("new")) {
    return <Link {...props} />;
  }

  const label = `${props.item.label} 🆕`;

  return (
    <Link
      {...props}
      item={{
        ...props.item,
        label,
      }}
    />
  );
}
