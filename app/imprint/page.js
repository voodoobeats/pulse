export const metadata = { title: 'Imprint — Pulse' };

export default function ImprintPage() {
  return (
    <div className="legal">
      <h1>Imprint</h1>
      <p className="updated">Legal notice pursuant to § 5 DDG (German Digital Services Act)</p>

      <h2>Provider</h2>
      <p className="addr">
        Voodoo Beats<br />
        Schleswiger Damm 129<br />
        20457 Hamburg<br />
        Germany
      </p>

      <h2>Contact</h2>
      <p>Email: <a href="mailto:vdinstrumentals@gmail.com">vdinstrumentals@gmail.com</a></p>

      <h2>Responsible for content</h2>
      <p>Responsible for the content pursuant to § 18 (2) MStV: Voodoo Beats (address as above).</p>

      <h2>EU dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR):{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>. We are neither obligated nor willing to participate in dispute resolution
        proceedings before a consumer arbitration board.
      </p>

      <h2>Liability for content</h2>
      <p>
        As a service provider we are responsible for our own content on these pages in
        accordance with general law. We are not obligated to monitor transmitted or stored
        third-party information or to investigate circumstances that indicate illegal activity.
        Obligations to remove or block the use of information under general law remain unaffected.
      </p>

      <h2>Liability for links</h2>
      <p>
        Our offer may contain links to external third-party websites over whose content we have
        no influence. We therefore cannot accept any liability for this third-party content. The
        respective provider or operator of the linked pages is always responsible for their content.
      </p>

      <div className="disclaimer">
        Template notice: This imprint covers the essentials required for a German sole
        proprietorship. If you operate as a registered business, have a VAT ID, or are entered in
        a commercial register, additional details (full legal name, register, VAT-ID per § 27a UStG)
        must be added. Please have this reviewed for your specific legal form.
      </div>
    </div>
  );
}
