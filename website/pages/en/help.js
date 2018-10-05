/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          "Learn more using the [documentation on this site.](/docs/welcome.html)",
        title: "Browse Docs"
      },
      {
        content:
          "Read our [FAQ](/docs/faq.html) to find answers to questions we get the most often.",
        title: "Read our FAQ"
      },
      {
        content: `Join the discussion in our [Slack channel](https://join.slack.com/t/front-commerce/shared_invite/enQtMzI2OTEyMDYzOTkxLWY0Y2JjYmRmNGQ2MWM1NzQyMjQwNzlmYzJmYzgzNTIwYzQ3MDVkMWZiYmYwNWFhODhmYWM5OTI4YjdiZDJkY2Q).
          We are also [reachable by email](mailto:contact@front-commerce.com) for questions about this documentation
          and the project.`,
        title: "Join the community"
      },
      {
        content: `Find out what's new with this project by following [@Front_Commerce](https://twitter.com/Front_Commerce)
          on Twitter or subscribing to our newsletter.`,
        title: "Stay up to date"
      }
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>Need help?</h2>
            </header>
            <p>
              This developer area is being improved every day based on your
              feedbacks an contributions (issues, PR). Our team is available to
              answer you in a timely manner. For additional help you can try one
              of the following page.
            </p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
