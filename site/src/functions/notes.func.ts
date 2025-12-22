import { GLOBAL_CONFIG } from '../config';

interface Note {
	id: number;
	content: string;
	date_created: string;
	tag: string;
}

export const fetchNotes = async (filter?: string) => {
	const response = await fetch(`${GLOBAL_CONFIG.baseUrl}/items/microblog`);
	const result = await response.json();
	let items: Note[] = result.data;
	// sort items by creation date
	items = items.sort((a: Note, b: Note) => {
		const aCreated = new Date(a.date_created);
		const bCreated = new Date(b.date_created);

		return aCreated < bCreated ? 1 : -1;
	});
	if (filter) {
		items = items.filter(
			(item: Note) => item.tag && item.tag.toLowerCase().includes(filter.toLowerCase()),
		);
	} else items = items.filter((item: Note) => !item.tag);
	return items;
};
