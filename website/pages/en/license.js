const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const Container = CompLibrary.Container;
const MarkdownBlock = CompLibrary.MarkdownBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

class License extends React.Component {
  render() {
    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>License</h2>
            </header>
            <MarkdownBlock>
              One can start working with Front-Commerce on a project as soon as
              a valid license has been contracted.
            </MarkdownBlock>

            <MarkdownBlock>
              Support and software updates (new features, bugfixes, new
              integrations…) are included in the license fees — of course — but
              the most important is that you’ll be a customer. And we deeply
              care about our customers! **Prioritizing features is tough and we
              have a lot of ideas and things on our backlog.** We are focusing
              on delivering what is needed for our customers in priority, so you
              can ship your online store on time.
            </MarkdownBlock>

            <MarkdownBlock>
              **As a customer**, you will be able to have direct access to our
              team and open support ticket for features requests or technology
              improvements and have an impact. Do not hesitate to [contact
              us](contact@front-commerce.com) if there is something critical for
              your project that we do not have implemented yet. We will be
              transparent and honest with you and tell if we think we could be
              delivering what you need on time for your project… **it is maybe
              being worked on by our team or asked by another person right
              now!**
            </MarkdownBlock>

            <MarkdownBlock>
              {`
**As a developer or agency**, you can also become a Partner and
help us with our mission while being prepared for the future of e-commerce.
In 2018 we are looking to work with
close partners and build a rich ecosystem with different domains:

* UX designers,
* front-end agencies,
* microservices addicts,
* Magento agencies,
* accessibility experts,
* e-commerce consultants
* … you?

We need partners who believe in our mission and our
product, to get more feedback about our choices and
widespread the adoption of Front-Commerce.
Interested? Please [contact us](contact@front-commerce.com).
`}
            </MarkdownBlock>

            <MarkdownBlock>
              See [our pricing page](https://www.front-commerce.com/en/pricing)
              for further and more concrete information about our license.
            </MarkdownBlock>
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = License;
