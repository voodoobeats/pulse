import Link from 'next/link';

// Slim, low-key bottom bar. Legal links must be reachable from every page
// (incl. the studio) but should stay out of the way.
export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <span className="foot-copy">© {year} Voodoo Beats</span>
      <nav className="foot-links">
        <Link href="/imprint">Imprint</Link>
        <span className="dot">·</span>
        <Link href="/privacy">Privacy</Link>
        <span className="dot">·</span>
        <Link href="/terms">Terms</Link>
        <span className="dot">·</span>
        <Link href="/support" className="foot-support">Support</Link>
      </nav>
    </footer>
  );
}
