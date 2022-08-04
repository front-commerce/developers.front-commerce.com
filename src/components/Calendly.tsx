import React from "react";
import Link from "@docusaurus/Link";
import { Button } from "react-infima";

interface CalendlyProps {
  href?: string;
  children?: React.ReactNode;
}

export default function Calendly({
  href = "https://calendly.com/josquin-front-commerce/30min",
  children = (
    <>
      Schedule a 30min meeting in Josquin's agenda <br />{" "}
      <i>coffee is on us ☕</i>
    </>
  ),
}: CalendlyProps) {
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
