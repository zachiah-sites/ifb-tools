import search from '~/data/bible/isomorphic/search';
import { bookNames } from '~/data/bible/RawTypes';
import getBookJSON from '~/data/bible/server/getBookJSON';

export async function get({ params, query }) {
	const text = query.get('text') || '';
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
		body: { results }
	};
}
