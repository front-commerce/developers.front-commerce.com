import React, { Fragment } from "react";
import Link from "@docusaurus/Link";

interface BackportListProps {
  currentVersion: string;
  previousVersions: string[];
}

const releaseUrl = (version: string) => {
  return `https://gitlab.com/front-commerce/front-commerce/-/releases/${version}`;
};

const stripPatchVersion = (version: string) => {
  return version.split(".").slice(0, -1).join(".");
};

export default function BackportList(props: BackportListProps) {
  return (
    <p>
      Fixes from the{" "}
      <Link href={releaseUrl(props.currentVersion)}>
        <code>{stripPatchVersion(props.currentVersion)}</code>
      </Link>{" "}
      version have also been backported into previous minor versions. The
      following patch versions were released:{" "}
      {props.previousVersions.map((version, index) => {
        const isLast = index === props.previousVersions.length - 1;
        const link = (
          <Link href={releaseUrl(version)}>
            <code>{version}</code>
          </Link>
        );

        if (isLast) {
          return <Fragment key={version}>and {link}</Fragment>;
        }

        return <Fragment key={version}>{link}, </Fragment>;
      })}
      .
    </p>
  );
}
