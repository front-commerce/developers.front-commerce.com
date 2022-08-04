import React from "react";
import Link from "@docusaurus/Link";
import { Button } from "react-infima";

const AngledImageRight = () => {
  return (
    <section className="relative bg-white dark:bg-darkGray overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-darkGray sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-2">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2 dark:text-darkGray"
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
                <span className="text-primary inline">benefit your users</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Our goal is not to provide tools for the sake of tooling.
                However we strongly believe that a good set of tools will make
                your life easier and will enable you to do what is best for your
                users. <br />
                <br />
                Because each brand communicates differently with its customers,
                our goal is to let you adapt quickly and efficiently, by
                avoiding technical considerations that will slow you down. We
                stay up to date and you stay in touch with your users.
              </p>
              <div className="mt-5 flex flex-col space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row sm:mt-8 sm:justify-center lg:justify-start">
                <Link to="/docs/welcome" className="w-full sm:w-auto">
                  <Button
                    size="large"
                    theme="primary"
                    block
                    className="md:py-4"
                  >
                    Getting Started
                  </Button>
                </Link>
                <Link
                  href="https://www.front-commerce.com/headless-frontend-demo/"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="large"
                    theme="primary"
                    outline
                    block
                    className="md:py-4"
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
  );
};

export default AngledImageRight;
