/** Curated Hall of Wins — aspirational redemptions for Rewards + Home rails. */

export type HallOfWinner = {
  /** First name only. */
  name: string;
  place: string;
};

export type HallOfWin = {
  id: string;
  /** Cool hero line — project can live in the reward copy. */
  reward: string;
  winners: HallOfWinner[];
  /** Kept for linking / sorting; not shown on the poster. */
  project: string;
  /** Project page path when available. */
  projectHref?: string;
  image: string;
  /** CSS object-position — focus faces / subjects in wide stills. */
  imagePosition?: string;
  /** Zoom on desktop so vertical crops have room (landscape in landscape). */
  imageScale?: number;
};

/** Two desk picks — set visit + festival VIP. */
export const HALL_OF_WINS: HallOfWin[] = [
  {
    id: 'hello-darkness-set',
    reward: 'Sent two fans to the set of Hello Darkness.',
    winners: [
      { name: 'Maya', place: 'Los Angeles' },
      { name: 'Jordan', place: 'Los Angeles' },
    ],
    project: 'Hello Darkness',
    projectHref: '/preview/story-inc/hello-darkness',
    image: '/preview/story-inc/hello-darkness/set-visit-win.jpg',
    imagePosition: '55% 35%',
  },
  {
    id: 'rolling-loud-vip',
    reward: 'Flew two predictors to Rolling Loud — VIP.',
    winners: [
      { name: 'Sam', place: 'Miami' },
      { name: 'Riley', place: 'Austin' },
    ],
    project: 'Rolling Loud',
    projectHref: '/preview/story-inc/rolling-loud',
    image: '/preview/story-inc/rolling-loud/market-owen-wife.png',
    imagePosition: '50% 18%',
  },
];

export function formatWinners(winners: HallOfWinner[]): string {
  return winners.map((w) => `${w.name} · ${w.place}`).join(' · ');
}
