const React = require("react");
const classnames = require("classnames");

const CompLibrary = require("../../core/CompLibrary.js");
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

function imgUrl(img) {
  return siteConfig.baseUrl + "img/" + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + "docs/" + (language ? language + "/" : "") + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + "/" : "") + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a
          className={classnames("button", {
            "button--primary": this.props.primary
          })}
          href={this.props.href}
          target={this.props.target}
        >
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self"
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || "";
    return (
      <SplashContainer>
        <Logo img_src={imgUrl("fc-avatar.svg")} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("getting-started.html", language)} primary>
              Getting started
            </Button>
          </PromoSection>
          <PromoSection>
            <Button href={docUrl("vision.html", language)}>
              Why Front-Commerce?
            </Button>
            <Button href={docUrl("architecture-overview.html", language)}>
              Architecture
            </Button>
            <Button href={docUrl("recipes.html", language)}>Recipes</Button>
            <Button href="https://demo.front-commerce.com">
              Demo store
              <i
                className="fas fa-external-link-alt"
                style={{ marginLeft: "10px" }}
              />
            </Button>
            <Button href="https://styleguide.front-commerce.com">
              Styleguide
              <i
                className="fas fa-external-link-alt"
                style={{ marginLeft: "10px" }}
              />
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={["bottom", "top"]}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="fourColumn">
    {[
      {
        content: `Build the user experience you really want by extending and building upon our
          base React theme and idiomatic components.
          As a frontend developer, **you can use the tools you are productive with**.
          Work with static files using our living styleguide powered by [Storybook](https://storybook.js.org),
          without the whole backend.`,
        image: imgUrl("logos/react.svg"),
        imageAlign: "top",
        title: "React application"
      },
      {
        content: `Leverage the GraphQL typing system to expose your data easily,
          no matter the source. Host it on your infrastructure and **supercharge your current
          solutions (CMS, eCommerce Platform, PIM, ERP)** to support modern clients (eg: PWA).
          Our GraphQL middleware includes everything you’ll need to build a fast website,
          and **embrace a microservice architecture** even with slow backends.`,
        image: imgUrl("logos/graphql.svg"),
        imageAlign: "top",
        title: "GraphQL middleware"
      },
      {
        content: `Started in 2015 **Front-Commerce is already powering
          shops in production**. We provide out of the box: an extensive logging system (client / server errors),
          error boundaries, maintenance mode, SEO, i18n, security, caching and invalidation, payments,
          efficient image processing…`,
        image: imgUrl("battery-charged.svg"),
        imageAlign: "top",
        title: "Production ready!"
      }
    ]}
  </Block>
);

const FeatureCallout = props => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: "center" }}
  >
    <h2>User experience &amp; Quality</h2>
    <MarkdownBlock>
      We believe that each store has a different set of users and **each brand
      has its own way to communicate with its customers**. Existing e-commerce
      solutions provide a default or community themes, but it quickly becomes
      difficult to adapt to what you really want without introducing technical
      debt. We try to solve that!
    </MarkdownBlock>
    <MarkdownBlock>
      Front-Commerce follows the Atomic Design principles to provide **a
      maintainable, extendable and composable theme**. By moving React
      components around and adapting the atoms to your brand, you will be able
      to create your own atmosphere. If you need more, combine any data exposed
      in GraphQL into a totally custom reactive UI in weeks instead of months.
    </MarkdownBlock>
    <MarkdownBlock>
      Web technologies evolve at a fast pace and **it’s hard to stay up-to-date,
      but your users deserves the best**. Our promise is to provide you a solid,
      performant and accessible theme as your foundation. We will upgrade the
      underlying libraries and base components for you so you could get the new
      best practices for free. We have only just begun! Here is what’s next:
      a11y, responsive images, PWA, smaller bundles, HTTP2…
    </MarkdownBlock>
  </div>
);

const Magento2 = props => (
  <Block background="light" id="magento2">
    {[
      {
        content: `
Even though we built Front-Commerce with a vision of introducing a clean
separation between the frontend and your backend solution, we started with one of
the most popular and complete open-source platform in the market.
**Our solution supports most of Magento2 features and custom code: if it works in Magento it will work with Front-Commerce!**
* search and navigation using ElasticSearch
* multi-stores instances
* advanced pricing: coupon codes, promotion rules, taxes…
* highly customizable checkout, supporting Magento custom shipping and payment extensions
* account management (forgotten passwords, emails…)
* SEO: clean urls, redirections, sitemaps, meta information and rich data
`,
        image: imgUrl("logos/magento.svg"),
        imageAlign: "right",
        title: "Magento 2"
      }
    ]}
  </Block>
);

const DesignSystem = props => (
  <Block id="try">
    {[
      {
        content: `
Front-Commerce default theme contains a Design System for more efficient interactions between designers and developers.
The web is a rich medium and the « page » metaphor for building an application is outdated. With PWAs
there are several variants of the same application screen depending on: the content, the device,
its connectivity and many other things.
**Thinking in term of components helps to keep a consistent user experience, and makes prototyping / developing new
features much more easier.** Design Systems help to achieve this!

The design system is also a the place where we will help you to ensure you do not introduce regressions
and you keep good a11y practices.
`,
        image: imgUrl("design-system.jpg"),
        imageAlign: "left",
        title: "Design system"
      }
    ]}
  </Block>
);

const Responsibilities = props => (
  <Block background="dark">
    {[
      {
        content: `
Complex projects requires several teams to collaborate. **Front-Commerce helps by defining
clear boundaries in the system, so each team can work independently.**

For instance, a team can work on delivering Magento2 customization and exposing it through
the WebAPI while another can set up a PIM to manage all your products data and finally your
in house frontend developers can work on creating an awesome experience in the browser while
your UX designers can iterate on new prototypes.

With Front-Commerce’s architecture you will be able to isolate each responsibilities in their
own codebase if you need it.
`,
        image: imgUrl("laughing-friends-on-couch_925x.jpg"),
        imageAlign: "right",
        title: "Teams collaboration"
      }
    ]}
  </Block>
);

const Tested = props => (
  <Block background="light" id="hp-tests">
    {[
      {
        content: `
When time comes to choose a solution to build your brand’s public image for your storefront,
you must take quality into consideration. **New technologies are worthless if quality is left behind.**

We are committed to deliver code with a high level of quality, and thus are including tests at
several levels. React components including in the design system have [structural tests using
Storyshots](https://storybook.js.org/testing/structural-testing/). Critical logic and
reusable utilities also are unit tested using [Jest](https://facebook.github.io/jest/).
GraphQL resolvers are using [Pact.js](https://docs.pact.io/) to enable generating
Consumer contracts and ensuring the middleware works fine no matter the number of services
you have.

Our mission is to help you crafting good code, that’s why you could leverage our base tooling
to develop your features with tests too!
`,
        title: "Tests, tests and tests"
      },
      {
        content: `<script data-rows="30" data-cols="120" src="https://asciinema.org/a/e8J14tmq9l6uKETzgZjZ7YfFk.js" id="asciicast-e8J14tmq9l6uKETzgZjZ7YfFk" async></script>`
      }
    ]}
  </Block>
);

const ContactUs = props => (
  <div className="productShowcaseSection paddingTop paddingBottom">
    <h2>Still interested? Any questions?</h2>
    <p>
      If you are interested with what you’ve read or things are still not clear,
      do not hesitate to reach us! We could schedule a call or a demo so you
      could evaluate the product in a more concrete way.
    </p>
    <div className="more-users">
      <a
        className="button"
        href="mailto:contact@front-commerce.com?subject=I’m interested!"
      >
        Contact the team
      </a>
    </div>
  </div>
);

class Index extends React.Component {
  render() {
    let language = this.props.language || "";
    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          <Magento2 />
          <DesignSystem />
          <Responsibilities />
          <Tested />
          <ContactUs />
        </div>
      </div>
    );
  }
}

module.exports = Index;
