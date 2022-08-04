import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import PrimaryFeatures from "@site/src/components/Homepage/PrimaryFeatures";
import AngledImageRight from "@site/src/components/Homepage/TechnologiesBanner";
import Layout from "@theme/Layout";
import React from "react";
import Hero from "../components/Homepage/Hero";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`✨ Front-Commerce · Craft delightful e-commerce experiences using modern web technologies`}
      description={siteConfig.tagline}
    >
      <Hero />
      <main>
        <PrimaryFeatures />
        <AngledImageRight />
      </main>
    </Layout>
  );
}
