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

export const highestChapters = {
	genesis: 50,
	exodus: 40,
	leviticus: 27,
	numbers: 36,
	deuteronomy: 34,
	joshua: 24,
	judges: 21,
	ruth: 4,
	'1samuel': 31,
	'2samuel': 24,
	'1kings': 22,
	'2kings': 25,
	'1chronicles': 29,
	'2chronicles': 36,
	ezra: 10,
	nehemiah: 13,
	esther: 10,
	job: 42,
	psalms: 150,
	proverbs: 31,
	ecclesiastes: 12,
	songofsolomon: 8,
	isaiah: 66,
	jeremiah: 52,
	lamentations: 5,
	ezekiel: 48,
	daniel: 12,
	hosea: 14,
	joel: 3,
	amos: 9,
	obadiah: 1,
	jonah: 4,
	micah: 7,
	nahum: 3,
	habakkuk: 3,
	zephaniah: 3,
	haggai: 2,
	zechariah: 14,
	malachi: 4,
	matthew: 28,
	mark: 16,
	luke: 24,
	john: 21,
	acts: 28,
	romans: 16,
	'1corinthians': 16,
	'2corinthians': 13,
	galatians: 6,
	ephesians: 6,
	philippians: 4,
	colossians: 4,
	'1thessalonians': 4,
	'2thessalonians': 3,
	'1timothy': 6,
	'2timothy': 4,
	titus: 3,
	philemon: 1,
	hebrews: 13,
	james: 5,
	'1peter': 5,
	'2peter': 3,
	'1john': 5,
	'2john': 1,
	'3john': 1,
	jude: 1,
	revelation: 22
} as const;

export const getChapterNumbers = (bookName: typeof bookNames[number]) =>
	new Array(highestChapters[bookName]).fill(0).map((z, i) => i + 1);
