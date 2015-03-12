(function() {
	// Used as reference to the global object.
	var root = (typeof global == 'object' && global) || this;

	// Used as a no-op function.
	var noop = Function.prototype;

	// Use a single `load` function.
	var load = (typeof require == 'function' && !(root.define && define.amd))
		? require
		: (!root.document && root.java && root.load) || noop;

	// Load QUnit in a way that works around cross-environment issues.
	var QUnit = root.QUnit || (root.QUnit = (
		root.addEventListener || (root.addEventListener = noop),
		root.setTimeout || (root.setTimeout = noop),
		QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
		addEventListener === noop && delete root.addEventListener,
		QUnit = QUnit.QUnit || QUnit
	));

	// Load QUnit Extras.
	var qe = load('../node_modules/qunit-extras/qunit-extras.js');
	if (qe) {
		qe.runInContext(root);
	}

	var cssesc = root.cssesc || (root.cssesc = (
		cssesc = load('../cssesc.js') || root.cssesc,
		cssesc = cssesc.cssesc || cssesc
	));

	/*--------------------------------------------------------------------------*/

	QUnit.test('cssesc: common usage', function() {
		QUnit.equal(
			typeof cssesc.version,
			'string',
			'`cssesc.version` must be a string'
		);
		QUnit.equal(
			cssesc('-foo'),
			'-foo',
			'-foo'
		);
		QUnit.equal(
			cssesc('--foo', { 'isIdentifier': false }),
			'--foo',
			'--foo with `isIdentifier: false`'
		);
		QUnit.equal(
			cssesc('--foo', { 'isIdentifier': true }),
			'\\--foo',
			'--foo with `isIdentifier: true`'
		);
		QUnit.equal(
			cssesc('-0foo', { 'isIdentifier': false }),
			'-0foo',
			'-0foo with `isIdentifier: false`'
		);
		QUnit.equal(
			cssesc('-0foo', { 'isIdentifier': true }),
			'\\-0foo',
			'-0foo with `isIdentifier: true`'
		);
		QUnit.equal(
			cssesc('-9foo', { 'isIdentifier': false }),
			'-9foo',
			'-9foo with `isIdentifier: false`'
		);
		QUnit.equal(
			cssesc('-9foo', { 'isIdentifier': true }),
			'\\-9foo',
			'-9foo with `isIdentifier: true`'
		);
		QUnit.equal(
			cssesc('foo:bar', { 'isIdentifier': false }),
			'foo:bar',
			'foo:bar (avoid `\\:` for IE < 8 compatibility) with `isIdentifier: false`'
		);
		QUnit.equal(
			cssesc('foo:bar', { 'isIdentifier': true }),
			'foo\\3A bar',
			'foo:bar (avoid `\\:` for IE < 8 compatibility) with `isIdentifier: true`'
		);
		QUnit.equal(
			cssesc('_foo_bar', { 'isIdentifier': false }),
			'_foo_bar',
			'_foo_bar with `isIdentifier: false`'
		);
		QUnit.equal(
			cssesc('_foo_bar', { 'isIdentifier': true }),
			'\\_foo_bar',
			'_foo_bar (escape leading `_` for IE6 compatibility) with `isIdentifier: true`'
		);
		QUnit.equal(
			cssesc('a\t\n\v\f\rb'),
			'a\\9\\A\\B\\C\\D b',
			'whitespace characters'
		);
		QUnit.equal(
			cssesc('\\A _'),
			'\\\\A _',
			'backslash escapes that look like a hex escape: space is preserved'
		);
		QUnit.equal(
			cssesc('\\\\A _'),
			'\\\\\\\\A _',
			'backslash escapes that look like a hex escape: space is preserved'
		);
		QUnit.equal(
			cssesc('a\\b'),
			'a\\\\b',
			'backslash'
		);
		QUnit.equal(
			cssesc('-\\ABC -', { 'isIdentifier': false }),
			'-\\\\ABC -',
			'more backslashes with `isIdentifier: false`'
		);
		QUnit.equal(
			cssesc('-\\ABC -', { 'isIdentifier': true }),
			'-\\\\ABC\\ -',
			'more backslashes with `isIdentifier: true`'
		);
		QUnit.equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true`'
		);
		QUnit.equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'LOLWAT' }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true, quotes: \'LOLWAT\'` (incorrect value)'
		);
		QUnit.equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'single' }),
			'\'a"b\\\'c\\A9 d\'',
			'quotes with `wrap: true, quotes: \'single\'`'
		);
		QUnit.equal(
			cssesc('a"b\'c\xA9d', { 'wrap': true, 'quotes': 'double' }),
			'"a\\"b\'c\\A9 d"',
			'quotes with `wrap: true, quotes: \'double\'`'
		);
		QUnit.equal(
			cssesc('a\xA9b'),
			'a\\A9 b',
			'non-ASCII symbol'
		);
		QUnit.equal(
			cssesc('Ich \u2665 B\xFCcher'),
			'Ich \\2665  B\\FC cher',
			'non-ASCII symbols'
		);
		QUnit.equal(
			cssesc('a123b'),
			'a123b',
			'numbers not at the start of the string'
		);
		QUnit.equal(
			cssesc('123a2b', { 'isIdentifier': false }),
			'123a2b',
			'numbers at the start of the string with `isIdentifier: false`'
		);
		QUnit.equal(
			cssesc('123a2b', { 'isIdentifier': true }),
			'\\31 23a2b',
			'numbers at the start of the string with `isIdentifier: true`'
		);
		QUnit.equal(
			cssesc('1_23a2b', { 'isIdentifier': false }),
			'1_23a2b',
			'numbers at the start of the string with `isIdentifier: false`'
		);
		QUnit.equal(
			cssesc('1_23a2b', { 'isIdentifier': true }),
			'\\31_23a2b',
			'numbers at the start of the string with `isIdentifier: true`'
		);
		QUnit.equal(
			cssesc('a\uD834\uDF06b'),
			'a\\1D306 b',
			'astral symbol'
		);
		QUnit.equal(
			cssesc('a\uD834b'),
			'a\\D834 b',
			'lone high surrogate'
		);
		QUnit.equal(
			cssesc('lolwat"foo\'bar\xA9k', {
				'escapeEverything': true
			}),
			'\\6C\\6F\\6C\\77\\61\\74\\"\\66\\6F\\6F\\\'\\62\\61\\72\\A9\\6B',
			'`escapeEverything: true`'
		);
	});

	/*--------------------------------------------------------------------------*/

	// Depending on the version of `QUnit` call either `QUnit.start()` or
	// `QUnit.load()` when in a CLI or PhantomJS.
	if (!root.document || root.phantom) {
		QUnit.load();
	}
}.call(this));
