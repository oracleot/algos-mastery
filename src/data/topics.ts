// data/topics.ts - Static topic taxonomy with 15 ordered algorithm topics

import type { Topic, TopicSlug } from '../types';

// Topic display names mapping
const TOPIC_NAMES: Record<TopicSlug, string> = {
  'arrays-hashing': 'Arrays & Hashing',
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  'stack': 'Stack',
  'binary-search': 'Binary Search',
  'linked-list': 'Linked List',
  'trees': 'Trees',
  'tries': 'Tries',
  'backtracking': 'Backtracking',
  'heap': 'Heap / Priority Queue',
  'graphs': 'Graphs',
  'dynamic-programming': 'Dynamic Programming',
  'greedy': 'Greedy',
  'intervals': 'Intervals',
  'bit-manipulation': 'Bit Manipulation',
};

// Ordered array of topics following learning progression
export const TOPICS: Topic[] = [
  { slug: 'arrays-hashing', name: 'Arrays & Hashing', order: 1 },
  { slug: 'two-pointers', name: 'Two Pointers', order: 2 },
  { slug: 'sliding-window', name: 'Sliding Window', order: 3 },
  { slug: 'stack', name: 'Stack', order: 4 },
  { slug: 'binary-search', name: 'Binary Search', order: 5 },
  { slug: 'linked-list', name: 'Linked List', order: 6 },
  { slug: 'trees', name: 'Trees', order: 7 },
  { slug: 'tries', name: 'Tries', order: 8 },
  { slug: 'backtracking', name: 'Backtracking', order: 9 },
  { slug: 'heap', name: 'Heap / Priority Queue', order: 10 },
  { slug: 'graphs', name: 'Graphs', order: 11 },
  { slug: 'dynamic-programming', name: 'Dynamic Programming', order: 12 },
  { slug: 'greedy', name: 'Greedy', order: 13 },
  { slug: 'intervals', name: 'Intervals', order: 14 },
  { slug: 'bit-manipulation', name: 'Bit Manipulation', order: 15 },
];

// Get topic by slug
export function getTopicBySlug(slug: TopicSlug): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

// Get topic display name by slug
export function getTopicName(slug: TopicSlug): string {
  return TOPIC_NAMES[slug];
}

// Get all topics as select options
export function getTopicOptions(): { value: TopicSlug; label: string }[] {
  return TOPICS.map((t) => ({ value: t.slug, label: t.name }));
}
