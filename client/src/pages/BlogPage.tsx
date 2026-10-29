import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';

const articles = [
  {
    category: 'Vedic Astrology',
    title: 'A simple guide to your Janam Kundali',
    summary: 'Learn how the ascendant, Moon sign, houses, and planetary placements fit together in a Vedic birth chart.',
    link: '/free-kundali',
    action: 'Explore your Kundali',
  },
  {
    category: 'Daily Guidance',
    title: 'What the five limbs of Panchang tell you',
    summary: 'Get to know Tithi, Vara, Nakshatra, Yoga, and Karana, along with the day’s sunrise and muhurat timings.',
    link: '/panchang',
    action: 'View today’s Panchang',
  },
  {
    category: 'Self Discovery',
    title: 'Human Design and the way you make decisions',
    summary: 'An introduction to Type, Strategy, and Authority in a Human Design chart, and how to find them in your profile.',
    link: '/human-design',
    action: 'Create a Human Design chart',
  },
  {
    category: 'Gene Keys',
    title: 'Explore your Gene Keys profile',
    summary: 'Discover how the Activation, Venus, and Pearl sequences organize the spheres in a Gene Keys profile.',
    link: '/gene-keys',
    action: 'Explore Gene Keys',
  },
];

export const BlogPage: React.FC = () => (
  <main className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
    <header className="mx-auto max-w-2xl space-y-4 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-cosmic-gold/40 bg-cosmic-purple/40 px-3.5 py-1.5 text-xs font-semibold text-cosmic-gold">
        <BookOpen className="h-3.5 w-3.5" /> Voxigen Journal
      </div>
      <h1 className="font-display text-4xl font-extrabold text-cosmic-ivory sm:text-5xl">Blog</h1>
      <p className="text-sm leading-6 text-cosmic-lavender/75">Guides to Vedic astrology, Panchang, Human Design, and Gene Keys.</p>
    </header>

    <section aria-label="Latest articles" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {articles.map(article => (
        <article key={article.title} className="flex min-h-64 flex-col rounded-2xl border border-cosmic-border-subtle bg-cosmic-card p-6 shadow-cosmic-card">
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cosmic-gold">
            <Sparkles className="h-3.5 w-3.5" /> {article.category}
          </div>
          <h2 className="font-display text-xl font-bold leading-snug text-cosmic-ivory">{article.title}</h2>
          <p className="mt-3 flex-1 text-sm leading-6 text-cosmic-lavender/75">{article.summary}</p>
          <Link to={article.link} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cosmic-gold hover:text-cosmic-gold-light">
            {article.action}<ArrowUpRight className="h-4 w-4" />
          </Link>
        </article>
      ))}
    </section>
  </main>
);
