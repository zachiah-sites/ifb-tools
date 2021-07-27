import search from '~/data/bible/isomorphic/search';
import { bookNames } from '~/data/bible/RawTypes';
import getBookJSON from '~/data/bible/server/getBookJSON';

export async function get({ params, query }) {
	console.log('SEARCH');
	const text = query.get('text');

	const results = (
		await Promise.all(
			bookNames.flatMap(async (bookName) =>
				(await getBookJSON(bookName)).chapters.map((chapter) => {
					return [...search(chapter.verses, { text })];
				})
			)
		)
	).flat(3);

	return {
		body: { results }
	};
}
