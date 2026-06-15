import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="hero">
      <h1>
        Mach aus deinen Beats <span className="grad">cinematische Visualizer</span>
      </h1>
      <p>
        Lade Track, Logo und Hintergrund hoch und rendere in 1080p/60 — Spektrum,
        Bass-Bounce, Effekte und vertikale Shorts. Alles direkt im Browser.
      </p>
      <div className="hero-cta">
        <Link href="/studio" className="btn primary lg">Zum Studio</Link>
        <Link href="/pricing" className="btn ghost lg">Preise ansehen</Link>
      </div>
    </section>
  );
}
