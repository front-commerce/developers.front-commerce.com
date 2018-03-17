/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: "Occitech",
    image: "/test-site/img/docusaurus.svg",
    infoLink: "https://www.occitech.fr/",
    pinned: true
  }
];

const siteConfig = {
  title: "Front-Commerce",
  tagline:
    "Craft delightful e-commerce experiences using modern web technologies",
  url: "https://developers.front-commerce.com",
  cname: "developers.front-commerce.com",
  baseUrl: "/",
  organizationName: "front-commerce",
  projectName: "developers",
  gaTrackingId: "UA-1412249-44",
  algolia: {
    apiKey: "b5a7bf2be3c2b1c682e5c84d562d15d2",
    indexName: "front-commerce"
  },
  headerLinks: [
    { search: true },
    { doc: "welcome", label: "Docs" },
    { doc: "faq", label: "FAQ" },
    { page: "help", label: "Help" },
    { page: "license", label: "License" },
    { blog: true, label: "Blog" }
    /*
    { doc: "doc4", label: "API" },
      { languages: true }
    */
  ],
  users,
  /* path to images for header/footer */
  headerIcon: "img/fc-avatar-white.svg",
  footerIcon: "img/fc-avatar-white.svg",
  favicon: "img/favicon.png",
  /* colors for website */
  colors: {
    primaryColor: "#4A6BDD",
    secondaryColor: "#676767"
  },
  /* custom fonts for website */
  fonts: {
    fcDefault: ["Roboto Condensed"]
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: "Copyright © " + new Date().getFullYear() + " Front-Commerce",
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: "default",
    defaultLang: "javascript"
  },
  editUrl:
    "https://github.com/front-commerce/developers.front-commerce.com/edit/master/docs/",
  scripts: ["https://use.fontawesome.com/releases/v5.0.6/js/all.js"],
  stylesheets: [
    "https://fonts.googleapis.com/css?family=Roboto+Condensed%3A700%2C400%2C300italic%7CRoboto%3A300&ver=1517824551"
  ],
  twitter: true
  // You may provide arbitrary config keys to be used as needed by your template.
  // repoUrl: "https://github.com/facebook/test-site"
};

module.exports = siteConfig;
