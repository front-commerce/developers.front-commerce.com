import type { Props } from "@theme/DocSidebarItem/Category";
import Category from "@theme-original/DocSidebarItem/Category";

export default function CategoryWrapper(props: Props) {
  if (!props.item.className?.includes("new")) {
    return <Category {...props} />;
  }

  const label = `${props.item.label} 🆕`;

  return (
    <Category
      {...props}
      item={{
        ...props.item,
        label,
      }}
    />
  );
}
