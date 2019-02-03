var regenerate = require('regenerate');
var fs = require('fs');

// Characters with special meaning in CSS, except for quotes and backslashes
// (they get a separate regex)
var set = regenerate().add(
	' ', '!', '#', '$', '%', '&', '(', ')', '*', '+', ',', '.', '/', ';', '<', ':',
	'=', '>', '?', '@', '[', ']', '^', '`', '{', '|', '}', '~', '"', '\'', '\\'
);

module.exports = {
	'anySingleEscape': set.toString(),
	'singleEscapes': set.remove('\\').toString(),
	'version': JSON.parse(fs.readFileSync('package.json', 'utf8')).version
};
