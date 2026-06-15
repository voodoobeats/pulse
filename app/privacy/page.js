export const metadata = { title: 'Privacy Policy — Pulse' };

export default function PrivacyPage() {
  return (
    <div className="legal">
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated: {new Date().getFullYear()} · in accordance with the GDPR</p>

      <p>
        This policy explains what personal data we process when you use Pulse
        (&ldquo;the Service&rdquo;), why, and what rights you have. We keep data collection to the
        minimum needed to run the Service.
      </p>

      <h2>1. Controller</h2>
      <p className="addr">
        Voodoo Beats<br />
        Schleswiger Damm 129, 20457 Hamburg, Germany<br />
        <a href="mailto:vdinstrumentals@gmail.com">vdinstrumentals@gmail.com</a>
      </p>

      <h2>2. Your media stays on your device</h2>
      <p>
        Audio files, images and logos you load into the visualizer are processed{' '}
        <strong>locally in your browser</strong>. They are used to generate the preview and the
        rendered video on your own device and are <strong>not uploaded to or stored on our
        servers</strong>. The finished video is created in your browser and downloaded directly by you.
      </p>

      <h2>3. Account &amp; authentication</h2>
      <p>
        Sign-in and account management are handled by our processor Clerk. When you create an
        account, Clerk processes data such as your email address, a password or third-party login
        identifier, and session/usage metadata (e.g. IP address, device and timestamps) to keep
        you securely signed in. Legal basis: Art. 6 (1)(b) GDPR (performance of the contract) and
        Art. 6 (1)(f) GDPR (secure operation).
      </p>

      <h2>4. Payments</h2>
      <p>
        Subscriptions and payments are processed by Stripe. When you subscribe, Stripe collects the
        payment data you enter (e.g. card details, name, billing country) directly; we do not
        receive or store full payment card numbers. We receive a customer and subscription
        identifier and the subscription status in order to unlock and manage Premium access. Legal
        basis: Art. 6 (1)(b) GDPR.
      </p>

      <h2>5. Hosting &amp; server logs</h2>
      <p>
        The Service is hosted by Vercel. When you access the site, the infrastructure automatically
        processes technical access data (e.g. IP address, browser type, requested URL, timestamp)
        as is technically necessary to deliver the site and to ensure stability and security. Legal
        basis: Art. 6 (1)(f) GDPR.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use only cookies and comparable storage that are strictly necessary for the Service to
        function &mdash; in particular session cookies set by Clerk to keep you signed in. We do not
        use advertising or cross-site tracking cookies. Strictly necessary cookies do not require
        consent (§ 25 (2) TDDDG).
      </p>

      <h2>7. Processors &amp; transfers to third countries</h2>
      <p>
        We use the processors named above (Clerk, Stripe, Vercel) under data processing agreements
        pursuant to Art. 28 GDPR. Some of them may process data on servers located outside the EU,
        including in the USA. Where this happens, transfers are safeguarded by appropriate
        mechanisms such as the EU Standard Contractual Clauses and/or the EU&ndash;US Data Privacy
        Framework.
      </p>

      <h2>8. Retention</h2>
      <p>
        We keep account and subscription data for as long as your account exists and as required to
        fulfil the contract. Billing records are retained for the statutory periods (generally up to
        10 years under German tax and commercial law). When you delete your account, related personal
        data is deleted or anonymised unless we are legally required to retain it.
      </p>

      <h2>9. Your rights</h2>
      <p>Under the GDPR you have the right to:</p>
      <ul>
        <li>access your personal data (Art. 15)</li>
        <li>rectification of inaccurate data (Art. 16)</li>
        <li>erasure (Art. 17) and restriction of processing (Art. 18)</li>
        <li>data portability (Art. 20)</li>
        <li>object to processing based on legitimate interests (Art. 21)</li>
        <li>withdraw consent at any time with effect for the future (Art. 7 (3))</li>
      </ul>
      <p>To exercise any of these rights, contact us at the address above.</p>

      <h2>10. Right to complain</h2>
      <p>
        You have the right to lodge a complaint with a supervisory authority. The authority
        responsible for us is the Hamburg Commissioner for Data Protection and Freedom of Information
        (Der Hamburgische Beauftragte f&uuml;r Datenschutz und Informationsfreiheit).
      </p>

      <div className="disclaimer">
        Template notice: This policy reflects common best practice for a GDPR-compliant SaaS using
        Clerk, Stripe and Vercel. Confirm the actual processors, sub-processors and data flows you
        use, keep the processor list current, and have the final text reviewed by a data-protection
        professional before launch.
      </div>
    </div>
  );
}
