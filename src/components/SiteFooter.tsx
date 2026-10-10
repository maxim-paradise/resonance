import { APP_NAME } from '../lib/site';
import { DOWNLOAD_HASH, GITHUB_ISSUES_URL, GITHUB_RELEASES_URL, GITHUB_REPO_URL, HOME_HASH } from '../lib/site';

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-dots" aria-hidden="true">
        <div className="footer-dots__line" />
      </div>
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <h2>One Native Player for Every Desktop</h2>
          <nav className="site-footer__nav" aria-label="Footer navigation">
            <a href="#features">Features</a>
            <a href="#platforms">Platforms</a>
            <a href="#sources">Integrations</a>
            <a href={DOWNLOAD_HASH}>Download</a>
            <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer">Changelog</a>
          </nav>
          <nav className="site-footer__nav" aria-label="Company links">
            <a href="#/">About</a>
            <a href={GITHUB_ISSUES_URL} target="_blank" rel="noreferrer">Support</a>
            <a href={`${GITHUB_REPO_URL}#readme`} target="_blank" rel="noreferrer">Docs</a>
            <a href="#contact">Contact Us</a>
          </nav>
          <nav className="site-footer__nav" aria-label="Social links">
            <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://x.com" target="_blank" rel="noreferrer">Follow Us on X</a>
          </nav>
        </div>
        <div className="site-footer__brand-row">
          <a className="site-footer__brand" href={HOME_HASH} aria-label={`${APP_NAME} home`}>
            <span className="site-footer__mark" aria-hidden="true" />
            <span>{APP_NAME}</span>
          </a>
        </div>
        <div className="site-footer__legal">
          <p>© 2026 {APP_NAME}. All rights reserved.</p>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}
