import search from '~/data/bible/isomorphic/search';
import { bookNames } from '~/data/bible/RawTypes';
import getBookJSON from '~/data/bible/server/getBookJSON';

export async function get({ params, query }) {
	const text = query.get('text') || '';
	const page = Math.max(+query.get('page'), 1) || 1;
	const perPage = +query.get('perPage') || 200;

	console.log(text);
	let exactMatch;
	let wholeWordsOnly;
	try {
		exactMatch = !!JSON.parse(query.get('exactMatch') || 'false');
		wholeWordsOnly = !!JSON.parse(query.get('wholeWordsOnly') || 'false');
	} catch {
		exactMatch = exactMatch || false;
		wholeWordsOnly = wholeWordsOnly || false;
	}

	console.log({ exactMatch, wholeWordsOnly });
	const results = (
		await Promise.all(
			bookNames.flatMap(async (bookName) =>
				(await getBookJSON(bookName)).chapters.map((chapter) => {
					return [...search(chapter.verses, { text, exactMatch, wholeWordsOnly })];
				})
			)
		)
	).flat(3);

	return {
		body: {
			results: results.slice((page - 1) * perPage, page * perPage),
			pages: Math.ceil(results.length / perPage),
			total: results.length
		}
	};
}
