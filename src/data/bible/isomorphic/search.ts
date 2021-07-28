import type { VerseEntity } from '../RawTypes';

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export default function* search(
	verses: VerseEntity[],
	options: { text: string; exactMatch: boolean; wholeWordsOnly: boolean }
) {
	verseLoop: for (let verse of verses) {
		if (!options.exactMatch && !options.wholeWordsOnly) {
			const verseText = verse.text.toLowerCase();
			const searchWords = options.text.toLowerCase().split(' ');

			let good = true;
			for (let word of searchWords) {
				if (!verseText.includes(word)) {
					good = false;
					break;
				}
			}
			if (good) {
				yield { verse } as const;
			}
		} else if (!options.exactMatch && options.wholeWordsOnly) {
			const verseText = verse.text.toLowerCase();
			const searchWords = options.text.toLowerCase().split(' ');

			for (let word of searchWords) {
				if (
					!verseText.replace(/[,.:;]/g, '').match(new RegExp(`\\b${escapeRegExp(word)}\\b`)) &&
					!verseText.match(new RegExp(`\\b${escapeRegExp(word)}\\b`))
				) {
					continue verseLoop;
				}
			}
			yield { verse } as const;
		} else if (options.exactMatch && !options.wholeWordsOnly) {
			if (verse.text.toLowerCase().includes(options.text.toLowerCase())) {
				yield { verse } as const;
			}
		} else if (options.exactMatch && options.wholeWordsOnly) {
			const verseText = verse.text.toLowerCase();
			const searchText = options.text.toLowerCase();
			if (
				verseText.match(new RegExp(`\\b${escapeRegExp(searchText)}\\b`)) ||
				verseText.replace(/[,.;:]/g, '').match(new RegExp(`\\b${escapeRegExp(searchText)}\\b`))
			) {
				yield { verse } as const;
			}
		}
	}
}
