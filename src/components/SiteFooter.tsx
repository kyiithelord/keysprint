export default function SiteFooter() {
  return <footer className="site-footer" id="about">
    <div><a className="brand" href="/">Typencil</a><p>Free typing practice for steady progress.</p></div>
    <nav aria-label="Company and legal"><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a></nav>
    <small>© {new Date().getFullYear()} Typencil</small>
  </footer>;
}
