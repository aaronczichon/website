import { GLOBAL_CONFIG } from '../config';

interface NotePicture {
	id: number;
	status: string;
	date: string;
	description: string;
	image: NotePictureImage;
}

interface NotePictureImage {
	id: string;
	description: string;
}

export const fetch365Pictures = async () => {
	const response = await fetch(`${GLOBAL_CONFIG.baseUrl}/items/daily_picture?fields=*.*`);
	const result = await response.json();
	let items: NotePicture[] = result.data;
	// sort items by creation date
	items = items.sort((a, b) => {
		const aCreated = new Date(a.date);
		const bCreated = new Date(b.date);

		return aCreated < bCreated ? 1 : -1;
	});
	return items;
};
