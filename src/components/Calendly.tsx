import React from "react";
import Link from "@docusaurus/Link";
import { Button } from "react-infima";

interface CalendlyProps {
  href?: string;
  children?: React.ReactNode;
  variant?: "button" | "link";
}

const DEFAULT_LINK =
  "https://get.front-commerce.com/book-a-free-consultation-demo-with-front-commerce-ceo-laurent";

export default function Calendly({
  href = DEFAULT_LINK,
  children = <>Schedule a meeting</>,
  variant = "button",
}: CalendlyProps) {
  if (variant !== "button") {
    return <Link href={href}>{children}</Link>;
  }

  return (
    <div className="text-center">
      <Link href={href}>
        <Button theme="primary" className="max-w-full whitespace-normal py-4">
          {children}
        </Button>
      </Link>
    </div>
  );
}
