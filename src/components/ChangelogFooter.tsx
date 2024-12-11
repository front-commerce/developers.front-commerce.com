import { Button } from "react-infima";
import Link from "@docusaurus/Link";

export interface ChangelogFooterProps {
  children?: React.ReactNode;
}

export default function ChangelogFooter({
  children = null,
}: ChangelogFooterProps) {
  return (
    <div className="max-w-full">
      <div className="text-center py-20 space-y-4">
        <Link
          href="https://www.front-commerce.com/contact/"
          className="intercom-launcher"
        >
          <Button size="large" theme="primary" className="whitespace-normal">
            💌 Ask your questions about Front-Commerce
          </Button>
        </Link>
        {children}
      </div>
    </div>
  );
}
