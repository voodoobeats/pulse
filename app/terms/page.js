export const metadata = { title: 'Terms of Service — Pulse' };

export default function TermsPage() {
  return (
    <div className="legal">
      <h1>Terms of Service</h1>
      <p className="updated">Last updated: {new Date().getFullYear()}</p>

      <h2>1. Provider &amp; scope</h2>
      <p>
        These Terms govern your use of Pulse (&ldquo;the Service&rdquo;), operated by Voodoo Beats,
        Schleswiger Damm 129, 20457 Hamburg, Germany (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating
        an account or using the Service you agree to these Terms. If you do not agree, do not use the
        Service.
      </p>

      <h2>2. The Service</h2>
      <p>
        Pulse is a browser-based tool for creating music visualizers and exporting them as video.
        Core editing and preview are available without charge. Rendering, high-resolution and Shorts
        export are part of the paid Premium plan. We may improve, change or discontinue features over
        time.
      </p>

      <h2>3. Accounts</h2>
      <p>
        Some features require an account. You must provide accurate information, keep your credentials
        secure, and are responsible for activity under your account. You must be at least 18 years old,
        or have the consent of a legal guardian, to enter into a paid subscription.
      </p>

      <h2>4. Subscriptions, prices &amp; billing</h2>
      <p>
        Premium is offered as a monthly or yearly subscription at the prices shown on the pricing page
        (in USD, including any applicable taxes). New subscriptions start with a 7-day free trial; you
        are not charged if you cancel before the trial ends. After the trial, the subscription renews
        automatically for the same period unless cancelled before the end of the current term. Payments
        are processed by Stripe; by subscribing you authorise recurring charges once the trial ends. We may change prices for future billing periods
        and will give reasonable advance notice; changes never apply retroactively to a period already
        paid.
      </p>

      <h2>5. Cancellation</h2>
      <p>
        You can cancel at any time via the &ldquo;Manage subscription&rdquo; option, which opens the
        Stripe customer portal. Cancellation takes effect at the end of the current paid period; you
        keep Premium access until then, and no further charges are made afterwards. We do not provide
        pro-rata refunds for partial periods unless required by law.
      </p>

      <h2>6. Right of withdrawal (EU consumers)</h2>
      <p>
        If you are a consumer in the EU, you generally have the right to withdraw from a contract for
        digital services within 14 days without giving reasons. Because Premium gives you immediate
        access to a digital service, you expressly request that we begin performance immediately and
        acknowledge that you lose your right of withdrawal once performance has fully begun. To
        exercise a withdrawal right where applicable, contact us at the email below.
      </p>

      <h2>7. Your content</h2>
      <p>
        You keep all rights to the audio, images and other material you load into the Service. Because
        these files are processed locally in your browser and are not uploaded to us, we do not claim
        any licence to them. You are solely responsible for ensuring you hold all necessary rights to
        the material you use and to the videos you create and publish. You must not use the Service to
        process content that is illegal or that infringes the rights of others.
      </p>

      <h2>8. Acceptable use</h2>
      <p>
        You agree not to misuse the Service, including by attempting to disrupt or reverse-engineer it,
        circumventing access or payment controls, or using it for unlawful purposes. We may suspend or
        terminate accounts that violate these Terms.
      </p>

      <h2>9. Availability &amp; warranty</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We do not guarantee
        uninterrupted availability or that the Service will be free of errors, and we do not warrant
        that rendered output will meet a specific expectation in every browser or hardware
        configuration. Statutory warranty rights for consumers remain unaffected.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        We are liable without limitation for damages arising from injury to life, body or health, for
        intent and gross negligence, and under the German Product Liability Act. For slight negligence
        we are liable only for breach of an essential contractual obligation (an obligation whose
        fulfilment makes the proper performance of the contract possible and on which you may regularly
        rely), and in that case liability is limited to the foreseeable, contract-typical damage. Any
        further liability is excluded.
      </p>

      <h2>11. Changes to these Terms</h2>
      <p>
        We may update these Terms where necessary (e.g. for legal reasons or new features). We will
        announce material changes with reasonable notice. Continued use after changes take effect
        constitutes acceptance.
      </p>

      <h2>12. Governing law &amp; jurisdiction</h2>
      <p>
        These Terms are governed by the laws of the Federal Republic of Germany, excluding the UN
        Convention on Contracts for the International Sale of Goods. Mandatory consumer protection
        provisions of your country of residence remain unaffected. Where permitted by law, the place
        of jurisdiction is Hamburg.
      </p>

      <h2>13. Severability &amp; contact</h2>
      <p>
        If any provision of these Terms is or becomes invalid, the remaining provisions remain in
        effect. Questions about these Terms:{' '}
        <a href="mailto:vdinstrumentals@gmail.com">vdinstrumentals@gmail.com</a>.
      </p>

      <div className="disclaimer">
        Template notice: These Terms follow common best practice for a German/EU SaaS subscription, but
        they are a starting template, not individual legal advice. In particular the withdrawal,
        billing and liability clauses should be reviewed by a lawyer for your business before launch.
      </div>
    </div>
  );
}
