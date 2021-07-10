import type { BookName } from '../RawTypes';

export default function formatBookName(book: BookName) {
	if (book === 'songofsolomon') {
		return 'Song of Solomon';
	}

	let result: string = book;
	if (book.startsWith('1') || book.startsWith('2')) {
		result = `${result[0]} ${result.slice(1)}`;
	}
	return ` ${result}`.replace(/ ([a-z])/, (v) => v.toUpperCase()).trim();
}
