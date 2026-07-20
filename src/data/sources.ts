/**
 * The nine channels a mid-size B2B SaaS company actually leaks feedback
 * across. `share` is the slice of total volume each one carries — it drives
 * both the counter section and the particle colour distribution in the 3D
 * scene, so the two can never disagree about how much noise comes from where.
 *
 * Shares sum to 1.0; VOLUME_TOTAL is the only absolute number, so changing
 * the scenario size is a one-line edit.
 */

export interface Source {
  id: string
  name: string
  /** Where a reader would recognise this from. */
  detail: string
  color: string
  share: number
}

export const VOLUME_TOTAL = 2847
export const VOLUME_WINDOW_DAYS = 14
export const CUSTOMER_COUNT = 412

export const SOURCES: Source[] = [
  { id: 'support', name: 'Support tickets', detail: 'Zendesk', color: 'var(--ch-support)', share: 0.24 },
  { id: 'reviews', name: 'App store reviews', detail: 'iOS · Android', color: 'var(--ch-reviews)', share: 0.16 },
  { id: 'chat', name: 'Live chat', detail: 'Intercom', color: 'var(--ch-chat)', share: 0.14 },
  { id: 'sales', name: 'Sales calls', detail: 'Gong transcripts', color: 'var(--ch-sales)', share: 0.11 },
  { id: 'community', name: 'Community', detail: 'Reddit · Discord', color: 'var(--ch-community)', share: 0.1 },
  { id: 'social', name: 'Social', detail: 'X · LinkedIn', color: 'var(--ch-social)', share: 0.09 },
  { id: 'surveys', name: 'Surveys & NPS', detail: 'Delighted', color: 'var(--ch-surveys)', share: 0.07 },
  { id: 'tickets', name: 'Issue trackers', detail: 'Jira · Linear', color: 'var(--ch-tickets)', share: 0.055 },
  { id: 'docs', name: 'Docs & notes', detail: 'Notion · CRM', color: 'var(--ch-docs)', share: 0.045 },
]

/** Raw hex values for WebGL, which cannot resolve CSS custom properties. */
export const SOURCE_HEX: Record<string, string> = {
  support: '#6C9BEF',
  reviews: '#E8A33D',
  chat: '#7F8FF4',
  sales: '#4FB477',
  community: '#E5626A',
  social: '#B57BDC',
  surveys: '#4FC3C7',
  tickets: '#D98C3D',
  docs: '#9C9CA6',
}
