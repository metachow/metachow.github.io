import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { excerpt, getListedPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getListedPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: excerpt(post),
      categories: post.data.tags,
      link: `/post/${post.id}/`,
    })),
  });
}
