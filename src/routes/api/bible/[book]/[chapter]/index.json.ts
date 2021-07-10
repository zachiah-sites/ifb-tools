import getChapterJSON from '~/data/bible/server/getChapterJSON';

export async function get({ params }) {
	const { book, chapter } = params;
	console.log(`/api/bible/${book}/${chapter}`);
	try {
		return { body: await getChapterJSON(book, +chapter) };
	} catch (e) {
		return;
	}
}
