export type BadgeKind = 'verified' | 'hot' | 'new' | 'plain'

export interface Badge {
  label: string
  kind: BadgeKind
}

export interface Metric {
  label: string
  val: string
  small?: string
  trend?: string
}

export interface Listing {
  id: string
  icon: string
  iconClass: string
  title: string
  category: string
  desc: string
  tech: string[]
  metrics: Metric[]
  seller: { name: string; avatar: string; rating: string }
  price: { num: string; type: string; multiple: string }
  badges: Badge[]
  subtitle: string
  model: string
  highlights: string[]
  financials: Metric[]
  about: string
}

export const listings: Listing[] = [
  {
    id: 'pixelcraft-studio',
    icon: 'P',
    iconClass: 'icon-1',
    title: 'PixelCraft Studio',
    category: 'iOS APP · BILDBEARBEITUNG',
    subtitle: 'KI-Foto-Editor für iOS',
    model: 'One-Time + In-App',
    desc: 'Premium-Foto-Editor mit über 150.000 Downloads. KI-gestützte Filter, abgeschlossene Architektur, sauberer SwiftUI-Code. Inkl. App-Store-Account-Transfer.',
    tech: ['Swift', 'SwiftUI', 'CoreML', 'CloudKit'],
    metrics: [
      { label: 'Downloads', val: '152k' },
      { label: 'Monatl. Umsatz', val: '€2.180', trend: '+12%' },
      { label: 'Alter', val: '3,1', small: 'J.' },
    ],
    seller: { name: 'Marek S.', avatar: 'M', rating: '★ 4.9 · 7 Verkäufe' },
    price: { num: '€32.500', type: 'Komplettverkauf', multiple: '≈ 15× Monatsumsatz' },
    badges: [
      { label: 'Verifiziert', kind: 'verified' },
      { label: 'Hot', kind: 'hot' },
    ],
    highlights: [
      '150k+ Downloads, rein organisch gewachsen',
      'Sauberer, modularer SwiftUI-Code',
      'App-Store-Account-Transfer inklusive',
      'KI-Filter on-device über CoreML',
    ],
    financials: [
      { label: 'Monatl. Umsatz', val: '€2.180', trend: '+12%' },
      { label: 'Downloads', val: '152k' },
      { label: 'Rating', val: '4,8', small: '★' },
      { label: 'Marge', val: '88', small: '%' },
      { label: 'Refund-Rate', val: '1,2', small: '%' },
      { label: 'Code-Audit', val: 'A' },
    ],
    about:
      'PixelCraft Studio ist ein etablierter Premium-Foto-Editor für iOS mit treuer Nutzerbasis und stabilem Umsatz. Die Architektur ist abgeschlossen, vollständig in SwiftUI gehalten und sauber modularisiert — ein neuer Eigentümer kann sofort weiterbauen. Der Verkauf umfasst Source-Code, App-Store-Account-Transfer und eine 30-tägige Übergabebegleitung.',
  },
  {
    id: 'documind-ai',
    icon: 'D',
    iconClass: 'icon-2',
    title: 'DocuMind AI',
    category: 'SAAS · KI / DOKUMENTEN-ANALYSE',
    subtitle: 'B2B-Vertragsanalyse mit KI',
    model: 'SaaS · MRR',
    desc: 'B2B-Plattform für automatische Vertragsanalyse. 38 Enterprise-Kunden, MRR steigt seit 14 Monaten. Verkäufer bietet 4-Wochen-Handover an.',
    tech: ['Next.js', 'Python', 'FastAPI', 'OpenAI', 'Postgres'],
    metrics: [
      { label: 'MRR', val: '€11.400', trend: '+8%' },
      { label: 'Kunden', val: '38' },
      { label: 'Churn', val: '2,1', small: '%' },
    ],
    seller: { name: 'Aydan K.', avatar: 'A', rating: '★ 5.0 · 2 Verkäufe' },
    price: { num: '€164.000', type: 'Firmen-Übernahme', multiple: '≈ 14× MRR' },
    badges: [{ label: 'Verifiziert', kind: 'verified' }],
    highlights: [
      '38 Enterprise-Kunden, 14 Monate MRR-Wachstum',
      '4-Wochen-Handover durch den Gründer',
      'Anwaltlich geprüfte Verträge im Stack',
      'DSGVO-konform, EU-Hosting',
    ],
    financials: [
      { label: 'MRR', val: '€11.400', trend: '+8%' },
      { label: 'ARR', val: '€136.800' },
      { label: 'Kunden', val: '38' },
      { label: 'Churn', val: '2,1', small: '%' },
      { label: 'Brutto-Marge', val: '79', small: '%' },
      { label: 'LTV', val: '€12.4k' },
    ],
    about:
      'DocuMind AI automatisiert die Vertragsanalyse für Mittelstand und Enterprise. Die Plattform wächst seit 14 Monaten verlässlich, hat geringe Churn und einen klaren Upsell-Pfad. Der Gründer bietet eine strukturierte 4-Wochen-Übergabe inklusive Kundengespräche an.',
  },
  {
    id: 'habitcircle',
    icon: 'H',
    iconClass: 'icon-3',
    title: 'HabitCircle',
    category: 'CROSS-PLATFORM · LIFESTYLE',
    subtitle: 'Habit-Tracker, iOS + Android',
    model: 'Freemium',
    desc: 'Habit-Tracker mit Freemium-Modell, läuft auf iOS und Android. 24k aktive Nutzer, organisches Wachstum, kein Marketing-Budget bisher.',
    tech: ['Flutter', 'Firebase', 'RevenueCat'],
    metrics: [
      { label: 'Aktive User', val: '24k' },
      { label: 'Monatl. Umsatz', val: '€720' },
      { label: 'Alter', val: '1,2', small: 'J.' },
    ],
    seller: { name: 'Lena M.', avatar: 'L', rating: '★ 4.7 · 1 Verkauf' },
    price: { num: '€9.800', type: 'Komplettverkauf', multiple: '≈ 13× Monatsumsatz' },
    badges: [{ label: 'Neu', kind: 'new' }],
    highlights: [
      '24k aktive Nutzer, 0 € Marketing-Budget',
      'iOS + Android aus einer Flutter-Codebase',
      'RevenueCat-Abrechnung integriert',
      'Hohes organisches Wachstum',
    ],
    financials: [
      { label: 'Aktive User', val: '24k' },
      { label: 'Monatl. Umsatz', val: '€720' },
      { label: 'Plattform', val: 'iOS+Android' },
      { label: 'Conversion', val: '3,1', small: '%' },
      { label: 'Alter', val: '1,2', small: 'J.' },
      { label: 'Marge', val: '92', small: '%' },
    ],
    about:
      'HabitCircle ist ein wachsender Habit-Tracker mit treuer Community und vollständig organischem Wachstum. Eine einzige Flutter-Codebase bedient iOS und Android. Ideal für einen Käufer, der mit etwas Marketing-Budget skalieren möchte.',
  },
  {
    id: 'vendorvault',
    icon: 'V',
    iconClass: 'icon-4',
    title: 'VendorVault',
    category: 'SAAS · B2B INVENTARVERWALTUNG',
    subtitle: 'Lager-Software für Mittelstand',
    model: 'SaaS · Anteilsverkauf',
    desc: 'Etablierte Lager-Software für Mittelstand. Verkäufer sucht Co-Founder/Investor — bietet 35% Anteile für €67k. Vollständige Übergabe der Tech-Verantwortung möglich.',
    tech: ['Ruby on Rails', 'React', 'Postgres', 'Redis'],
    metrics: [
      { label: 'MRR', val: '€4.890' },
      { label: 'Kunden', val: '61' },
      { label: 'Anteile', val: '35', small: '%' },
    ],
    seller: { name: 'Thomas R.', avatar: 'T', rating: '★ 4.8 · 3 Deals' },
    price: { num: '€67.000', type: 'Für 35% Anteile', multiple: 'Bewertung ≈ €191k' },
    badges: [
      { label: 'Verifiziert', kind: 'verified' },
      { label: 'Anteile', kind: 'plain' },
    ],
    highlights: [
      '35 % Anteile + technische Verantwortung',
      '61 Mittelstands-Kunden, stabile Basis',
      'Gründer sucht Co-Founder / Investor',
      'Rails + React, gut dokumentiert',
    ],
    financials: [
      { label: 'MRR', val: '€4.890' },
      { label: 'ARR', val: '€58.680' },
      { label: 'Kunden', val: '61' },
      { label: 'Anteile', val: '35', small: '%' },
      { label: 'Bewertung', val: '€191k' },
      { label: 'Churn', val: '1,8', small: '%' },
    ],
    about:
      'VendorVault ist eine etablierte Inventar- und Lagerlösung für den Mittelstand. Der Gründer sucht keinen reinen Exit, sondern einen technischen Co-Founder oder Investor und bietet 35 % Anteile. Die technische Verantwortung kann vollständig übergeben werden.',
  },
  {
    id: 'codereview-bot',
    icon: 'C',
    iconClass: 'icon-5',
    title: 'CodeReview Bot',
    category: 'DEV-TOOL · GITHUB-INTEGRATION',
    subtitle: 'Automatisierte Code-Reviews',
    model: 'SaaS · MRR',
    desc: 'GitHub-App für automatisierte Code-Reviews mit GPT-Backend. 320 zahlende Teams, vollständige Dokumentation, sauberer Test-Coverage.',
    tech: ['Node.js', 'TypeScript', 'GitHub API', 'OpenAI'],
    metrics: [
      { label: 'Teams', val: '320' },
      { label: 'MRR', val: '€1.620', trend: '+4%' },
      { label: 'Margin', val: '71', small: '%' },
    ],
    seller: { name: 'Niko F.', avatar: 'N', rating: '★ 4.9 · 5 Verkäufe' },
    price: { num: '€18.400', type: 'Komplettverkauf', multiple: '≈ 11× MRR' },
    badges: [{ label: 'Verifiziert', kind: 'verified' }],
    highlights: [
      '320 zahlende Teams',
      'Vollständige Tests & Dokumentation',
      'GitHub-Marketplace-Listing aktiv',
      'GPT-Backend, schlanke Infrastruktur',
    ],
    financials: [
      { label: 'MRR', val: '€1.620', trend: '+4%' },
      { label: 'ARR', val: '€19.440' },
      { label: 'Teams', val: '320' },
      { label: 'Marge', val: '71', small: '%' },
      { label: 'Churn', val: '3,4', small: '%' },
      { label: 'Alter', val: '2,0', small: 'J.' },
    ],
    about:
      'CodeReview Bot bringt automatisierte, GPT-gestützte Code-Reviews direkt in den GitHub-Workflow. 320 zahlende Teams, schlanke Infrastruktur und ein aktives Marketplace-Listing sorgen für planbare, margenstarke Umsätze.',
  },
  {
    id: 'rhythmica',
    icon: 'R',
    iconClass: 'icon-6',
    title: 'Rhythmica',
    category: 'iOS APP · MUSIK / SPIEL',
    subtitle: 'Indie-Rhythm-Spiel',
    model: 'In-App Käufe',
    desc: 'Indie-Rhythm-Spiel mit eigener Engine. 89k Downloads, Featured-Spot im App-Store, starkes Review-Profil. Source-Code in Swift mit Metal.',
    tech: ['Swift', 'Metal', 'AudioKit'],
    metrics: [
      { label: 'Downloads', val: '89k' },
      { label: 'In-App / Monat', val: '€1.420' },
      { label: 'Rating', val: '4,8', small: '★' },
    ],
    seller: { name: 'Sasha B.', avatar: 'S', rating: '★ 4.6 · 2 Verkäufe' },
    price: { num: '€24.000', type: 'Komplettverkauf', multiple: '≈ 17× Monatsumsatz' },
    badges: [{ label: 'Hot', kind: 'hot' }],
    highlights: [
      '89k Downloads, App-Store-Featured',
      'Eigene Metal-Rendering-Engine',
      'Starkes Review-Profil (4,8 ★)',
      'Source in Swift + AudioKit',
    ],
    financials: [
      { label: 'Downloads', val: '89k' },
      { label: 'In-App / Monat', val: '€1.420' },
      { label: 'Rating', val: '4,8', small: '★' },
      { label: 'Marge', val: '90', small: '%' },
      { label: 'Featured', val: '✓' },
      { label: 'Engine', val: 'Eigen' },
    ],
    about:
      'Rhythmica ist ein handgemachtes Indie-Rhythm-Spiel mit eigener Metal-Engine und einem App-Store-Featured-Spot in der Historie. Das starke Review-Profil und die treue Spielerbasis machen es zu einer attraktiven Übernahme für Studios oder Solo-Entwickler.',
  },
]

export function getListing(id: string | undefined): Listing | undefined {
  return listings.find((l) => l.id === id)
}
