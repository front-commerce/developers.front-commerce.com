import Link from "@docusaurus/Link";

export default function ContactLink({
  children = "contact us" as React.ReactNode,
}) {
  return (
    <span className="intercom-launcher">
      <Link href="mailto:support@front-commerce.com">{children}</Link>
    </span>
  );
}
