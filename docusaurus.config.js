// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

require("dotenv").config();

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const REPOSITORY_URL =
  "https://github.com/front-commerce/developers.front-commerce.com";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Front Commerce Developers",
  tagline:
    "Stay one step ahead and consistently deliver the brand experience your customers expect",
  url: "https://developers.front-commerce.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",

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
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: ({ locale, docPath, versionDocsDirPath, permalink }) => {
            return `${REPOSITORY_URL}/tree/main/${versionDocsDirPath}/${docPath}`;
          },
        },
        blog: {
          showReadingTime: true,
          editUrl: ({ locale, blogDirPath, blogPath, permalink }) => {
            return `${REPOSITORY_URL}/tree/main/${blogDirPath}/${blogPath}`;
          },
          path: "changelog",
          routeBasePath: "/changelog",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        // see https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-analytics
        googleAnalytics: {
          trackingID: process.env.GOOGLE_ANALYTICS || "UA-154725716-1",
          anonymizeIP: true,
        },
        // see https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag
        gtag: {
          trackingID: process.env.GOOGLE_TAG_MANAGER || "GTM-WRN2WPF",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "Front-Commerce",
          src: "img/logo-full-black.svg",
          srcDark: "img/logo-full-white.svg",
        },
        items: [
          {
            type: "doc",
            docId: "welcome",
            position: "right",
            label: "Docs",
          },
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
                label: "Introduction",
                to: "/docs/welcome",
              },
              {
                label: "Essentials",
                to: "/docs/category/essentials",
              },
              {
                label: "Concepts",
                to: "/docs/category/concepts",
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
        magicComments: [
          // Remember to extend the default highlight class name as well!
          {
            className: "theme-code-block-highlighted-line",
            line: "highlight-next-line",
            block: { start: "highlight-start", end: "highlight-end" },
          },
          {
            className: "code-block-error-line",
            line: "This will error",
          },
        ],
      },

      algolia: {
        // The application ID provided by Algolia
        appId: "5GW5VSP0PU",

        // Public API key: it is safe to commit it
        apiKey: "79a6baff7cbdd96f9db8aeb1828c63a3",

        indexName: "front-commerce",

        // Optional: It ensures that search results are relevant to the current language and version.
        contextualSearch: false,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        // searchPagePath: "search",

        //... other Algolia params
      },
    }),
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
        id: "universal-analytics",
        trackingID: "UA-154725716-1",
        anonymizeIP: true,
      },
    ],
  ],
  scripts: [
    "//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js",
  ],
  stylesheets: [
    "//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css",
  ],
};

module.exports = config;
