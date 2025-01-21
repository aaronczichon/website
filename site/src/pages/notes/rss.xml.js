import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { fetchNotes } from '../../functions/notes.func';
const parser = new MarkdownIt();

export async function GET(_context) {
	const notes = await fetchNotes();
	return rss({
		title: 'Aaron Czichon - Notes',
		// `<description>` field in output xml
		description:
			"Aaron's notes as RSS feed. This feed only contains the notes, not the blog posts and not the 365 pictures.",
		site: 'https://aaronczichon.de/notes/',
		items: notes.map((post) => ({
			title: post.title,
			pubDate: post.date_created,
			content: sanitizeHtml(parser.render(post.text)),
			// Compute RSS link from post `id`
			// This example assumes all posts are rendered as `/notes/#hash` routes
			link: `/notes#${post.id}`,
		})),
	});
}
