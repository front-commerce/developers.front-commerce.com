import "dotenv/config";

import { themes } from "prism-react-renderer";
import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
const REPOSITORY_URL =
  "https://github.com/front-commerce/developers.front-commerce.com";

// ensures that the docs only index when in production build, this variable
// is set by netlify and should be updated if deploying to another environment.
// see: https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
const noIndex = process.env.CONTEXT !== "production";

const LAST_VERSION = "current";
const LAST_VERSION_URL = LAST_VERSION === "current" ? "3.x" : LAST_VERSION;

// Used to reverse the Migration Guide items so that the latest version is on top.
function reverseSidebarItems(items) {
  const result = items.map((item) => {
    if (item.type === "category") {
      if (item.label === "Upgrade") {
        return { ...item, items: reverseSidebarItems(item.items) };
      }
      if (item.label === "Migration guides") {
        return { ...item, items: item.items.reverse() };
      }
    }
    return item;
  });

  return result;
}

export default {
  title: "Front-Commerce Developers",
  tagline: "A blazing fast & ready to use Headless PWA Frontend solution",
  url: "https://developers.front-commerce.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",

  noIndex,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "front-commerce", // Usually your GitHub org/user name.
  projectName: "developers.front-commerce.com", // Usually your repo name.

  onBrokenMarkdownLinks: "throw",
  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  customFields: {
    INTERCOM_APP_ID: process.env.INTERCOM_APP_ID || "xh1u2003",
    LAST_VERSION: LAST_VERSION_URL,
  },

  presets: [
    [
      "classic",
      {
        docs: {
          editUrl: ({ docPath, versionDocsDirPath }) => {
            return `${REPOSITORY_URL}/tree/main/${versionDocsDirPath}/${docPath}`;
          },
          lastVersion: LAST_VERSION,
          versions: {
            current: {
              label: "3.x",
              path: "3.x",
            },
            "2.x": {
              label: "2.x",
              path: "2.x",
              banner: "none",
            },
          },
          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            return reverseSidebarItems(sidebarItems);
          },
        },
        blog: {
          showReadingTime: true,
          editUrl: ({ blogDirPath, blogPath }) => {
            return `${REPOSITORY_URL}/tree/main/${blogDirPath}/${blogPath}`;
          },
          feedOptions: {
            title: "Front-Commerce Developers Blog",
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      logo: {
        alt: "Front-Commerce",
        src: "img/logo-full-black.svg",
        srcDark: "img/logo-full-white.svg",
      },
      items: [
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
        },
        {
          type: "doc",
          docId: "welcome",
          position: "right",
          label: "Docs",
        },
        { to: "/community", label: "Community", position: "right" },
        { to: "/blog", label: "Blog", position: "right" },
        { to: "/changelog", label: "Changelog", position: "right" },
        {
          href: "https://help.front-commerce.com/en/articles/5910607-when-how-can-i-reach-the-front-commerce-support-team",
          label: "Support",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "3.x",
              to: `/docs/3.x/welcome`,
            },
            {
              label: "2.x",
              to: `/docs/2.x/welcome`,
            },
            {
              label: "Migrating from v2",
              to: `/docs/3.x/category/migrating-from-v2`,
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Slack",
              href: "https://join.slack.com/t/front-commerce/shared_invite/enQtMzI2OTEyMDYzOTkxLWEzODg2NjM5MmVhNGUwODE0OTI4MWMwYTcxZWZkNzE1YjU4MzRlZmQ0YWY5NDNkZWM0ZGMzMGQ4NDc4OTgxMTU",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/Front_Commerce",
            },
            {
              label: "Contact",
              href: "https://www.front-commerce.com/en/contact-us/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Changelog",
              to: "/changelog",
            },
            {
              label: "GitHub",
              href: "https://github.com/front-commerce",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Front-Commerce`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: [
        "bash",
        "diff",
        "json",
        "css",
        "graphql",
        "git",
        "sass",
        "scss",
        "typescript",
        "yaml",
        "javascript",
        "css-extras",
      ],
      magicComments: [
        // Remember to extend the default highlight class name as well!
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-block-error-line",
          line: "error-next-line",
          block: { start: "error-start", end: "error-end" },
        },
        {
          className: "code-block-removed-line",
          line: "remove-next-line",
          block: { start: "remove-start", end: "remove-end" },
        },
        {
          className: "code-block-added-line",
          line: "add-next-line",
          block: { start: "add-start", end: "add-end" },
        },
      ],
    },

    algolia: {
      appId: "5GW5VSP0PU",
      apiKey: "79a6baff7cbdd96f9db8aeb1828c63a3",
      indexName: "front-commerce",
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    async function tailwindPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    [
      "@docusaurus/plugin-client-redirects",
      {
        fromExtensions: ["html", "htm"],
      },
    ],
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    [
      "@docusaurus/plugin-google-gtag",
      {
        id: "google-analytics-4",
        trackingID: "G-4N34PMFVBG",
        anonymizeIP: true,
      },
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        showReadingTime: true,
        editUrl: ({ locale, blogDirPath, blogPath, permalink }) => {
          return `${REPOSITORY_URL}/tree/main/${blogDirPath}/${blogPath}`;
        },
        id: "changelog",
        routeBasePath: "/changelog",
        path: "./changelog",
        blogTitle: "Changelog",
        blogDescription:
          "Discover all the latest features brought to Front-Commerce.",
        feedOptions: {
          title: "Front-Commerce Changelog",
        },
      },
    ],
  ],
  scripts: [
    "//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js",
  ],
  stylesheets: [
    "//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css",
  ],
} satisfies Config;
