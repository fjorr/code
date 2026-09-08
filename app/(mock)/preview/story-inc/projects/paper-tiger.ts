import type { ProjectPageData } from '../project-types';

const A = '/preview/story-inc/paper-tiger';
const M = `${A}/markets`;
const img = {
  hero: `${A}/hero-adam.png`,
  nyff: `${A}/reward-nyff.png`,
  poster: `${A}/reward-poster.jpg`,
  scarlett: `${A}/reward-scarlett.png`,
  miles: `${A}/reward-miles.png`,
  merch: `${A}/reward-merch.png`,
  james: `${M}/JamesG.png`,
  marketNyff: `${M}/NYFF.png`,
  marketRex: `${M}/AdamDriver_1.png`,
  marketBrothers: `${M}/Brothers_1.png`,
  marketMiles: `${M}/MilesTeller_1.png`,
  marketWashington: `${M}/Brothers_2.png`,
  marketTrailer: `${M}/Neon_1.png`,
  marketBox: `${M}/PaperTiger.png`,
  marketNight: `${M}/Scarlett.png`,
} as const;

/**
 * Paper Tiger — Story Inc client comp on the shared Rolling Loud template.
 * Market stills from `public/preview/story-inc/paper-tiger/markets`.
 */
export const PAPER_TIGER: ProjectPageData = {
  slug: 'paper-tiger',
  title: 'Paper Tiger',
  kick: 'In theaters November 21',
  castLine: ['Adam Driver', 'Scarlett Johansson', 'Miles Teller'],
  credits:
    'Written and directed by James Gray · Cinematography by Joaquín Baca-Asay · A Neon release',
  story: [
    'Two brothers pursue the American Dream but get entangled in a dangerous Russian crime scheme that threatens their family, turning their bond as brothers into enemies.',
    'Opening night of the 2025 New York Film Festival. Adam Driver, Scarlett Johansson, and Miles Teller star. Written and directed by James Gray, shot in 35mm. A Neon release. In theaters November 21, 2025.',
  ],
  followLine:
    'Follow this page for NYFF access, early notifications, and reward drops from the filmmakers.',
  jumpTiles: [
    { label: 'Rewards', sub: '{rewards} live drops', href: '#rewards' },
    { label: 'Markets', sub: '{markets} live now', href: '#markets' },
    { label: 'Trailers', sub: 'Watch & share', href: '#trailers' },
    { label: 'Follow page', sub: 'VIP + notifications', href: '#notify' },
  ],
  heroPoster: img.hero,
  teaserLabel: 'Hero image',
  fanCount: 12640,
  rewardGroups: [
    {
      heading: 'Rewards',
      rewards: [
        {
          id: 'nyff',
          caption: '',
          status: 'Open now',
          title: '2 tickets to the New York Film Festival',
          body: 'Opening-night seats for the 2025 New York Film Festival premiere.',
          color: '#00a86b',
          image: img.nyff,
          imagePosition: 'center',
        },
        {
          id: 'shout-miles',
          caption: '',
          status: 'Open now',
          title: 'Virtual shout-out from Miles Teller',
          body: 'A personal video shout-out from Miles Teller.',
          color: '#1d1d1f',
          image: img.miles,
          imagePosition: 'center',
        },
        {
          id: 'shout-scarlett',
          caption: '',
          status: 'Open now',
          title: 'Virtual shout-out from Scarlett Johansson',
          body: 'A personal video shout-out from Scarlett Johansson.',
          color: '#3d4a6b',
          image: img.scarlett,
          imagePosition: 'center',
        },
        {
          id: 'shout-adam',
          caption: '',
          status: 'Open now',
          title: 'Virtual shout-out from Adam Driver',
          body: 'A personal video shout-out from Adam Driver.',
          color: '#2a2118',
          image: img.hero,
          imagePosition: 'center',
        },
        {
          id: 'poster',
          caption: '',
          status: 'Open now',
          title: 'Movie poster signed by the cast',
          body: 'A Paper Tiger one-sheet signed by the cast.',
          color: '#c4b48a',
          image: img.poster,
          imagePosition: 'center',
        },
        {
          id: 'merch',
          caption: '',
          status: 'Open now',
          title: 'Paper Tiger × Neon merch',
          body: 'Limited t-shirt from the Neon drop.',
          color: '#f5f5f7',
          image: img.merch,
          imagePosition: 'center',
        },
      ],
    },
  ],
  markets: [
    {
      image: img.marketNyff,
      question: 'Who attends NYFF?',
      outcomes: [
        { label: 'Scarlett Johansson', pct: 27 },
        { label: 'Adam Driver', pct: 19 },
      ],
      volume: '$18.4k vol',
      traders: '1.1k',
      closes: '11.13.25',
    },
    {
      image: img.marketRex,
      imagePosition: 'center',
      question: 'When does Rex officially drop dead?',
      outcomes: [
        { label: 'Before Sept 24', pct: 4 },
        { label: 'Sept 25–Oct 5', pct: 12 },
      ],
      volume: '$6.2k vol',
      traders: '640',
      closes: '08.04.26',
    },
    {
      image: img.marketBrothers,
      question: 'Where do the brothers stand at the end of the film?',
      outcomes: [
        { label: 'Foes', pct: 29 },
        { label: 'Friends', pct: 10 },
        { label: 'Both', pct: 5 },
      ],
      volume: '$22.8k vol',
      traders: '1.6k',
      closes: '11.13.25',
    },
    {
      image: img.marketMiles,
      question: 'How many Paper Tiger posts will Miles Teller make in November?',
      outcomes: [
        { label: '1–5', pct: 40 },
        { label: '6+', pct: 13 },
        { label: 'None', pct: 8 },
      ],
      volume: '$9.1k vol',
      traders: '870',
      closes: '11.01.25',
    },
    {
      image: img.marketWashington,
      question: 'Does Washington hire Noor & Paper Tigers?',
      outcomes: [
        { label: 'Yes', pct: 47 },
        { label: 'No', pct: 47 },
      ],
      volume: '$31.5k vol',
      traders: '2.2k',
      closes: '11.13.25',
    },
    {
      image: img.marketTrailer,
      question: 'How many views of Official Trailer week one?',
      outcomes: [
        { label: '1M–5M', pct: 42 },
        { label: 'Under 1M', pct: 38 },
        { label: '5M–10M', pct: 4 },
      ],
      volume: '$27.4k vol',
      traders: '1.9k',
      closes: '11.01.25',
    },
    {
      image: img.marketBox,
      question: 'Paper Tiger box office first 30 days?',
      outcomes: [
        { label: 'Under $10M', pct: 58 },
        { label: '$10M–$25M', pct: 27 },
        { label: '$25M+', pct: 4 },
      ],
      volume: '$41.6k vol',
      traders: '2.8k',
      closes: '11.01.25',
    },
    {
      image: img.marketNight,
      question: 'Who makes the earliest night appearance for Paper Tiger?',
      outcomes: [
        { label: 'Adam Driver', pct: 47 },
        { label: 'Scarlett Johansson', pct: 34 },
      ],
      volume: '$14.7k vol',
      traders: '980',
      closes: '11.01.25',
    },
  ],
  comments: [
    {
      handle: '@nycwilson87',
      place: 'Mumbai',
      time: '2h ago',
      initials: 'NW',
      avatarColor: '#00a6ff',
      body: 'The brothers market is the one. If they end as foes, that NYFF room is going to go quiet.',
    },
    {
      handle: '@midtownbook',
      place: 'Los Angeles',
      time: '4h ago',
      initials: 'MB',
      avatarColor: '#e85d04',
      badge: 'Holding Foes',
      body: 'November, Neon, James Gray on 35mm — I’m not betting family money. I’m on the cold ending.',
    },
    {
      handle: '@festweek',
      place: 'New York',
      time: '6h ago',
      initials: 'FW',
      avatarColor: '#2a9d8f',
      body: 'If Scarlett walks the NYFF carpet and Adam doesn’t, that attend market is already mispriced.',
    },
  ],
  trailers: [
    {
      title: 'Official trailer',
      meta: 'Coming soon · Neon',
      status: 'Notify me',
      thumb: img.poster,
    },
  ],
  hasTickets: true,
  ticketsBody:
    'Opening night of the 2025 New York Film Festival, then theaters November 21. Followers get first access when inventory opens.',
  studio: 'Neon × James Gray',
  filmmakerBody:
    'Written and directed by James Gray. Cinematography by Joaquín Baca-Asay, shot in 35mm. Distributed by Neon, the studio behind Parasite and Anora.',
  team: [
    { name: 'James Gray', image: img.james },
    { name: 'Adam Driver', image: img.hero },
    { name: 'Miles Teller', image: img.miles },
    { name: 'Scarlett Johansson', image: img.scarlett },
  ],
  notifyBody:
    'NYFF night, trailer windows, reward drops, and Neon updates. Follow this project and we’ll keep you in the loop.',
  updates: [
    {
      from: 'James Gray',
      role: 'Writer / Director',
      time: 'Yesterday',
      body: 'Locked the opening-night cut for New York. Followers get the first note from the edit before it hits the festival.',
    },
    {
      from: 'Neon',
      role: 'Studio',
      time: '3d ago',
      body: 'Paper Tiger is opening night of the 2025 New York Film Festival. Ticket windows and the signed-poster drop go to this page first.',
    },
    {
      from: 'Story Inc Desk',
      role: 'Updates',
      time: '6d ago',
      body: 'NYFF attendance and brothers-ending markets are live. Get a pick in before the carpet.',
    },
  ],
  footerNote:
    'Concept comp for partner discussion. Market odds, volumes, and comments shown here are illustrative placeholders, not real data. Story Inc. is an independent entity and is not endorsed by or affiliated with any individual or entity depicted, unless expressly indicated.',
};
