import React from "react";
import clsx from "clsx";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "A React Application",
    Svg: require("@site/static/img/react-logo.svg").default,
    description: (
      <>
        You want to provide your users a better shopping experience. We give you
        the means to do so by setting up for you a base theme using modern
        technologies (React, Apollo, Webpack, Storybook, etc.). You can then
        extend this theme to adapt it to your most specific needs.
      </>
    ),
  },
  {
    title: "A GraphQL Server",
    Svg: require("@site/static/img/graphql-logo.svg").default,
    description: (
      <>
        Leverage GraphQL to expose your data easily, no matter the source (CMS,
        eCommerce Platform, PIM, ERP, ...) We provide you the code to launch a
        performant Node.js server that will expose your GraphQL schema. You will
        use it to extend and build a fast and modern website no matter your
        backend
      </>
    ),
  },
  {
    title: "It is production ready!",
    Svg: require("@site/static/img/production-ready-logo.svg").default,
    description: (
      <>
        Started in 2015, Front-Commerce is already powering shops in production.
        We provide all the tools needed for maintaining a deployed website: an
        extensive logging system (client / server errors), error boundaries,
        maintenance mode, SEO, internationalization, security, caching and
        invalidation, payments, image processing, etc.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center py-4">
        <Svg className="w-20 h-20" role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p className="text-justify">{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className="flex items-center py-[4rem] w-full">
      <div className="container text-center">
        <h2 className="text-primary pb-[2rem]">What is Front-Commerce?</h2>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
