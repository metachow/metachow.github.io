import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Posts that appear in lists and feeds, newest first. */
export async function getListedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => data.listed);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Plain-text excerpt from the raw Markdown body, for lists and meta descriptions. */
export function excerpt(post: Post, length = 140): string {
  if (post.data.description) return post.data.description;
  const text = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? text.slice(0, length).trimEnd() + '…' : text;
}
