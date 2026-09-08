import type { Metadata } from 'next';
import ProjectPage from '../ProjectPage';
import { projectPageMetadata } from '../project-metadata';
import { PAPER_TIGER } from '../projects/paper-tiger';

export const metadata: Metadata = projectPageMetadata({
  title: 'Paper Tiger',
  description:
    'Follow Paper Tiger on Story Inc — rewards, markets, and the project page.',
  path: '/preview/story-inc/paper-tiger',
  image: '/preview/story-inc/paper-tiger/hero-adam.png',
});

/** Client comp — Paper Tiger on the shared Rolling Loud template. */
export default function PaperTigerProjectPage() {
  return <ProjectPage data={PAPER_TIGER} />;
}
