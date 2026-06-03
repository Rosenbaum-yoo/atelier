// Generates supabase/seed.sql from the single source of truth src/data/listings.ts.
// No hand-typed data — esbuild strips the TS types, we import the module, emit SQL.
// Run: node scripts/gen-seed.mjs
import { readFile, writeFile } from 'node:fs/promises'
import { transform } from 'esbuild'

const root = new URL('../', import.meta.url)
const src = await readFile(new URL('src/data/listings.ts', root), 'utf8')
const { code } = await transform(src, { loader: 'ts', format: 'esm' })
const mod = await import(
  'data:text/javascript;charset=utf-8;base64,' + Buffer.from(code, 'utf8').toString('base64')
)
const listings = mod.listings

const ORG = '00000000-0000-0000-0000-000000000001'
const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const jb = (o) => `'${JSON.stringify(o).replace(/'/g, "''")}'::jsonb`

const cols = [
  'org_id', 'slug', 'status', 'title', 'category', 'subtitle', 'description', 'model', 'about',
  'icon', 'icon_class', 'price_num', 'price_type', 'price_multiple',
  'kind', 'revenue_model', 'sale_type', 'monthly_revenue', 'price_value', 'listed_at', 'data',
]

const values = listings.map((l) => {
  const data = {
    tech: l.tech, metrics: l.metrics, highlights: l.highlights,
    financials: l.financials, seller: l.seller, badges: l.badges,
    ...(l.equity ? { equity: l.equity } : {}),
  }
  return '  (' + [
    `'${ORG}'`, q(l.id), `'published'`, q(l.title), q(l.category), q(l.subtitle), q(l.desc),
    q(l.model), q(l.about), q(l.icon), q(l.iconClass), q(l.price.num), q(l.price.type),
    q(l.price.multiple), q(l.kind), q(l.revenueModel), q(l.saleType),
    String(l.monthlyRevenue), String(l.priceValue), q(l.listedAt), jb(data),
  ].join(', ') + ')'
})

const upsert = cols
  .filter((c) => c !== 'slug')
  .map((c) => `${c} = excluded.${c}`)
  .join(', ')

const sql = `-- seed.sql — GENERATED from src/data/listings.ts. Do not edit by hand.
-- Regenerate: node scripts/gen-seed.mjs
-- Idempotent & self-healing: re-running overwrites the seed rows from the
-- single source of truth (on conflict do update), so encoding/content drift
-- in the seeded rows is corrected on every apply.

insert into public.orgs (id, name, slug)
values ('${ORG}', 'Atelier', 'atelier')
on conflict (id) do nothing;

insert into public.listings (${cols.join(', ')})
values
${values.join(',\n')}
on conflict (slug) do update set
  ${upsert};
`

await writeFile(new URL('supabase/seed.sql', root), sql, 'utf8')
console.log(`wrote supabase/seed.sql (${listings.length} listings)`)
