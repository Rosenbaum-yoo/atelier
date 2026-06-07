// Trust Center legal drafts (DE). Owner data lives in [Klammern]; every doc is a
// DRAFT pending lawyer sign-off (draft: true → visible banner). Rendered by
// src/components/LegalPage.tsx and indexed on the /recht hub (src/pages/Trust.tsx).

export type LegalSection = { heading: string; paras?: string[]; bullets?: string[] }

export type LegalDoc = {
  slug: string
  eyebrow: string
  title: string
  summary: string
  updated: string
  draft: boolean
  intro: string
  sections: LegalSection[]
}

const impressum: LegalDoc = {
  slug: 'impressum',
  eyebrow: 'RECHTLICHES',
  title: 'Impressum',
  summary: 'Anbieterkennzeichnung nach § 5 DDG und § 18 MStV.',
  updated: 'Stand: Juni 2026',
  draft: true,
  intro: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV).',
  sections: [
    { heading: 'Diensteanbieter', paras: [
      '[Firmenname / Rechtsform — z. B. Atelier Marketplace GmbH]',
      '[Straße und Hausnummer]',
      '[PLZ und Ort]',
      '[Land]',
    ] },
    { heading: 'Vertreten durch', paras: [
      '[Name der vertretungsberechtigten Person(en) — z. B. Geschäftsführer/in]',
    ] },
    { heading: 'Kontakt', paras: [
      'E-Mail: [kontakt@deine-domain.de]',
      'Telefon: [optional]',
    ] },
    { heading: 'Registereintrag', paras: [
      'Eintragung im Handelsregister (sofern zutreffend).',
      'Registergericht: [z. B. Amtsgericht Düsseldorf]',
      'Registernummer: [HRB …]',
    ] },
    { heading: 'Umsatzsteuer-Identifikationsnummer', paras: [
      'USt-IdNr. gemäß § 27a Umsatzsteuergesetz: [DE…] (sofern vorhanden).',
    ] },
    { heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV', paras: [
      '[Name, Anschrift wie oben]',
    ] },
    { heading: 'EU-Streitschlichtung', paras: [
      'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/',
      'Unsere E-Mail-Adresse findest du oben.',
    ] },
    { heading: 'Verbraucherstreitbeilegung', paras: [
      'Wir sind nicht verpflichtet und grundsätzlich nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    ] },
    { heading: 'Haftung für Inhalte und Links', paras: [
      'Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Für Inhalte externer Links ist der jeweilige Anbieter verantwortlich; bei Bekanntwerden von Rechtsverletzungen entfernen wir solche Links umgehend.',
    ] },
  ],
}

const datenschutz: LegalDoc = {
  slug: 'datenschutz',
  eyebrow: 'DATENSCHUTZ',
  title: 'Datenschutzerklärung',
  summary: 'Wie wir personenbezogene Daten nach DSGVO verarbeiten.',
  updated: 'Stand: Juni 2026',
  draft: true,
  intro: 'Wir verarbeiten personenbezogene Daten nach der Datenschutz-Grundverordnung (DSGVO) und dem BDSG. Diese Erklärung informiert über Art, Umfang und Zweck der Verarbeitung.',
  sections: [
    { heading: 'Verantwortlicher', paras: [
      '[Firmenname], [Anschrift], E-Mail: [kontakt@deine-domain.de].',
    ] },
    { heading: 'Hosting (Cloudflare)', paras: [
      'Unsere Website wird über Cloudflare Pages bereitgestellt. Beim Aufruf verarbeitet Cloudflare technisch notwendige Server-Logdaten (u. a. IP-Adresse, Zeitpunkt, abgerufene Ressource, User-Agent) zur sicheren und stabilen Auslieferung. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Es besteht ein Auftragsverarbeitungsvertrag.',
    ] },
    { heading: 'Konten & Datenbank (Supabase)', paras: [
      'Konten, Profile, Listings und Deals werden bei Supabase in einem Rechenzentrum in Frankfurt (EU) gespeichert. Bei der Registrierung verarbeiten wir E-Mail-Adresse, Anzeigename und Authentifizierungsdaten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).',
    ] },
    { heading: 'Zahlungen (Stripe)', paras: [
      'Zahlungen werden über Stripe (Stripe Payments Europe Ltd.) abgewickelt. Zahlungs- und Identifizierungsdaten werden direkt von Stripe verarbeitet — wir speichern keine Kartendaten. Auszahlungen an Verkäufer erfolgen über Stripe Connect. Rechtsgrundlage: Art. 6 Abs. 1 lit. b und lit. c DSGVO.',
    ] },
    { heading: 'E-Mail-Versand (Resend)', paras: [
      'Transaktions-E-Mails (z. B. Registrierungsbestätigung, Benachrichtigungen zu Angeboten und Deals) versenden wir über Resend. Verarbeitet werden E-Mail-Adresse und Nachrichteninhalt. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.',
    ] },
    { heading: 'Cookies & lokale Speicherung', paras: [
      'Wir setzen ausschließlich technisch notwendige lokale Speicher ein (z. B. ein Sitzungs-Token, um dich angemeldet zu halten). Es werden keine Tracking- oder Marketing-Cookies ohne deine Einwilligung gesetzt.',
    ] },
    { heading: 'Deine Rechte', paras: [
      'Dir stehen nach DSGVO insbesondere folgende Rechte zu:',
    ], bullets: [
      'Auskunft über die zu dir gespeicherten Daten (Art. 15)',
      'Berichtigung unrichtiger Daten (Art. 16)',
      'Löschung (Art. 17) und Einschränkung der Verarbeitung (Art. 18)',
      'Datenübertragbarkeit (Art. 20)',
      'Widerspruch gegen die Verarbeitung (Art. 21)',
      'Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3)',
    ] },
    { heading: 'Beschwerderecht', paras: [
      'Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung deiner Daten zu beschweren.',
    ] },
    { heading: 'Speicherdauer', paras: [
      'Wir speichern personenbezogene Daten nur so lange, wie es für die genannten Zwecke oder aufgrund gesetzlicher Aufbewahrungsfristen (z. B. handels- und steuerrechtlich) erforderlich ist.',
    ] },
    { heading: 'TLS-Verschlüsselung', paras: [
      'Diese Seite nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung der Übertragung.',
    ] },
  ],
}

const agb: LegalDoc = {
  slug: 'agb',
  eyebrow: 'NUTZUNGSBEDINGUNGEN',
  title: 'Allgemeine Geschäftsbedingungen',
  summary: 'Die Regeln für die Nutzung des Atelier-Marktplatzes.',
  updated: 'Stand: Juni 2026',
  draft: true,
  intro: 'Diese AGB regeln die Nutzung der Plattform Atelier zwischen dem Betreiber und den Nutzern (Käufer und Verkäufer).',
  sections: [
    { heading: '§ 1 Geltungsbereich', paras: [
      'Diese AGB gelten für die Nutzung der Plattform Atelier („Plattform"), betrieben durch [Firmenname]. Abweichende Bedingungen der Nutzer finden keine Anwendung, sofern wir ihnen nicht ausdrücklich zustimmen.',
    ] },
    { heading: '§ 2 Rolle der Plattform', paras: [
      'Atelier ist ein kuratierter Marktplatz, der Käufer und Verkäufer digitaler Vermögenswerte (Software, Apps, Unternehmen, Beteiligungen) zusammenbringt und die Zahlung treuhänderisch unterstützt. Kaufverträge über gelistete Vermögenswerte kommen ausschließlich zwischen Käufer und Verkäufer zustande. Atelier wird nicht Vertragspartei dieser Kaufverträge.',
    ] },
    { heading: '§ 3 Registrierung & Konto', paras: [
      'Die Nutzung der Kauf- und Verkaufsfunktionen setzt ein Konto voraus. Deine Angaben müssen wahrheitsgemäß und aktuell sein. Zugangsdaten sind vertraulich zu behandeln.',
    ] },
    { heading: '§ 4 Angebote (Listings)', paras: [
      'Verkäufer sind für die Richtigkeit und Vollständigkeit ihrer Angebote verantwortlich. Atelier darf Angebote prüfen, ablehnen oder entfernen, die gegen diese AGB oder geltendes Recht verstoßen.',
    ] },
    { heading: '§ 5 Deal-Ablauf & Treuhand', paras: [
      'Käufer geben über den Dealroom verbindliche Angebote ab. Nimmt der Verkäufer an, zahlt der Käufer den vereinbarten Betrag. Dieser wird über unseren Zahlungsdienstleister Stripe treuhänderisch gehalten (Hold). Die Auszahlung an den Verkäufer — abzüglich Provision — erfolgt erst, wenn der Käufer den Erhalt bzw. die Übertragung des Vermögenswerts bestätigt (Release).',
    ] },
    { heading: '§ 6 Provision & Tarife', paras: [
      'Das Einstellen von Angeboten ist kostenlos. Bei erfolgreichem Abschluss erhebt Atelier eine Provision auf den Kaufpreis (Tarif Start: 6 %). Optionale Tarife (Pro, Individuell) können abweichende Provisionssätze und Leistungen vorsehen. Die jeweils gültigen Konditionen werden vor Abschluss angezeigt.',
    ] },
    { heading: '§ 7 Pflichten des Verkäufers', paras: [
      'Der Verkäufer sichert zu, zur Übertragung des Vermögenswerts berechtigt zu sein, und überträgt diesen nach Zahlungseingang vollständig und frei von Rechten Dritter.',
    ] },
    { heading: '§ 8 Pflichten des Käufers', paras: [
      'Der Käufer bestätigt den Erhalt unverzüglich nach vollständiger Übertragung. Eine treuwidrige Verweigerung der Bestätigung ist unzulässig.',
    ] },
    { heading: '§ 9 Haftung', paras: [
      'Atelier haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie nach dem Produkthaftungsgesetz. Bei einfacher Fahrlässigkeit haftet Atelier nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Für die Erfüllung der zwischen Käufer und Verkäufer geschlossenen Kaufverträge haftet Atelier nicht.',
    ] },
    { heading: '§ 10 Laufzeit & Kündigung', paras: [
      'Nutzer können ihr Konto jederzeit kündigen. Atelier kann das Nutzungsverhältnis mit angemessener Frist oder bei Verstößen außerordentlich beenden.',
    ] },
    { heading: '§ 11 Schlussbestimmungen', paras: [
      'Es gilt deutsches Recht. Ist der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz des Betreibers. Sollten einzelne Bestimmungen unwirksam sein, bleibt der übrige Vertrag wirksam.',
    ] },
  ],
}

const widerruf: LegalDoc = {
  slug: 'widerruf',
  eyebrow: 'VERBRAUCHER',
  title: 'Widerrufsbelehrung',
  summary: 'Widerrufsrecht für Verbraucher (B2C) und Muster-Formular.',
  updated: 'Stand: Juni 2026',
  draft: true,
  intro: 'Diese Belehrung gilt für Verbraucher im Sinne des § 13 BGB. Für Unternehmer (B2B) besteht kein gesetzliches Widerrufsrecht.',
  sections: [
    { heading: 'Widerrufsrecht', paras: [
      'Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen den Vertrag über die kostenpflichtigen Plattformleistungen von Atelier zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.',
    ] },
    { heading: 'Ausübung des Widerrufs', paras: [
      'Um dein Widerrufsrecht auszuüben, musst du uns ([Firmenname, Anschrift, E-Mail]) mittels einer eindeutigen Erklärung (z. B. per E-Mail) über deinen Entschluss informieren. Du kannst dafür das untenstehende Muster-Widerrufsformular verwenden, das ist aber nicht vorgeschrieben.',
    ] },
    { heading: 'Folgen des Widerrufs', paras: [
      'Wenn du diesen Vertrag widerrufst, erstatten wir dir alle erhaltenen Zahlungen unverzüglich und spätestens binnen vierzehn Tagen ab Zugang deiner Widerrufsmitteilung zurück.',
    ] },
    { heading: 'Vorzeitiges Erlöschen', paras: [
      'Das Widerrufsrecht erlischt bei Verträgen über digitale Inhalte und bei Dienstleistungen vorzeitig, wenn wir mit der Ausführung mit deiner ausdrücklichen Zustimmung begonnen haben und du deine Kenntnis vom Erlöschen des Widerrufsrechts bestätigt hast.',
    ] },
    { heading: 'Hinweis zu Marktplatz-Transaktionen', paras: [
      'Kaufverträge über gelistete Vermögenswerte kommen zwischen Käufer und Verkäufer zustande. Ein etwaiges Widerrufsrecht für diese Verträge richtet sich nach dem jeweiligen Vertrag und der Eigenschaft der Vertragsparteien.',
    ] },
    { heading: 'Muster-Widerrufsformular', paras: [
      '(Wenn du den Vertrag widerrufen willst, fülle dieses Formular aus und sende es zurück.)',
      'An: [Firmenname, Anschrift, E-Mail]',
      'Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über die folgende Dienstleistung: …',
      'Bestellt am / erhalten am: …',
      'Name des/der Verbraucher(s): …',
      'Anschrift des/der Verbraucher(s): …',
      'Datum: …',
    ] },
  ],
}

export const LEGAL_DOCS: LegalDoc[] = [impressum, agb, datenschutz, widerruf]

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug)
}
