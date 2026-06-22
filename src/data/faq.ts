export type FaqItem = { q: string; a: string; open?: boolean }
export type FaqGroup = { group: string; items: FaqItem[] }

export const faqGroups: FaqGroup[] = [
  {
    group: 'Käufer',
    items: [
      {
        q: 'Ist mein Geld während des Kaufs sicher?',
        a: 'Ja. Dein Kaufpreis fließt nicht direkt an den Verkäufer, sondern in die Treuhand. Erst wenn alle Assets — Code, Lizenzen, Accounts — übergeben sind und du den Erhalt bestätigst, wird das Geld freigegeben.',
        open: true,
      },
      {
        q: 'Was passiert, wenn der Transfer scheitert?',
        a: 'Solange du den Erhalt nicht bestätigst, bleibt der Betrag in Treuhand. Kommt kein sauberer Transfer zustande, wird die Zahlung erstattet — du gehst nie in Vorleistung.',
      },
      {
        q: 'Was wird vor einem Listing geprüft?',
        a: 'Wir validieren Umsätze über Stripe-, Paddle- und App-Store-Daten, sichten Code-Qualität und Architektur und dokumentieren den Tech-Stack. Jedes Listing durchläuft ein internes Review, bevor es online geht.',
      },
    ],
  },
  {
    group: 'Verkäufer',
    items: [
      {
        q: 'Was kostet mich der Verkauf?',
        a: 'Das Einstellen ist kostenlos. Eine Provision von 6 % fällt ausschließlich bei einem erfolgreichen Verkauf an — abgezogen erst bei der Auszahlung.',
      },
      {
        q: 'Kann ich anonym verkaufen?',
        a: 'Ja. Du kannst dein Projekt als Blind Listing einstellen — sensible Details werden erst nach unterzeichnetem NDA an verifizierte Käufer freigegeben.',
      },
      {
        q: 'Muss ich mein ganzes Projekt abgeben?',
        a: 'Nein. Neben dem Komplettverkauf sind Anteilsverkauf, Earn-Out und Sponsoring-Modelle möglich.',
      },
    ],
  },
  {
    group: 'Sicherheit & Recht',
    items: [
      {
        q: 'Wie ist das mit Steuern?',
        a: 'Atelier wickelt die Zahlung und Provision ab und stellt entsprechende Belege bereit. Die steuerliche Behandlung des Verkaufserlöses liegt bei dir bzw. deiner Steuerberatung — wir empfehlen, sie früh einzubinden.',
      },
      {
        q: 'Wie funktioniert der Verkauf einer GmbH oder von Anteilen?',
        a: 'Firmenanteile sind notariell zu übertragen (§ 15 GmbHG). Bei solchen Deals begleiten wir die notarielle Übertragung — die Treuhand wird erst nach beurkundeter Übertragung freigegeben, nicht per Klick. Diese Deals laufen über den Individuell-Pfad.',
      },
      {
        q: 'Ist Atelier ein Anlage- oder Investmentangebot?',
        a: 'Nein. Atelier ist eine Inserats-, Kontakt- und Dealroom-Plattform. Wir vermitteln Projekte und sichern die Abwicklung ab — wir beraten nicht zu Investments und garantieren keine Bewertungen.',
      },
    ],
  },
]
