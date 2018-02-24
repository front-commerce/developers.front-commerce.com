const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + "docs/" + (language ? language + "/" : "") + doc;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + "/" : "") + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl("doc1.html", this.props.language)}>
              Getting Started (or other categories)
            </a>
            <a href={this.docUrl("doc2.html", this.props.language)}>
              Guides (or other categories)
            </a>
            <a href={this.docUrl("doc3.html", this.props.language)}>
              API Reference (or other categories)
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a href={this.pageUrl("users.html", this.props.language)}>
              User Showcase
            </a>
            <a
              href="http://www.front-commerce.com/en/partners/"
              target="_blank"
            >
              Partners
            </a>
            <a href="https://front-commerce.slack.com/" target="_blank">
              Slack (invite only)
            </a>
            <a href="https://twitter.com/Front_Commerce" target="_blank">
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.props.config.baseUrl + "blog"}>Blog</a>
            <a href="https://github.com/front-commerce">GitHub</a>
            <a href="https://www.front-commerce.com">Website</a>
            <a href="https://demo.front-commerce.com">Public Demo</a>
            <a href="http://splash.front-commerce.com">Splash!</a>
          </div>
        </section>

        <a
          href="https://www.front-commerce.com"
          target="_blank"
          className="fcLogo"
        >
          <img
            src={
              this.props.config.baseUrl + "img/fc_logo_2018--column-white.svg"
            }
            alt="Front-Commerce"
            width="340"
            height="90"
          />
        </a>
        <section className="copyright">
          Copyright &copy; {currentYear} Front-Commerce.
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
