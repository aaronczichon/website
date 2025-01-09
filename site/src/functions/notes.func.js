const BASE_URL = 'https://directus.aaronczichon.de';

export const fetchNotes = async (filter) => {
	const response = await fetch(`${BASE_URL}/items/microblog`);
	const result = await response.json();
	let items = result.data;
	// sort items by creation date
	items = items.sort((a, b) => {
		const aCreated = new Date(a.date_created);
		const bCreated = new Date(b.date_created);

		return aCreated < bCreated ? 1 : -1;
	});
	if (filter) {
		items = items.filter(
			(item) => item.tag && item.tag.toLowerCase().includes(filter.toLowerCase()),
		);
	} else items = items.filter((item) => !item.tag);
	return items;
};
