export interface BookEntity {
	book: BookName;
	chapters: ChapterEntity[];
}
export interface ChapterStubEntity {
	chapter: number;
	book: BookName;
}

export interface ChapterEntity extends ChapterStubEntity {
	verses: VerseEntity[];
}
export interface CompleteChapterEntity extends ChapterEntity {
	next: ChapterStubEntity;
	previous: ChapterStubEntity;
}
export type BookName = typeof bookNames[number];

export interface VerseEntity {
	verse: number;
	text: string;
	chapter: number;
	book: BookName;
}

export const bookNames = [
	'genesis',
	'exodus',
	'leviticus',
	'numbers',
	'deuteronomy',
	'joshua',
	'judges',
	'ruth',
	'1samuel',
	'2samuel',
	'1kings',
	'2kings',
	'1chronicles',
	'2chronicles',
	'ezra',
	'nehemiah',
	'esther',
	'job',
	'psalms',
	'proverbs',
	'ecclesiastes',
	'songofsolomon',
	'isaiah',
	'jeremiah',
	'lamentations',
	'ezekiel',
	'daniel',
	'hosea',
	'joel',
	'amos',
	'obadiah',
	'jonah',
	'micah',
	'nahum',
	'habakkuk',
	'zephaniah',
	'haggai',
	'zechariah',
	'malachi',
	'matthew',
	'mark',
	'luke',
	'john',
	'acts',
	'romans',
	'1corinthians',
	'2corinthians',
	'galatians',
	'ephesians',
	'philippians',
	'colossians',
	'1thessalonians',
	'2thessalonians',
	'1timothy',
	'2timothy',
	'titus',
	'philemon',
	'hebrews',
	'james',
	'1peter',
	'2peter',
	'1john',
	'2john',
	'3john',
	'jude',
	'revelation'
] as const;
