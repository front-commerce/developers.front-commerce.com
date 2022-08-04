import React from "react";
import { Button } from "react-infima";
import Link from "@docusaurus/Link";
import HubspotForm from "react-hubspot-form";

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

      <div>
        <h2>Subscribe to changelog updates</h2>
        <p>
          Don't miss new features ever again: receive an email in your inbox
          every time we publish an update.
        </p>

        <HubspotForm
          region="eu1"
          portalId="25432745"
          formId="6a265ba7-81db-4b79-a840-fb9ad808432e"
          loading={<div>Loading...</div>}
        />
      </div>
    </div>
  );
}
