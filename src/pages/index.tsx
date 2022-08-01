import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/Homepage/Features";
import AngledImageRight from "@site/src/components/Homepage/TechnologiesBanner";
import HeaderImage from "@site/static/img/logo-full-alt-white.svg";
import { Button } from "react-infima";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={
        "hero hero--primary py-[2rem] text-center relative overflow-hidden sm:py-[8rem] text-white"
      }
    >
      <div className="container">
        <HeaderImage aria-label="Front-Commerce" fontSize={400} height={200} />
        <p className="hero__subtitle max-w-lg mx-auto">{siteConfig.tagline}</p>
        <div className="flex align-center justify-center">
          <Link to="/docs/welcome">
            <Button size="large" theme="secondary" className="py-4">
              Get Started &nbsp;&nbsp;→
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`✨ Front-Commerce · Craft delightful e-commerce experiences using modern web technologies`}
      description={siteConfig.tagline}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <AngledImageRight />
        {/* TODO - add other sections */}
      </main>
    </Layout>
  );
}
