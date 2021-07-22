import { BookEntity, BookName, bookNames } from '../RawTypes';
import { cwd } from 'process';
import { join } from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';

const readFilePromise = promisify(readFile);

export default async function getBookJSON(book: BookName): Promise<BookEntity> {
	console.log('\n\nTHE CURRENT WORKING DIRECTORY IS');
	console.log(cwd());
	console.log('\n\n');
	if (!bookNames.includes(book)) {
		throw new Error(
			`getBookJSON("${book}") is invalid because ${book} is not a valid Bible book name`
		);
	}
	try {
		let _book = book
			.replace('songofsolomon', 'SongofSolomon')
			.replace(/^[0-9]?[a-z]/, (m) => m.toUpperCase());
		console.log(_book);

		console.log(join(cwd(), 'src/data/raw-bible/', `${_book}.json`));
		const bookJSON = JSON.parse(
			await readFilePromise(join(cwd(), 'src/data/raw-bible/', `${_book}.json`), 'utf8')
		);
		return {
			...bookJSON,
			book: book,
			chapters: bookJSON.chapters.map((chapter) => ({
				...chapter,
				book: book,
				chapter: +chapter.chapter,
				verses: chapter.verses.map((verse) => ({
					...verse,
					verse: +verse.verse,
					chapter: +chapter.chapter,
					book: book
				}))
			}))
		};
	} catch (e) {
		throw new Error('Invalid Book Name');
	}
}
