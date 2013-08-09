;(function(root) {
	'use strict';

	/** Use a single `load` function */
	var load = typeof require == 'function' ? require : root.load;

	/** The unit testing framework */
	var QUnit = (function() {
		var noop = Function.prototype;
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			(load('../node_modules/qunit-clib/qunit-clib.js') || { 'runInContext': noop }).runInContext(root),
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	// Extend `Object.prototype` to see if this library can handle it.
	Object.prototype['♥'] = '...';

	/** The `regenerate` object to test */
	var cssesc = root.cssesc || (root.cssesc = (
		cssesc = load('../cssesc.js') || root.cssesc,
		cssesc = cssesc.cssesc || cssesc
	));

	/*--------------------------------------------------------------------------*/

	test('cssesc: common usage', function() {
		equal(
			typeof cssesc.version,
			'string',
			'`cssesc.version` must be a string'
		);
		equal(
			cssesc('-foo'),
			'-foo',
			'-foo'
		);
		equal(
			cssesc('--foo', { 'isIdentifier': false }),
			'--foo',
			'--foo with `isIdentifier: false`'
		);
		equal(
			cssesc('--foo', { 'isIdentifier': true }),
			'\\--foo',
			'--foo with `isIdentifier: true`'
		);
		equal(
			cssesc('-0foo', { 'isIdentifier': false }),
			'-0foo',
			'-0foo with `isIdentifier: false`'
		);
		equal(
			cssesc('-0foo', { 'isIdentifier': true }),
			'\\-0foo',
			'-0foo with `isIdentifier: true`'
		);
		equal(
			cssesc('-9foo', { 'isIdentifier': false }),
			'-9foo',
			'-9foo with `isIdentifier: false`'
		);
		equal(
			cssesc('-9foo', { 'isIdentifier': true }),
			'\\-9foo',
			'-9foo with `isIdentifier: true`'
		);
		equal(
			cssesc('foo:bar', { 'isIdentifier': false }),
			'foo:bar',
			'foo:bar (avoid `\\:` for IE < 8 compatibility) with `isIdentifier: false`'
		);
		equal(
			cssesc('foo:bar', { 'isIdentifier': true }),
			'foo\\3A bar',
			'foo:bar (avoid `\\:` for IE < 8 compatibility) with `isIdentifier: true`'
		);
		equal(
			cssesc('_foo_bar', { 'isIdentifier': false }),
			'_foo_bar',
			'_foo_bar with `isIdentifier: false`'
		);
		equal(
			cssesc('_foo_bar', { 'isIdentifier': true }),
			'\\_foo_bar',
			'_foo_bar (escape leading `_` for IE6 compatibility) with `isIdentifier: true`'
		);
		equal(
			cssesc('a\t\n\v\f\rb'),
			'a\\9\\A\\B\\C\\D b',
			'whitespace characters'
		);
		equal(
			cssesc('\\A _'),
			'\\\\A _',
			'backslash escapes that look like a hex escape: space is preserved'
		);
		equal(
			cssesc('\\\\A _'),
			'\\\\\\\\A _',
			'backslash escapes that look like a hex escape: space is preserved'
		);
		equal(
			cssesc('a\\b'),
			'a\\\\b',
			'backslash'
		);
		equal(
			cssesc('-\\ABC -', { 'isIdentifier': false }),
			'-\\\\ABC -',
			'more backslashes with `isIdentifier: false`'
		);
		equal(
			cssesc('-\\ABC -', { 'isIdentifier': true }),
			'-\\\\ABC\\ -',
			'more backslashes with `isIdentifier: true`'
		);
		equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true`'
		);
		equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'LOLWAT' }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true, quotes: \'LOLWAT\'` (incorrect value)'
		);
		equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'single' }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true, quotes: \'single\'`'
		);
		equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'double' }),
			'"a\\"b\'c\\A9 d"',
			'quotes with `wrap: true, quotes: \'double\'`'
		);
		equal(
			cssesc('a\xA9b'),
			'a\\A9 b',
			'non-ASCII symbol'
		);
		equal(
			cssesc('Ich \u2665 B\xFCcher'),
			'Ich \\2665  B\\FC cher',
			'non-ASCII symbols'
		);
		equal(
			cssesc('a123b'),
			'a123b',
			'numbers not at the start of the string'
		);
		equal(
			cssesc('123a2b', { 'isIdentifier': false }),
			'123a2b',
			'numbers at the start of the string with `isIdentifier: false`'
		);
		equal(
			cssesc('123a2b', { 'isIdentifier': true }),
			'\\31 23a2b',
			'numbers at the start of the string with `isIdentifier: true`'
		);
		equal(
			cssesc('1_23a2b', { 'isIdentifier': false }),
			'1_23a2b',
			'numbers at the start of the string with `isIdentifier: false`'
		);
		equal(
			cssesc('1_23a2b', { 'isIdentifier': true }),
			'\\31_23a2b',
			'numbers at the start of the string with `isIdentifier: true`'
		);
		equal(
			cssesc('a\uD834\uDF06b'),
			'a\\1D306 b',
			'astral symbol'
		);
		equal(
			cssesc('a\uD834b'),
			'a\\D834 b',
			'lone high surrogate'
		);
		equal(
			cssesc('lolwat"foo\'bar\xA9k', {
				'escapeEverything': true
			}),
			'\\6C\\6F\\6C\\77\\61\\74\\"\\66\\6F\\6F\\\'\\62\\61\\72\\A9\\6B',
			'`escapeEverything: true`'
		);
	});

	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}
}(typeof global == 'object' && global || this));
