import React from "react";
import Translate, { translate } from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  BookmarkSquareIcon,
  BookOpenIcon,
  RssIcon,
  Bars4Icon,
} from "@heroicons/react/24/outline";
import Link from "@docusaurus/Link";

const PopularPages = () => {
  const links = [
    {
      title: "Documentation",
      description: "Learn how to integrate our tools with your app",
      icon: BookOpenIcon,
      href: "/docs/welcome",
    },
    {
      title: "Changelog",
      description: "A list of all the changes we've made",
      icon: Bars4Icon,
      href: "/changelog",
    },
    {
      title: "Migration Guides",
      description: "Migrations guides that cover popular setups",
      icon: BookmarkSquareIcon,
      href: "/docs/appendices/migration-guides",
    },
    {
      title: "Support",
      description: "Read our latest help articles or contact support",
      icon: RssIcon,
      href: "https://help.front-commerce.com/",
    },
  ];

  const getLinkTypeProps = (href: string) => {
    if (href.startsWith("/")) {
      return { to: href }; // internal links
    }
    return { href };
  };

  return (
    <div className="max-w-xl mx-auto py-16 ">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wide uppercase">
        Popular pages
      </h2>
      <ul
        role="list"
        className="mt-4 border-t border-b border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-700 list-nonde pl-0"
      >
        {links.map((link, linkIdx) => (
          <li
            key={linkIdx}
            className="relative pt-8 pb-4 flex items-start space-x-4 border-solid border-0 border-red-500"
          >
            <div className="flex-shrink-0">
              <span className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50">
                <link.icon
                  className="h-6 w-6 text-primary-700"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-0">
                <span className="rounded-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <Link
                    {...getLinkTypeProps(link.href)}
                    className="focus:outline-none focus:no-underline hover:no-underline text-gray-800 dark:text-gray-200"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    {link.title}
                  </Link>
                </span>
              </h3>
              <p className="text-base text-gray-500 dark:text-gray-300">
                {link.description}
              </p>
            </div>
            <div className="flex-shrink-0 self-center">
              <ChevronRightIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link
          to="/"
          className="text-base font-medium text-primary-600 dark:text-primary-300 hover:text-primary-500"
        >
          Or go back home<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default function NotFound() {
  // TODO - create a notification to alert
  // on 404 pages to improve our redirection
  // and rewrites rule set
  // useEffect(() => {}, [])

  return (
    <>
      <PageMetadata
        title={translate({
          id: "theme.NotFound.title",
          message: "Page Not Found",
        })}
      />
      <Layout>
        <main className="container margin-vert--xl">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300 uppercase tracking-wide">
              <Translate
                id="theme.NotFound.errorCode"
                description="  404 error"
              >
                404 error
              </Translate>
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight sm:text-5xl">
              <Translate
                id="theme.NotFound.h1"
                description="This page does not exist."
              >
                This page does not exist.
              </Translate>
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              <Translate
                id="theme.NotFound.p1"
                description="The page you are looking for could not be found."
              >
                The page you are looking for could not be found.
              </Translate>
            </p>
          </div>

          <PopularPages />
        </main>
      </Layout>
    </>
  );
}
