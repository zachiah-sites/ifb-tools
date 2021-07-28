import type { VerseEntity } from '../RawTypes';

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export default function* search(
	verses: VerseEntity[],
	options: { text: string; exactMatch: boolean; wholeWordsOnly: boolean }
) {
	options.text = options.text
		.split(' ')
		.filter((i) => i)
		.join(' ');
	for (let verse of verses) {
		if (!options.exactMatch && !options.wholeWordsOnly) {
			const verseText = verse.text.toLowerCase();
			const searchWords = options.text.toLowerCase().split(' ');

			let highlightedText = verse.text;
			let good = true;
			for (let word of searchWords) {
				if (!verseText.includes(word)) {
					good = false;
					break;
				} else {
					highlightedText = highlightedText.replace(
						new RegExp(`(?<![</])(${escapeRegExp(word)})`, 'ig'),
						'<span class="font-bold">$1</span>'
					);
				}
			}
			if (good) {
				yield { verse, highlightedText } as const;
			}
		} else if (!options.exactMatch && options.wholeWordsOnly) {
			const verseText = verse.text.toLowerCase();
			const searchWords = options.text.toLowerCase().split(' ');

			let highlightedText = verse.text;
			let good = true;
			for (let word of searchWords) {
				if (
					!verseText.replace(/[,.:;]/g, '').match(new RegExp(`\\b${escapeRegExp(word)}\\b`)) &&
					!verseText.match(new RegExp(`\\b${escapeRegExp(word)}\\b`))
				) {
					good = false;
					break;
				} else {
					highlightedText = highlightedText.replace(
						new RegExp(`(?<![</])(\\b[,.:; ]*${escapeRegExp(word)}[,.:; ]*\\b)`, 'ig'),
						'<span class="font-bold">$1</span>'
					);
				}
			}
			if (good) {
				yield { verse, highlightedText } as const;
			}
		} else if (options.exactMatch && !options.wholeWordsOnly) {
			if (
				verse.text.toLowerCase().includes(options.text.toLowerCase()) ||
				verse.text
					.toLowerCase()
					.replace(/[,.:;]/g, '')
					.includes(options.text.toLowerCase())
			) {
				yield {
					verse,
					highlightedText: verse.text.replace(
						new RegExp(
							`(${options.text
								.split(' ')
								.map((item) => `[,.:; ]+${escapeRegExp(item)}`)
								.join('')})`,
							'ig'
						),
						'<span class="font-bold">$1</span>'
					)
				} as const;
			}
		} else if (options.exactMatch && options.wholeWordsOnly) {
			const verseText = verse.text.toLowerCase();
			const searchText = options.text.toLowerCase();
			if (
				verseText.match(new RegExp(`\\b${escapeRegExp(searchText)}\\b`)) ||
				verseText.replace(/[,.;:]/g, '').match(new RegExp(`\\b${escapeRegExp(searchText)}\\b`))
			) {
				yield {
					verse,
					highlightedText: verse.text.replace(
						new RegExp(
							`(\\b[,.:; ]*${options.text
								.split(' ')
								.map((item) => `[,.:; ]+${escapeRegExp(item)}`)
								.join('')}[,.:; ]*\\b)`,
							'ig'
						),
						'<span class="font-bold">$1</span>'
					)
				} as const;
			}
		}
	}
}
