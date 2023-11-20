import React, { Fragment } from "react";
import Link from "@docusaurus/Link";

interface BackportListProps {
  currentVersion: string | string[];
  previousVersions: string[];
}

const releaseUrl = (version: string) => {
  return `https://gitlab.blackswift.cloud/front-commerce/front-commerce/-/releases/${version}`;
};

const stripPatchVersion = (version: string) => {
  return version.split(".").slice(0, -1).join(".");
};

const VersionLink = (props: { version: string }) => {
  return (
    <Link href={releaseUrl(props.version)}>
      <code>{stripPatchVersion(props.version)}</code>
    </Link>
  );
};

const VersionsLinks = (props: { versions: string[] }) => {
  return (
    <Fragment>
      {props.versions.map((version, index) => {
        const link = <VersionLink version={version} />;

        if (index === 0) {
          return <Fragment key={version}>{link}</Fragment>;
        } else if (index === props.versions.length - 1) {
          return <Fragment key={version}> and {link}</Fragment>;
        }
        return <Fragment key={version}>, {link}</Fragment>;
      })}
    </Fragment>
  );
};

export default function BackportList(props: BackportListProps) {
  const currentVersion = Array.isArray(props.currentVersion) ? (
    <VersionsLinks versions={props.currentVersion} />
  ) : (
    <VersionLink version={props.currentVersion} />
  );

  return (
    <p>
      Fixes from {currentVersion} have also been backported into previous minor
      versions. The following patch versions were released:{" "}
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
