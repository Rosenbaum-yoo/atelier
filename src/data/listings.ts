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

export type ListingKind = 'saas' | 'ios' | 'android' | 'web' | 'devtool' | 'game' | 'ai'
export type RevenueModel = 'mrr' | 'onetime' | 'iap' | 'ads'
export type SaleType = 'full' | 'shares' | 'license'

export const kindLabels: Record<ListingKind, string> = {
  saas: 'SaaS',
  ios: 'Mobile App (iOS)',
  android: 'Mobile App (Android)',
  web: 'Web-App',
  devtool: 'Dev-Tool / CLI',
  game: 'Spiel',
  ai: 'KI / ML',
}

export const revenueModelLabels: Record<RevenueModel, string> = {
  mrr: 'Mit MRR',
  onetime: 'One-Time Sales',
  iap: 'In-App Käufe',
  ads: 'Ad-finanziert',
}

export const saleTypeLabels: Record<SaleType, string> = {
  full: 'Komplettverkauf',
  shares: 'Anteile / Sponsoring',
  license: 'Lizenz-Übertragung',
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
  kind: ListingKind
  revenueModel: RevenueModel
  saleType: SaleType
  monthlyRevenue: number
  priceValue: number
  listedAt: string
  equity?: { percent: number; valuation: string }
  status?: 'draft' | 'published' | 'archived' | 'sold'
  // Server-abgeleitete Trust-Flags (aus org_entitlements via listings_public-View).
  // NIE vom Client geschrieben. Optional → statische Seed-Daten = nicht verifiziert.
  sellerVerified?: boolean
  revenueVerified?: boolean
}

export const listings: Listing[] = [
  {
    id: 'pixelcraft-studio',
    kind: 'ios',
    revenueModel: 'onetime',
    saleType: 'full',
    monthlyRevenue: 2180,
    priceValue: 32500,
    listedAt: '2026-05-12',
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
    kind: 'ai',
    revenueModel: 'mrr',
    saleType: 'full',
    monthlyRevenue: 11400,
    priceValue: 164000,
    listedAt: '2026-05-20',
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
    kind: 'android',
    revenueModel: 'iap',
    saleType: 'full',
    monthlyRevenue: 720,
    priceValue: 9800,
    listedAt: '2026-05-25',
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
    kind: 'saas',
    revenueModel: 'mrr',
    saleType: 'shares',
    monthlyRevenue: 4890,
    priceValue: 67000,
    listedAt: '2026-05-18',
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
    kind: 'devtool',
    revenueModel: 'mrr',
    saleType: 'full',
    monthlyRevenue: 1620,
    priceValue: 18400,
    listedAt: '2026-05-08',
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
    kind: 'game',
    revenueModel: 'iap',
    saleType: 'full',
    monthlyRevenue: 1420,
    priceValue: 24000,
    listedAt: '2026-05-15',
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
  {
    id: 'lumen-analytics',
    kind: 'web',
    revenueModel: 'mrr',
    saleType: 'shares',
    monthlyRevenue: 21500,
    priceValue: 240000,
    listedAt: '2026-05-30',
    equity: { percent: 20, valuation: '€1,2 Mio.' },
    icon: 'L',
    iconClass: 'icon-2',
    title: 'Lumen Analytics GmbH',
    category: 'GMBH-BETEILIGUNG · WEB-ANALYTICS',
    subtitle: 'Profitable Analytics-SaaS als GmbH',
    model: 'GmbH · Anteilsverkauf',
    desc: 'Etablierte, profitable Web-Analytics-SaaS als GmbH. Die Gesellschafterin bietet 20% Anteile für €240k zur Wachstumsfinanzierung. Notarielle Anteilsübertragung, sauberer Cap-Table.',
    tech: ['Vue', 'Nuxt', 'ClickHouse', 'Go'],
    metrics: [
      { label: 'MRR', val: '€21.500', trend: '+6%' },
      { label: 'Anteil', val: '20', small: '%' },
      { label: 'Bewertung', val: '€1,2M' },
    ],
    seller: { name: 'Katrin V.', avatar: 'K', rating: '★ 5.0 · 4 Deals' },
    price: { num: '€240.000', type: 'Für 20% Anteile', multiple: 'Pre-Money ≈ €1,2 Mio.' },
    badges: [
      { label: 'Verifiziert', kind: 'verified' },
      { label: 'Invest', kind: 'plain' },
    ],
    highlights: [
      '20% GmbH-Anteile, notariell übertragen',
      'Profitabel: €258k ARR, < 2% Churn',
      'Sauberer Cap-Table, eine Gesellschafterin',
      'Wachstumskapital für Vertrieb & Team',
    ],
    financials: [
      { label: 'MRR', val: '€21.500', trend: '+6%' },
      { label: 'ARR', val: '€258.000' },
      { label: 'Anteil', val: '20', small: '%' },
      { label: 'Pre-Money', val: '€1,2M' },
      { label: 'Churn', val: '1,6', small: '%' },
      { label: 'EBITDA-Marge', val: '34', small: '%' },
    ],
    about:
      'Lumen Analytics GmbH betreibt eine datenschutzfreundliche Web-Analytics-Plattform mit treuer B2B-Kundschaft und planbar wiederkehrenden Umsätzen. Statt eines Exits sucht die Gründerin eine strategische Beteiligung: 20% der Gesellschaftsanteile werden notariell übertragen, das Kapital fließt in Vertrieb und Teamaufbau. Geprüfte Jahresabschlüsse und ein sauberer Cap-Table liegen für die Due Diligence bereit.',
  },
]

export function getListing(id: string | undefined): Listing | undefined {
  return listings.find((l) => l.id === id)
}
