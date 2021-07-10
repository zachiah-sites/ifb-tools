import getBookJSON from './getBookJSON';
import {
    BookEntity,
    BookName,
    bookNames,
    ChapterEntity,
    ChapterStubEntity,
    CompleteChapterEntity
    } from '../RawTypes';

const last = <T>(arr: Array<T>) => arr[arr.length - 1];

export default async function getChapterJSON(
	bookJSON: BookEntity | BookName,
	chapter: number
): Promise<CompleteChapterEntity> {
	if (typeof bookJSON === 'string') {
		bookJSON = await getBookJSON(bookJSON);
	}
	const bookName = bookJSON.book;
	const chapterJSON = bookJSON.chapters[chapter - 1];

	let nextChapterJSON: ChapterStubEntity;
	let previousChapterJSON: ChapterStubEntity;

	console.log(bookName, chapter);
	if (chapter === 1 && bookName === 'genesis') {
		previousChapterJSON = (await getBookJSON('revelation')).chapters[21];
	} else if (chapter === 1) {
		previousChapterJSON = last(
			await (await getBookJSON(bookNames[bookNames.indexOf(bookName) - 1])).chapters
		);
	} else {
		previousChapterJSON = bookJSON.chapters[chapter - 2];
	}

	if (chapter === 22 && bookName == 'revelation') {
		nextChapterJSON = await (await getBookJSON('genesis')).chapters[0];
	} else if (!bookJSON.chapters[chapter]) {
		nextChapterJSON = (await getBookJSON(bookNames[bookNames.indexOf(bookName) + 1])).chapters[0];
	} else {
		nextChapterJSON = bookJSON.chapters[chapter];
	}

	nextChapterJSON = { chapter: nextChapterJSON.chapter, book: nextChapterJSON.book };
	previousChapterJSON = { chapter: previousChapterJSON.chapter, book: previousChapterJSON.book };

	if (chapterJSON) {
		return { ...chapterJSON, next: nextChapterJSON, previous: previousChapterJSON };
	} else {
		throw new Error(
			`getChapterJSON('... {${bookJSON.book}}', ${chapter}) is invalid because ${bookJSON.book} doesn't have ${chapter} chapters`
		);
	}
}
