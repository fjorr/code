/**
 * The Dossier — public record essays.
 * English source of truth; UI chrome lives in messages (Dossier / Nav / Meta).
 */

export type DossierFootnote = {
  id: string;
  text: string;
};

/** Inline marks: `**bold**`, `*italic*`, footnote superscripts ¹–⁹ */
export type DossierBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export type DossierArticle = {
  /** 01 … n — filing number */
  number: string;
  slug: string;
  /** Index + article title */
  title: string;
  /** Short line on the index card */
  dek: string;
  /** Filing reference, e.g. FJR-DOS-001 */
  ref: string;
  /** Approx. reading time shown on the index card */
  readMinutes: number;
  /**
   * Poster art — drop files at these paths when ready
   * (e.g. `public/dossier/why-short.avif` or media.fjorr.com).
   * Null shows the official-document placeholder.
   */
  poster: string | null;
  /** Optional standfirst above body */
  lead?: string;
  /** Simple paragraph essays */
  paragraphs?: string[];
  /** Structured essays (sections, lists). Wins over paragraphs when set. */
  body?: DossierBlock[];
  footnotes?: DossierFootnote[];
};

export function getDossierBody(article: DossierArticle): DossierBlock[] {
  if (article.body?.length) return article.body;
  return (article.paragraphs ?? []).map((text) => ({ type: 'p' as const, text }));
}

export const DOSSIER_SERIES = '01';
export const DOSSIER_ISSUED = '9 Aug 2026';

export const DOSSIER_ARTICLES: DossierArticle[] = [
  {
    number: '01',
    slug: 'the-internet-doesnt-have-to-be-this-way',
    title: "The Internet Doesn't Have to Be This Way",
    dek: 'Open watching. No ads. No algorithm. A place built to send you back outside.',
    ref: 'FJR-DOS-001',
    readMinutes: 6,
    poster: '/dossier/the-internet-doesnt-have-to-be-this-way.avif',
    paragraphs: [
      "Ads that follow you from one screen to the next, built on data quietly collected from everywhere you've been. Algorithms that decide what you see before you ever ask for it — your attention sold to advertisers in an auction that happens before the page even loads. Feeds with no end, because an end would mean you might leave, and leaving is the one thing the system can't afford. Headlines built to make you angry enough to click, because outrage spreads faster than almost anything true. Interfaces built with the dark arts of UI design — \"no\" buried, \"yes\" lit up, on purpose, by people paid specifically to make it that way. And now, an entire layer of content nobody actually made, generated at a scale no human ever could, filling the space where something true used to be.",
      "It's a hot mess, and it's not by accident. It has a name — the attention economy — and a business model that only works if you stay.",
      "Ask around, and most people will tell you the same thing: they don't trust what they read anymore, they can't remember what they watched, and they're tired in a way that has nothing to do with sleep.",
      "This isn't just a personal cost. Trust in the media just hit its lowest point on record — 28%, the first time it's dropped below 30% in fifty years of tracking, down from 40% five years ago.¹ The average time someone stays focused on a single screen has collapsed from two and a half minutes in 2004 to under a minute today.² And half of American adults now report real, chronic loneliness — a condition the U.S. Surgeon General has formally called a public health epidemic, one that predates the pandemic and has outlasted it.³ None of these happened in isolation. They happened alongside a media environment built to extract, not to inform.",
      "Well, it doesn't have to be this way. It could be so much more — built for you instead of built to hold you.",
      "Fjorr doesn't work like that. On purpose.",
      "No ads — nobody is paying us to interrupt what you're watching, so nobody has a reason to.",
      "No algorithm — nothing here decides what you see based on what will keep you the longest. You choose a film because it's there, not because something calculated you'd be unable to look away.",
      "No autoplay, no infinite queue, no next video counting down before you've finished the last one. Every film on Fjorr has an ending, and we mean for you to reach it.",
      "Somebody has to pay for that, and it isn't going to be your attention.",
      "It's the Bureaux — members who fund the work directly, so the business model never has to become the thing we're trying to avoid.",
      "Matter fades. Myths don't. But an internet built to extract from you fades faster than either.",
      "We're betting people are tired of being the product. We're betting that given a real choice — something made for them instead of at them — most people would take it.",
    ],
    footnotes: [
      {
        id: '1',
        text: 'Gallup, September 2025: Americans\' trust in mass media to report news "fully, accurately, and fairly" fell to 28%, the lowest level recorded in the poll\'s 50-year history.',
      },
      {
        id: '2',
        text: 'Gloria Mark, University of California, Irvine, "Attention Span" (2023): average time spent on a single screen before switching dropped from 2.5 minutes in 2004 to roughly 47 seconds in recent measurements, corroborated by five independent studies.',
      },
      {
        id: '3',
        text: 'U.S. Surgeon General\'s Advisory, "Our Epidemic of Loneliness and Isolation" (2023): approximately half of U.S. adults report measurable loneliness, a condition present before the COVID-19 pandemic and worsened by it.',
      },
    ],
  },
  {
    number: '02',
    slug: 'why-short',
    title: 'One Hundred Years of Failure',
    dek: 'The story of why short films never found a home.',
    ref: 'FJR-DOS-002',
    readMinutes: 8,
    poster: '/dossier/why-short.avif',
    body: [
      {
        type: 'p',
        text: 'Short film has never had a functional business model—just a hundred years of broken ones.',
      },
      {
        type: 'p',
        text: "For a century, the short film was almost never something you bought a ticket to see. It was what played while people found their seats. A warm-up act, a newsreel filler, a bonus feature tacked onto a DVD menu, or a loss-leader to test new animation software. That wasn't an artistic choice; it became the category's entire structural identity: something free, attached to something else, and never the reason anyone showed up.",
      },
      {
        type: 'p',
        text: 'The market problem was never a lack of human interest. It was a failure of the monetization vehicle.',
      },
      { type: 'h2', text: 'The Broken Mechanics of Cinema History' },
      {
        type: 'p',
        text: 'Every attempt to monetize short cinema—from early Hollywood to Silicon Valley—tried to force the format into a transactional, ad-driven, or feature-centric box:',
      },
      {
        type: 'ul',
        items: [
          '**The Studio System Collapse:** In the 1930s and 40s, Hollywood forced theaters to buy shorts alongside feature films through "block booking." When the Supreme Court declared the practice illegal in the 1948 *Paramount Decrees*, theater owners stopped paying for shorts overnight. MGM gutted its short units, and Warner Bros. scaled back its iconic cartoon departments.',
          '**The Disney Pivot:** By 1953, Walt Disney shut down his studio\'s dedicated short cartoon department. Production costs for hand-drawn animation had surged, but theaters paid only a flat, negligible rental fee. Disney realized shorts lost money on every single release, forcing a complete pivot toward feature-length films and advertiser-funded television.',
          '**The Pixar Paradox:** Even modern animation\'s greatest champion treats short films as an R&D tax write-off and a talent sandbox. Pixar shorts do not generate standalone revenue; they are subsidized entirely by the multi-hundred-million-dollar box office of the feature film that follows them.',
          '**The Silicon Valley Misfire (Quibi):** When tech finally attempted a short-form platform, it made the ultimate miscalculation. Quibi raised $1.75 billion to sell short, chopped-up television episodes as mobile "quick bites" for commuters. They treated short video as a smartphone tech constraint rather than a high-craft art form, attempting to fight TikTok for idle distraction time behind a hard subscription paywall. It folded in six months.',
        ],
      },
      {
        type: 'p',
        text: "Streaming apps and ad-driven feeds didn't fix this—they exacerbated it. Engagement algorithms favor infinite duration. A recommendation engine tuned to maximize screen time has zero financial incentive to surface a nine-minute masterpiece over a ninety-minute outrage-bait video.",
      },
      {
        type: 'p',
        text: "Meanwhile, production costs don't scale down linearly. A ten-minute film requires the same camera packages, lighting rigs, permits, and elite crew rates as a feature. The overhead stays fixed while legacy distribution channels pay zero.",
      },
      {
        type: 'p',
        text: 'For one hundred years, short film was treated as a calling card, a tech gimmick, or a launchpad to "real" cinema. Rarely the destination.',
      },
      {
        type: 'p',
        text: 'That is not a flaw in the format. It is a structural failure of every model built around it.',
      },
      { type: 'h2', text: 'Filling a Cultural Void' },
      {
        type: 'p',
        text: 'The format was never the compromise; it was simply denied a home.',
      },
      {
        type: 'p',
        text: 'When you look at modern media, there is a massive void in global culture. Hollywood spends $200 million on comic book sequels. Silicon Valley algorithms serve endless, disposable feeds designed to capture idle attention. Nobody is building a gold-standard stage dedicated purely to short cinema—making short films of the essential, pivotal stories that shaped what it means to be human.',
      },
      {
        type: 'p',
        text: "Short cinema doesn't need to compete with TikTok for idle phone time, nor does it need to squeeze into a 1950s theatrical ticket model or a Silicon Valley tech gimmick. It needs the right vehicle.",
      },
      {
        type: 'p',
        text: "Fjorr's thesis is simple: the format didn't fail—the vehicle did.",
      },
      {
        type: 'p',
        text: 'Instead of treating short films as appetizers or tech gimmicks, Fjorr treats them as the main event. Instead of hiding them behind transactional paywalls or serving them alongside intrusive ads, Fjorr uses a **Patronage Guild model**. Supported by the Bureaux, Fjorr builds a permanent, ad-free archive of world-class short films under ten minutes—free forever for anyone in the world to watch.',
      },
      {
        type: 'p',
        text: 'Short was never a compromise. It just never had anywhere to live.',
      },
      { type: 'p', text: 'Until now.' },
    ],
  },
  {
    number: '03',
    slug: 'plus-machine',
    title: 'Plus Machine',
    dek: 'Nothing here is finished. Everything here can be made more.',
    ref: 'FJR-DOS-003',
    readMinutes: 4,
    poster: '/dossier/plus-machine.avif',
    paragraphs: [
      "Matter fades. Myths don't.",
      'But only if someone keeps sharpening them.',
      "A film that ships once and is never touched again isn't a myth — it's a snapshot. The stories that actually survived long enough to matter — the ones passed down, retold, refined by every generation that carried them — were never frozen the moment they were first told. They were shaped, again and again, by the people who cared enough to make them better.",
      "Most media doesn't work this way. A film releases, and that's it — whatever's wrong with it is wrong forever. A mistake made on day one is a mistake made for the life of the work. That's not how myths have ever actually functioned, and it's not how Fjorr works either.",
      "Every film on Fjorr ships as v1 — not a rough draft, not the final word. If something's not landing, the people watching can say so. If the people who made it agree, they fix it. Not because the first version failed, but because better was always still possible, and short films are cheap enough to actually chase it.",
      "This isn't a comment section. It's not a review score. It's a direct line between the audience that felt something was missing and the people with the authority to do something about it. The credit stays. The history stays. Nothing gets erased — it gets versioned, the same way a myth accumulates its retellings instead of discarding the ones that came before.",
      "We call this the Plus Machine, because that's the whole idea in two words: nothing here is finished. Everything here can be made more.",
    ],
  },
  {
    number: '04',
    slug: 'ai',
    title: 'Tool, Not Slop',
    dek: "We use AI. We're not going to pretend otherwise, and we're not going to apologize for it either.",
    ref: 'FJR-DOS-004',
    readMinutes: 5,
    poster: '/dossier/ai.avif',
    paragraphs: [
      "We use AI. We're not going to pretend otherwise, and we're not going to apologize for it either.",
      "Here's what that actually means. AI helps with things it's genuinely good at — accelerating a process, testing an idea, doing in an afternoon what used to take a week. It doesn't decide what story gets told. It doesn't write the ending. It doesn't choose what matters. That's a human decision, every time, made by someone with actual taste and actual stakes in getting it right.",
      "And it's real people doing the actual work, not just approving it. Directors direct. Editors cut. Composers write the score. The craft that makes a film feel like something, not just look like something, still comes from a person who's spent years learning how to do it — AI hasn't replaced that, and it isn't going to. What it's replaced is the boring parts nobody misses.",
      "That distinction is the whole thing. The internet isn't drowning in AI because AI is bad — it's drowning because AI made it free to generate infinite content with nobody deciding if any of it was worth making in the first place. That's slop. Not because a machine touched it, but because nothing did the one thing that actually matters: someone with real judgment deciding this was worth someone else's time.",
      "Every film on Fjorr passes through people who could say no, and often do. The Bureaux — the director, the editor, the composer, whoever built it — is accountable for every choice in the finished work, the same way they'd be accountable if they'd done it with a pencil and a razor blade instead. The tool changes. The responsibility doesn't.",
      "So the honest answer is: yes, we use AI, the way any studio worth its salt uses whatever tool gets the work done best. What we don't do is let a tool make the call that was always supposed to be a person's — whether this story deserved to be told at all, or replace the people whose actual craft makes it worth watching.",
      'A myth has never been about how it was made. It\'s about whether it was worth keeping.',
    ],
  },
];

export function getDossierArticle(slug: string): DossierArticle | undefined {
  return DOSSIER_ARTICLES.find((a) => a.slug === slug);
}

export function getDossierSlugs(): string[] {
  return DOSSIER_ARTICLES.map((a) => a.slug);
}

export function getAdjacentArticles(slug: string): {
  prev: DossierArticle | null;
  next: DossierArticle | null;
} {
  const i = DOSSIER_ARTICLES.findIndex((a) => a.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? DOSSIER_ARTICLES[i - 1]! : null,
    next: i < DOSSIER_ARTICLES.length - 1 ? DOSSIER_ARTICLES[i + 1]! : null,
  };
}
