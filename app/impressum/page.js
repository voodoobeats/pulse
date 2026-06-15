export const metadata = { title: 'Impressum — Voodoo Visualizer' };

export default function ImpressumPage() {
  return (
    <div className="page">
      <div className="prose">
        <h1>Impressum</h1>

        <p className="note">
          Platzhalter — vor dem öffentlichen Launch ausfüllen. Tipp: einen
          seriösen Impressum-Generator (z. B. eRecht24) als Basis nutzen und
          im Zweifel anwaltlich prüfen lassen. Dies ist kein Rechtsrat.
        </p>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          [Vor- und Nachname]<br />
          [Straße und Hausnummer]<br />
          [PLZ und Ort]<br />
          Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: [deine@email.de]
        </p>

        <h2>Verantwortlich für den Inhalt</h2>
        <p>[Vor- und Nachname, Anschrift wie oben]</p>
      </div>
    </div>
  );
}
