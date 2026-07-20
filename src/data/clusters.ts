/**
 * The six themes the scenario's 2,847 messages collapse into, and the three
 * insights that survive prioritisation. Everything downstream — the scene's
 * cluster targets, the counter, the output section — reads from here.
 *
 * `weight` is the share of total volume; the six sum to 0.71, and the
 * remaining 29% is the long tail that never forms a theme. That gap is
 * deliberate and stated on the page: a tool that claims to cluster 100% of
 * inbound feedback into six neat buckets is lying.
 */

export interface Cluster {
  id: string
  label: string
  weight: number
  sentiment: 'negative' | 'neutral' | 'positive'
  /** Whether this theme made the cut into a shipped insight. */
  promoted: boolean
}

export const CLUSTERS: Cluster[] = [
  { id: 'checkout', label: 'Mobile checkout failures', weight: 0.17, sentiment: 'negative', promoted: true },
  { id: 'export', label: 'Cannot find data export', weight: 0.14, sentiment: 'negative', promoted: true },
  { id: 'onboarding', label: 'Onboarding drop-off', weight: 0.13, sentiment: 'negative', promoted: true },
  { id: 'pricing', label: 'Pricing tier confusion', weight: 0.11, sentiment: 'neutral', promoted: false },
  { id: 'sso', label: 'SSO / SAML requests', weight: 0.09, sentiment: 'neutral', promoted: false },
  { id: 'speed', label: 'Praise for report speed', weight: 0.07, sentiment: 'positive', promoted: false },
]

export const LONG_TAIL_SHARE = 1 - CLUSTERS.reduce((sum, c) => sum + c.weight, 0)

export interface Insight {
  id: string
  title: string
  scope: string
  summary: string
  impact: { value: string; label: string }[]
  evidence: { name: string; quote: string; source: string }[]
}

export const INSIGHTS: Insight[] = [
  {
    id: 'checkout',
    title: 'Mobile checkout is failing for Enterprise accounts on saved cards',
    scope: '34 conversations · 19 customers · last 14 days',
    summary:
      'Enterprise customers on iOS are hitting a payment-confirmation timeout during checkout, most consistently the first time a saved card is used. The pattern begins the day after the 4.2 release and has grown 3.2× since. Three of the accounts affected renew within the quarter.',
    impact: [
      { value: '$84.2K', label: 'ARR at risk' },
      { value: '12', label: 'Enterprise accounts' },
      { value: '3.2×', label: 'vs. last month' },
    ],
    evidence: [
      {
        name: 'MK',
        quote: 'Checkout just spins and then logs me out. Tried three times.',
        source: 'Zendesk · Acme Corp',
      },
      {
        name: 'RT',
        quote: 'Payment confirmation never loads on my saved card.',
        source: 'Intercom · Northwind',
      },
      {
        name: 'JL',
        quote: 'Had to switch to a new card mid-checkout to get it to go through.',
        source: 'Sales call · Vantage',
      },
    ],
  },
  {
    id: 'export',
    title: '27% of Enterprise customers cannot find data export',
    scope: '61 conversations · 44 customers · last 30 days',
    summary:
      'Export exists and works, but it lives three levels deep in workspace settings. Customers consistently describe it as missing rather than hard to find, which means the feature is failing at discovery, not at execution. Two churned accounts cited it as a reason.',
    impact: [
      { value: '27%', label: 'of Enterprise accounts' },
      { value: '61', label: 'conversations' },
      { value: '2', label: 'churn citations' },
    ],
    evidence: [
      {
        name: 'DS',
        quote: "There's no way to get our own data out, which is a compliance problem for us.",
        source: 'Renewal call · Meridian Health',
      },
      {
        name: 'AP',
        quote: 'Asked support where export was. Turns out it was there all along.',
        source: 'Zendesk · Blue Harbor',
      },
      {
        name: 'CW',
        quote: 'We built a scraper because we assumed export did not exist.',
        source: 'Reddit · r/saas',
      },
    ],
  },
  {
    id: 'onboarding',
    title: 'New workspaces stall at the second integration',
    scope: '48 conversations · 31 customers · last 30 days',
    summary:
      'Teams connect their first source without help, then stop. The second integration asks for an admin credential the person doing setup usually does not have, and there is no way to hand the step to a colleague. Most stalled workspaces never return.',
    impact: [
      { value: '38%', label: 'stall at step 2' },
      { value: '31', label: 'accounts affected' },
      { value: '9 days', label: 'median time stalled' },
    ],
    evidence: [
      {
        name: 'HN',
        quote: 'I need our IT admin for this step and I cannot forward it to them.',
        source: 'Intercom · Lattice Group',
      },
      {
        name: 'BR',
        quote: 'Got one source connected, then hit a wall on permissions and gave up.',
        source: 'Onboarding survey · Kestrel',
      },
      {
        name: 'TS',
        quote: 'Would be great to invite the person who actually owns the CRM.',
        source: 'Sales call · Orbit Labs',
      },
    ],
  },
]
