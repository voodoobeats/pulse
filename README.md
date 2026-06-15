# Voodoo Visualizer — MVP

Next.js-Website mit Login (Clerk, E-Mail + Social), dem Visualizer unter `/studio`
und einer Pricing-Seite (Premium aktuell ausgegraut). Rendering läuft komplett im
Browser. Build ist getestet und läuft.

---

## Was schon drin ist
- `/` Landing
- `/sign-in`, `/sign-up` — Login/Registrierung (Clerk)
- `/studio` — der Visualizer (aktuell offen; Login-Schutz kommt als nächster Schritt)
- `/pricing` — Free aktiv, Premium ausgegraut („Bald verfügbar")
- `/impressum` — Platzhalter (vor Launch ausfüllen)

---

## Schritt für Schritt online stellen

### Schritt 1 — Vorbereiten
Du brauchst (alle kostenlos zum Start):
- **Node.js** installiert (für lokales Testen)
- **GitHub**-Account
- **Vercel**-Account (mit GitHub verbinden)
- **Clerk**-Account (clerk.com)

### Schritt 2 — Clerk-App anlegen (liefert die Login-Keys)
1. Bei Clerk einloggen → **Create application**.
2. Bei den Sign-in-Optionen **Email** und **Google** (und was du sonst willst) aktivieren.
3. Im Dashboard unter **API Keys** kopierst du dir zwei Werte:
   - `Publishable key` (beginnt mit `pk_test_…`)
   - `Secret key` (beginnt mit `sk_test_…`)
> Für den Start reichen die `test`-Keys (Development) — die funktionieren auch auf
> deiner Vercel-URL. Vor dem echten Launch später eine Production-Instanz mit eigener
> Domain anlegen.

### Schritt 3 — Lokal testen (optional, empfohlen)
```bash
npm install
cp .env.local.example .env.local
# .env.local öffnen und die zwei Clerk-Keys eintragen
npm run dev
```
→ http://localhost:3000 öffnen. Registrieren, einloggen, `/studio` testen.

### Schritt 4 — Auf GitHub pushen
```bash
git init
git add .
git commit -m "MVP: visualizer website"
# Repo auf github.com anlegen, dann:
git remote add origin https://github.com/DEIN-NAME/voodoo-visualizer.git
git branch -M main
git push -u origin main
```

### Schritt 5 — Auf Vercel deployen
1. Auf vercel.com → **Add New… → Project** → dein GitHub-Repo importieren.
2. Bei **Environment Variables** diese sechs eintragen:

   | Name | Wert |
   |---|---|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | dein `pk_test_…` |
   | `CLERK_SECRET_KEY` | dein `sk_test_…` |
   | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
   | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
   | `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/studio` |
   | `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/studio` |

3. **Deploy** klicken. Nach ~1 Minute ist die Seite live unter `dein-projekt.vercel.app`.

### Schritt 6 — Testen
Auf der Live-URL: Registrieren → E-Mail bestätigen → Login → `/studio` lädt den
Visualizer. Pricing zeigt Premium ausgegraut. Fertig. ✅

---

## Visualizer aktualisieren
Die App liegt als **eine Datei** unter `public/app/index.html`. Neue Version einfach
dort ersetzen, committen, pushen — Vercel deployt automatisch neu.

## Später (nicht Teil des MVP)
- Bezahlung scharf schalten (Merchant of Record + Webhook → Premium-Flag)
- Ad-Gate für Free-User (Render erst nach Ad) + Consent-Banner/CMP
- Impressum, Datenschutz, AGB, Widerruf befüllen
