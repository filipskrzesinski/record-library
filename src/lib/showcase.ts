/**
 * Facts and artwork the landing page shows, copied out of `src/data/pitchfork-200.json`
 * so the marketing route never pulls the whole collection into the main bundle.
 * `tests/landing.test.ts` holds every value here to the bundled collection.
 */
import type { Album } from './types'

/** A sleeve the landing page can draw: just enough of an album for <Cover>. */
export type Showcase = Pick<Album, 'id' | 'title' | 'artist' | 'year' | 'coverUrl' | 'palette'>

/** Sleeves shown on the page. The first `FAN` of them form the hero, centre first-among-equals. */
export const SHOWCASE: Showcase[] = [
  { id: 'pitchfork-032', title: 'Since I Left You', artist: 'The Avalanches', year: 2001, coverUrl: '/covers/pitchfork-032.webp', palette: { base: '#384858', accent: '#2d3a46', deep: '#242f39', ink: '#ffffff' } },
  { id: 'pitchfork-030', title: 'Punisher', artist: 'Phoebe Bridgers', year: 2020, coverUrl: '/covers/pitchfork-030.webp', palette: { base: '#081828', accent: '#061320', deep: '#05101a', ink: '#ffffff' } },
  { id: 'pitchfork-012', title: 'Illinois', artist: 'Sufjan Stevens', year: 2005, coverUrl: '/covers/pitchfork-012.webp', palette: { base: '#282828', accent: '#202020', deep: '#1a1a1a', ink: '#ffffff' } },
  { id: 'pitchfork-008', title: 'Is This It', artist: 'The Strokes', year: 2001, coverUrl: '/covers/pitchfork-008.webp', palette: { base: '#e8b848', accent: '#ba933a', deep: '#97782f', ink: '#171717' } },
  { id: 'pitchfork-006', title: 'Blonde', artist: 'Frank Ocean', year: 2016, coverUrl: '/covers/pitchfork-006.webp', palette: { base: '#e8e8e8', accent: '#bababa', deep: '#979797', ink: '#171717' } },
  { id: 'pitchfork-003', title: 'My Beautiful Dark Twisted Fantasy', artist: 'Kanye West', year: 2010, coverUrl: '/covers/pitchfork-003.webp', palette: { base: '#c81838', accent: '#a0132d', deep: '#821024', ink: '#ffffff' } },
  { id: 'pitchfork-001', title: 'Kid A', artist: 'Radiohead', year: 2000, coverUrl: '/covers/pitchfork-001.webp', palette: { base: '#080808', accent: '#060606', deep: '#050505', ink: '#ffffff' } },
  { id: 'pitchfork-014', title: 'Channel Orange', artist: 'Frank Ocean', year: 2012, coverUrl: '/covers/pitchfork-014.webp', palette: { base: '#f87808', accent: '#c66006', deep: '#a14e05', ink: '#ffffff' } },
  { id: 'pitchfork-019', title: 'Merriweather Post Pavilion', artist: 'Animal Collective', year: 2009, coverUrl: '/covers/pitchfork-019.webp', palette: { base: '#4848a8', accent: '#3a3a86', deep: '#2f2f6d', ink: '#ffffff' } },
  { id: 'pitchfork-007', title: 'Funeral', artist: 'Arcade Fire', year: 2004, coverUrl: '/covers/pitchfork-007.webp', palette: { base: '#c89868', accent: '#a07a53', deep: '#826344', ink: '#171717' } },
  { id: 'pitchfork-020', title: 'Melodrama', artist: 'Lorde', year: 2017, coverUrl: '/covers/pitchfork-020.webp', palette: { base: '#0878d8', accent: '#0660ad', deep: '#054e8c', ink: '#ffffff' } },
  { id: 'pitchfork-002', title: 'OK Computer', artist: 'Radiohead', year: 1997, coverUrl: '/covers/pitchfork-002.webp', palette: { base: '#f8f8f8', accent: '#c6c6c6', deep: '#a1a1a1', ink: '#171717' } },
  { id: 'pitchfork-005', title: 'To Pimp a Butterfly', artist: 'Kendrick Lamar', year: 2015, coverUrl: '/covers/pitchfork-005.webp', palette: { base: '#b8b8b8', accent: '#939393', deep: '#787878', ink: '#171717' } },
  { id: 'pitchfork-010', title: 'Yankee Hotel Foxtrot', artist: 'Wilco', year: 2002, coverUrl: '/covers/pitchfork-010.webp', palette: { base: '#c8b898', accent: '#a0937a', deep: '#827863', ink: '#171717' } },
  { id: 'pitchfork-011', title: 'In the Aeroplane Over the Sea', artist: 'Neutral Milk Hotel', year: 1998, coverUrl: '/covers/pitchfork-011.webp', palette: { base: '#d8d8b8', accent: '#adad93', deep: '#8c8c78', ink: '#171717' } },
  { id: 'pitchfork-016', title: 'Madvillainy', artist: 'Madvillain', year: 2004, coverUrl: '/covers/pitchfork-016.webp', palette: { base: '#e8e8e8', accent: '#bababa', deep: '#979797', ink: '#171717' } },
  { id: 'pitchfork-025', title: 'Currents', artist: 'Tame Impala', year: 2015, coverUrl: '/covers/pitchfork-025.webp', palette: { base: '#080808', accent: '#060606', deep: '#050505', ink: '#ffffff' } },
  { id: 'pitchfork-029', title: 'Discovery', artist: 'Daft Punk', year: 2001, coverUrl: '/covers/pitchfork-029.webp', palette: { base: '#080808', accent: '#060606', deep: '#050505', ink: '#ffffff' } },
]

/** Hero sleeves: eleven covers, the sixth facing front. */
export const FAN = SHOWCASE.slice(0, 11)

/** What is actually in the bundled collection. */
export const COLLECTION = {
  records: 197,
  ranks: 200,
  artists: 132,
  labels: 90,
  votes: 95687,
  yearFrom: 1996,
  yearTo: 2020,
  /** Fictional sample listening sessions, and the records they are spread across. */
  listens: 188,
  listenedAlbums: 100,
  genres: [
    { name: 'Rock', count: 100 },
    { name: 'Pop/R&B', count: 28 },
    { name: 'Electronic', count: 26 },
    { name: 'Rap', count: 25 },
    { name: 'Folk/Country', count: 10 },
    { name: 'Experimental', count: 6 },
    { name: 'Metal', count: 2 },
  ],
  decades: [
    { decade: 1990, count: 31 },
    { decade: 2000, count: 72 },
    { decade: 2010, count: 89 },
    { decade: 2020, count: 5 },
  ],
} as const
