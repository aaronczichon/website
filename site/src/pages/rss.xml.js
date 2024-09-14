import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(_context) {
	const blog = await getCollection('blog');
	return rss({
		title: 'Aaron Czichon - Blog',
		// `<description>` field in output xml
		description: 'Aaron\'s Blog as RSS feed',
		site: 'https://aaronczichon.de',
		items: blog.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			customData: post.data.customData,
			content: sanitizeHtml(parser.render(post.body)),
			// Compute RSS link from post `slug`
			// This example assumes all posts are rendered as `/blog/[slug]` routes
			link: `/blog/${post.slug}/`,
		})),
	});
}
