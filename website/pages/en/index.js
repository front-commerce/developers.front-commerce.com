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
            <Button href="https://demo.front-commerce.com" primary>
              Getting started
            </Button>
          </PromoSection>
          <PromoSection>
            <Button href={docUrl("doc1.html", language)}>
              Why Front-Commerce?
            </Button>
            <Button href={docUrl("doc2.html", language)}>Architecture</Button>
            <Button href={docUrl("doc2.html", language)}>Recipes</Button>
            <Button href="https://demo.front-commerce.com">
              Demo store
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
          base React theme and components.
          As a frontend developer, **you can use the tools you are productive with**.
          Work with static files using our living styleguide powered by [Storybook](https://storybook.js.org),
          without the whole backend.`,
        image: imgUrl("logos/react.svg"),
        imageAlign: "top",
        title: "React application"
      },
      {
        content: `Leverage the GraphQL typing system to expose your data easily,
          no matter the source. **Split your business logic into different
          services or keep your existing stack**. Our GraphQL middleware includes
          everything you’ll need to build a fast website, even with slow backends.`,
        image: imgUrl("logos/graphql.svg"),
        imageAlign: "top",
        title: "GraphQL middleware"
      },
      {
        content: `Started in 2015, the product is not a POC anymore: **Front-Commerce is already powering
          shops in production**. We provide out of the box an extensive logging system (client / server errors),
          error boundaries, maintenance mode, SEO, i18n, security, caching and invalidation, payments,
          performant image processing…`,
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
      We believe that each store has a different set of users and each brand has
      its own way to communicate with its customers. Existing e-commerce
      solutions provide a default or community themes, but it quickly becomes
      difficult to adapt to what you really want without introducing technical
      debt. We try to solve that!
    </MarkdownBlock>
    <MarkdownBlock>
      Front-Commerce follows the Atomic Design principles to provide a
      maintainable, extendable and composable theme. By moving React components
      around and adapting the atoms to your brand, you will be able to create
      your own atmosphere. If you need more, combine any data exposed in GraphQL
      into a totally custom reactive UI in weeks instead of months.
    </MarkdownBlock>
    <MarkdownBlock>
      Web technologies evolve at a fast pace and it’s hard to stay up-to-date,
      but your users deserves the best. Our promise is to provide you a solid,
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
Our solution supports most of Magento2 features and custom code: if it works in Magento it will work with Front-Commerce!
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

const TryOut = props => (
  <Block id="try">
    {[
      {
        content:
          "We also provide a design system to serve as a basis for interactions between designers and developers.",
        image: imgUrl("docusaurus.svg"),
        imageAlign: "left",
        title: "Design system"
      }
    ]}
  </Block>
);

const Description = props => (
  <Block background="dark">
    {[
      {
        content: "Split responsabilities between backend and frontend teams",
        image: imgUrl("docusaurus.svg"),
        imageAlign: "right",
        title: "Teams collaboration"
      }
    ]}
  </Block>
);

const Tested = props => (
  <Block>
    {[
      {
        content: `Your frontend will evolve and we want `,
        image: imgUrl("docusaurus.svg"),
        imageAlign: "left",
        title: "Tests at all levels"
      }
    ]}
  </Block>
);

const ContactUs = props => (
  <div className="productShowcaseSection paddingBottom">
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
          <TryOut />
          <Description />
          <ContactUs />
        </div>
      </div>
    );
  }
}

module.exports = Index;
