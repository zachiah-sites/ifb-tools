import formatBookName from '../data/bible/isomorphic/formatBookName';

test('works with normal book names', () => {
	expect(formatBookName('genesis')).toBe('Genesis');
	expect(formatBookName('revelation')).toBe('Revelation');
});

test('works with numbered book names', () => {
	expect(formatBookName('1samuel')).toBe('1 Samuel');
	expect(formatBookName('2peter')).toBe('2 Peter');
	expect(formatBookName('3john')).toBe('3 John');
});

test('works with songofsolomon', () => {
	expect(formatBookName('songofsolomon')).toBe('Song of Solomon');
});
