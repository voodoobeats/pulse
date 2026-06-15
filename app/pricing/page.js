export const metadata = { title: 'Preise — Voodoo Visualizer' };

export default function PricingPage() {
  return (
    <div className="page">
      <h1>Preise</h1>
      <p className="sub">Starte kostenlos. Premium kommt bald.</p>

      <div className="tiers">
        <div className="tier featured">
          <h3>Free</h3>
          <div className="price">0 €</div>
          <ul>
            <li>Voller Visualizer</li>
            <li>1080p/60 Export</li>
            <li>Werbung vor jedem Render</li>
            <li>Shorts (vertikal)</li>
          </ul>
          <a href="/studio" className="btn primary">Jetzt starten</a>
        </div>

        <div className="tier soon">
          <span className="badge">Bald verfügbar</span>
          <h3>Premium</h3>
          <div className="price">
            9,99 € <small>/ Monat</small>
          </div>
          <ul>
            <li>Keine Werbung</li>
            <li>1080p/60 &amp; 4K Export</li>
            <li>Shorts ohne Limit</li>
            <li>Priorisierter Support</li>
          </ul>
          <button className="btn" disabled>
            Bald verfügbar
          </button>
        </div>
      </div>
    </div>
  );
}
