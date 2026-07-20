/**
 * Page copy that is structured rather than prose. Kept out of the section
 * components so the argument the page makes can be read and revised in one
 * place, without navigating JSX.
 */

export const STEPS = [
  {
    index: '01',
    label: 'Collect',
    title: 'Every channel, one stream',
    body: 'Tickets, reviews, call transcripts, community threads and survey responses arrive as they happen. No manual tagging, no channel anyone forgot to check.',
  },
  {
    index: '02',
    label: 'Cluster',
    title: 'Duplicates merge before you see them',
    body: 'Related mentions are grouped into a single theme, across channels and across phrasings. Forty people describing the same bug three different ways become one item, not forty.',
  },
  {
    index: '03',
    label: 'Decide',
    title: 'Ranked by what it costs you',
    body: 'Themes are scored on affected revenue, account tier and trajectory — then cut down to the few worth acting on this week. Everything else stays searchable, not surfaced.',
  },
] as const

export const COMPARISON = [
  { metric: 'Time to first answer', manual: '3–5 days', trevio: 'Under 5 minutes', note: 'From connected source to first ranked theme' },
  { metric: 'Channels actually read', manual: '2 of 9', trevio: 'All 9', note: 'Most teams read tickets and reviews, and nothing else' },
  { metric: 'Duplicate reports merged', manual: 'By hand, partially', trevio: 'Automatic', note: 'Across channels and phrasings' },
  { metric: 'Evidence behind a claim', manual: 'Rebuilt from memory', trevio: 'Attached to every insight', note: 'One click to the source conversation' },
  { metric: 'Refresh cadence', manual: 'Quarterly, if ever', trevio: 'Continuous', note: 'Themes re-rank as new feedback lands' },
] as const

export const ICP = {
  fits: [
    { title: 'B2B SaaS, 20–500 people', body: 'Enough customers that reading everything stopped being possible, not so many that you have a dedicated research team.' },
    { title: 'Series A to C', body: 'Roadmap decisions carry real money, and getting one wrong costs a quarter.' },
    { title: 'Feedback in five or more places', body: 'The value is proportional to how scattered you already are.' },
  ],
  misfits: [
    'Pre-launch, with fewer than a hundred conversations to date',
    'Teams that need ticket workflow and sprint tracking — that is a different tool',
    'Anyone wanting a public feature-voting board',
  ],
} as const

/**
 * Deliberately not a three-tier price table. Invented numbers are the first
 * thing an investor or a design partner pushes on — "where did $149 come
 * from?" has no answer before a single team has used the product, and not
 * having one in the room costs more than the tidiness of a price grid buys.
 * What can be defended today is the pricing *model* and the pilot terms.
 */
export const PILOT = {
  slots: 10,
  headline: 'Free for the first 10 design partners',
  body: 'Full product, every source connected, no card. In exchange: a weekly half-hour of your honest reaction, and permission to write up the result if it works.',
  gives: [
    'Every channel connected, no volume cap during the pilot',
    'Insights reviewed with you weekly, not thrown over a wall',
    'Your export, your data, whenever you want out',
  ],
  asks: [
    'Thirty minutes a week of real feedback',
    'At least three feedback sources worth reading',
    'Someone on the team who owns roadmap decisions',
  ],
} as const

export const PRICING_MODEL = {
  charges: [
    { label: 'Connected sources', note: 'More channels is more value and more cost to run' },
    { label: 'Monthly feedback volume', note: 'The thing that actually drives our compute bill' },
    { label: 'Enterprise controls', note: 'SSO, audit log, private model deployment' },
  ],
  never: [
    { label: 'Per seat', note: 'Charging by reader on a tool whose value grows with readership argues with the product' },
    { label: 'Per insight', note: 'That would reward us for surfacing more, when the job is surfacing less' },
  ],
} as const

export const FAQ = [
  {
    q: 'How is this different from a feedback board like Canny?',
    a: 'A board asks your customers to come to you, log in, and vote. Most never will, so a board measures the opinions of the few who show up. Trevio reads what customers already said, in the places they already said it, and does the grouping and ranking itself.',
  },
  {
    q: 'There are other AI feedback tools now. Why this one?',
    a: 'Most of the category summarises: it reads your feedback and gives you a tidier version of it back, and you still do the deciding. Two things are different here. Nothing renders without the conversations that produced it attached, so a claim can be checked in the same breath it is read. And the goal is that you open the tool less, not more — if you find yourself browsing, we have failed at the part that matters.',
  },
  {
    q: 'What stage are you at, honestly?',
    a: 'Pre-launch. Every figure on this page comes from a fictional workspace and is labelled as such, because inventing traction would undermine the one thing this product sells. What exists is the pipeline, the output format you can see above, and ten pilot slots.',
  },
  {
    q: 'Can I trust what the AI concludes?',
    a: 'Only as far as it shows its work, which is why no insight renders without its evidence attached. Every claim carries the sample size, the time window, and the source conversations behind it. If you disagree with a conclusion, you can see exactly what produced it.',
  },
  {
    q: 'What if our feedback is mostly in call recordings?',
    a: 'Transcripts are treated as a first-class source, not an afterthought. Sales and success calls are usually where the most expensive feedback lives, and they are almost always the least-read channel.',
  },
  {
    q: 'How long until it is useful?',
    a: 'Connect one source and the first themes appear in minutes, because Trevio reads your history, not just what arrives from today onward. Accuracy improves as more channels come in.',
  },
  {
    q: 'Where does our data go?',
    a: 'Your feedback is processed in your own workspace and is never used to train shared models. Enterprise plans can run the model in your own cloud.',
  },
] as const
