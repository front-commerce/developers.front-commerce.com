import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { ArrowRight, Book, Code, Github, Zap } from "lucide-react";
import { Button } from "react-infima";
import { ImageSlider } from "../components/Homepage/ImageSlider";

import ReactLogo from "@site/static/img/react-logo.svg";
import GraphQLLogo from "@site/static/img/graphql-logo.svg";
import ProductionReadyLogo from "@site/static/img/production-ready-logo.svg";

const config = {
  companies: [
    { alt: "AIMS Interactive", src: "/img/logos/aims.png" },
    { alt: "Antadis", src: "/img/logos/antadis.png" },
    { alt: "Clever Age", src: "/img/logos/cleverage.png" },
    { alt: "Diglin", src: "/img/logos/diglin.png" },
    { alt: "Emakina", src: "/img/logos/emakina.png" },
    { alt: "Occitech", src: "/img/logos/occitech.png" },
    { alt: "PH2M", src: "/img/logos/ph2m.png" },
    { alt: "Smile", src: "/img/logos/smile.png" },
    { alt: "WEBQAM", src: "/img/logos/webqam.png" },
    { alt: "Zento", src: "/img/logos/zento.png" },
    { alt: "TBD Group", src: "/img/logos/tbd.svg" },
    { alt: "Placeholder", src: "/img/logos/placeholder.svg" },
  ],
  features: [
    {
      title: "A React Application",
      Svg: ReactLogo,
      description: (
        <>
          You want to provide your users a better shopping experience. We give
          you the means to do so by setting up for you a base theme using modern
          technologies (React, Apollo, Webpack, Storybook, etc.). You can then
          extend this theme to adapt it to your most specific needs.
        </>
      ),
    },
    {
      title: "A GraphQL Server",
      Svg: GraphQLLogo,
      description: (
        <>
          Leverage GraphQL to expose your data easily, no matter the source
          (CMS, eCommerce Platform, PIM, ERP, ...) We provide you the code to
          launch a performant Node.js server that will expose your GraphQL
          schema. You will use it to extend and build a fast and modern website
          no matter your backend
        </>
      ),
    },
    {
      title: "It is production ready!",
      Svg: ProductionReadyLogo,
      description: (
        <>
          Started in 2015, Front-Commerce is already powering shops in
          production. We provide all the tools needed for maintaining a deployed
          website: an extensive logging system (client / server errors), error
          boundaries, maintenance mode, SEO, internationalization, security,
          caching and invalidation, payments, image processing, etc.
        </>
      ),
    },
  ],
  links: (version: string = "3.x") => ({
    gettingStarted: `/docs/${version}/welcome`,
    concepts: `/docs/${version}/category/concepts`,
    guides:
      version === "3.x"
        ? `/docs/${version}/category/guides`
        : `/docs/${version}/category/advanced`,

    github: `https://github.com/front-commerce/developers.front-commerce.com`,
    liveDemo: "https://www.front-commerce.com/headless-frontend-demo/",
  }),
};

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  const links = config.links(siteConfig.customFields.LAST_VERSION as string);

  return (
    <Layout
      title={`✨ Front-Commerce · A blazing fast & ready to use Headless PWA Frontend solution`}
      description={siteConfig.tagline}
    >
      <main className="bg-background-main text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
            A blazing fast & ready to use{" "}
            <span className="relative whitespace-nowrap text-primary">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-primary-50/60"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">Headless PWA Frontend</span>
            </span>{" "}
            solution
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 dark:text-slate-300">
            Keeping. Change. Simple.
          </p>
          <div className="mt-10 flex justify-center gap-x-6 group">
            <Link to={links.gettingStarted}>
              <Button
                theme="primary"
                className="py-2 sm:py-4 flex items-center justify-center"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="bg-gray-100 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-12 text-center">
              Trusted by these companies
            </h2>
            <ImageSlider images={config.companies} />
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What is Front-Commerce?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <Code className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">
                A React Application
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We provide you the means to create a better shopping experience
                using modern technologies (React, Apollo, Webpack, Storybook,
                etc.).
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <Zap className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">A GraphQL Server</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Leverage GraphQL to expose your data easily, no matter the
                source (CMS, eCommerce Platform, PIM, ERP...).
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <Book className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">
                It is production ready!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Front-Commerce is already powering shops in production. We
                provide all the tools needed for maintaining a deployed website.
              </p>
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="bg-gray-100 dark:bg-gray-900 lg:px-20 relative">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-gray-100 dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-2">
              <svg
                className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-100 transform translate-x-1/2 dark:text-gray-900"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
                    <span className="inline">Technologies that will </span>
                    <span className="text-primary inline">
                      benefit your users
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Our goal is not to provide tools for the sake of tooling.
                    However we strongly believe that a good set of tools will
                    make your life easier and will enable you to do what is best
                    for your users. <br />
                    <br />
                    Because each brand communicates differently with its
                    customers, our goal is to let you adapt quickly and
                    efficiently, by avoiding technical considerations that will
                    slow you down. We stay up to date and you stay in touch with
                    your users.
                  </p>
                  <div className="mt-5 flex flex-col space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row sm:mt-8 sm:justify-center lg:justify-start">
                    <Link
                      to={links.gettingStarted}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        size="normal"
                        theme="primary"
                        block
                        className="md:py-4"
                      >
                        Getting Started
                      </Button>
                    </Link>
                    <Link href={links.liveDemo} className="w-full sm:w-auto">
                      <Button
                        size="large"
                        theme="primary"
                        outline
                        block
                        className="md:py-4 hover:no-underline"
                      >
                        Live demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="-mb-2 lg:mb-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
              alt=""
            />
          </div>
        </section>

        {/* Documentation Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Explore Our Documentation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              to={links.gettingStarted}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn how to set up and run your first Front-Commerce project.
              </p>
            </Link>
            <Link
              to={links.concepts}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4">Core Concepts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Understand the key concepts behind Front-Commerce's
                architecture.
              </p>
            </Link>
            <Link
              to={links.guides}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4">Guides</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Detailed documentation of Front-Commerce's API and components
                usages.
              </p>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl mb-8">
              Join the Front-Commerce community and build blazing fast
              e-commerce experiences.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to={links.gettingStarted}>
                <Button
                  theme="secondary"
                  className="py-2 sm:py-4 flex items-center"
                >
                  Get Started
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to={links.github}>
                <Button
                  theme="primary"
                  className="py-2 sm:py-4 flex items-center"
                  size="large"
                >
                  <Github className="mr-2" />
                  Star on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
