'use strict';

const assert = require('assert');
const cssesc = require('../cssesc.js');

describe('common usage', () => {
	it('works as expected', () => {
		assert.equal(
			typeof cssesc.version,
			'string',
			'`cssesc.version` must be a string'
		);
		assert.equal(
			cssesc('-foo'),
			'-foo',
			'-foo'
		);
		assert.equal(
			cssesc('--foo', { 'isIdentifier': false }),
			'--foo',
			'--foo with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('--foo', { 'isIdentifier': true }),
			'\\--foo',
			'--foo with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('-0foo', { 'isIdentifier': false }),
			'-0foo',
			'-0foo with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('-0foo', { 'isIdentifier': true }),
			'\\-0foo',
			'-0foo with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('-9foo', { 'isIdentifier': false }),
			'-9foo',
			'-9foo with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('-9foo', { 'isIdentifier': true }),
			'\\-9foo',
			'-9foo with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('foo:bar', { 'isIdentifier': false }),
			'foo:bar',
			'foo:bar with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('foo:bar', { 'isIdentifier': true }),
			'foo\\:bar',
			'foo:bar with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('_foo_bar', { 'isIdentifier': false }),
			'_foo_bar',
			'_foo_bar with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('_foo_bar', { 'isIdentifier': true }),
			'_foo_bar',
			'_foo_bar with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('a\t\n\v\f\rb'),
			'a\\9\\A\\B\\C\\D b',
			'whitespace characters'
		);
		assert.equal(
			cssesc('\\A _'),
			'\\\\A _',
			'backslash escapes that look like a hex escape: space is preserved'
		);
		assert.equal(
			cssesc('\\\\A _'),
			'\\\\\\\\A _',
			'backslash escapes that look like a hex escape: space is preserved'
		);
		assert.equal(
			cssesc('a\\b'),
			'a\\\\b',
			'backslash'
		);
		assert.equal(
			cssesc('-\\ABC -', { 'isIdentifier': false }),
			'-\\\\ABC -',
			'more backslashes with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('-\\ABC -', { 'isIdentifier': true }),
			'-\\\\ABC\\ -',
			'more backslashes with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('id"ent\'ifier', { 'isIdentifier': true }),
			'id\\"ent\\\'ifier',
			'quotes are escaped with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true`'
		);
		assert.equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'LOLWAT' }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true, quotes: \'LOLWAT\'` (incorrect value)'
		);
		assert.equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'single' }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true, quotes: \'single\'`'
		);
		assert.equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'double' }),
			'"a\\"b\'c\\A9 d"',
			'quotes with `wrap: true, quotes: \'double\'`'
		);
		assert.equal(
			cssesc('a\xA9b'),
			'a\\A9 b',
			'non-ASCII symbol'
		);
		assert.equal(
			cssesc('Ich \u2665 B\xFCcher'),
			'Ich \\2665  B\\FC cher',
			'non-ASCII symbols'
		);
		assert.equal(
			cssesc('a123b'),
			'a123b',
			'numbers not at the start of the string'
		);
		assert.equal(
			cssesc('123a2b', { 'isIdentifier': false }),
			'123a2b',
			'numbers at the start of the string with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('123a2b', { 'isIdentifier': true }),
			'\\31 23a2b',
			'numbers at the start of the string with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('1_23a2b', { 'isIdentifier': false }),
			'1_23a2b',
			'numbers at the start of the string with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('1_23a2b', { 'isIdentifier': true }),
			'\\31_23a2b',
			'numbers at the start of the string with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('foo\\bar', { 'isIdentifier': false }),
			'foo\\\\bar',
			'backslashes are escaped with `isIdentifier: false`'
		);
		assert.equal(
			cssesc('foo\\bar', { 'isIdentifier': true }),
			'foo\\\\bar',
			'backslashes are escaped with `isIdentifier: true`'
		);
		assert.equal(
			cssesc('a\uD834\uDF06b'),
			'a\\1D306 b',
			'astral symbol'
		);
		assert.equal(
			cssesc('a\uD834b'),
			'a\\D834 b',
			'lone high surrogate'
		);
		assert.equal(
			cssesc('lolwat"foo\'bar\xA9k', {
				'escapeEverything': true
			}),
			'\\6C\\6F\\6C\\77\\61\\74\\"\\66\\6F\\6F\\\'\\62\\61\\72\\A9\\6B',
			'`escapeEverything: true`'
		);
	});
});
