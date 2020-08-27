/*
 * Mostly auto-generated. But you won't believe, how many hours it took me to get this working.
 */

define('ace/mode/lit_highlight_rules', ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/text_highlight_rules"], function (require, exports, module) {
	"use strict";

	var oop = require("../lib/oop");
	var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

	var LitHighlightRules = function () {
		// regexp must not have capturing parentheses. Use (?:) instead.
		// regexps are ordered -> the first match is used

		this.$rules = {
			start: [{
				include: "#code"
			}],
			"#keywords": [{
				token: "keyword.control.lit",
				regex: /\b(?:is|break|const|constructor|continue|else|export|false|for|function|if|in|new|null|operator|return|static|super|this|true|var|while)\b/
			}, {
				token: "keyword.control.lit",
				regex: /\bclass\b/
			}, {
				token: "keyword.operator.logical.lit",
				regex: /&&|\|\||is/
			}, {
				token: "keyword.operator.comparison.lit",
				regex: /==|!=|<=|>=|<|>/
			}, {
				token: "keyword.operator.assignment.lit",
				regex: /\+=|\-=|\*=|\/=|%=|#=|=/
			}, {
				"name": "keyword.operator.vararg.lit",
				"match": "(\\.\\.\\.)"
			}, {
				token: "keyword.operator.range.lit",
				regex: /\.\./
			}, {
				token: "keyword.operator.null.lit",
				regex: /\?\?/
			}, {
				token: "keyword.operator.unary.lit",
				regex: /\~|\||&/
			}, {
				token: "keyword.operator.compound.lit",
				regex: /\+\+|\--/
			}],
			"#strings": [{
				token: "string.quoted.double.lit",
				regex: /\$"/,
				push: [{
					token: "string.interpolated.lit",
					regex: /"/,
					next: "pop"
				}, {
					include: "#stringEscapes"
				}, {
					include: "#interpolation"
				}, {
					defaultToken: "string.quoted.double.lit"
				}]
			}, {
				token: "string.quoted.double.lit",
				regex: /"/,
				push: [{
					token: "string.quoted.double.lit",
					regex: /"/,
					next: "pop"
				}, {
					include: "#stringEscapes"
				}, {
					defaultToken: "string.quoted.double.lit"
				}]
			}],
			"#constant": [{
				token: "constant.language.lit",
				regex: /\b(?:true|false|null)\b/
			}, {
				token: "constant.numeric.lit",
				regex: /\b(?:0b[0-1]*|0x[0-9a-fA-F]*|[0-9]+(?:\.?[0-9]*)?(?:e(?:\+|-)?[0-9]+)?)/
			}],
			"#expectedComment": [{
				token: "comment.expected.lit",
				regex: /\/\/ Expected: .*/
			}],
			"#comment": [{
				token: "comment.line.lit",
				regex: /\/\/.*/
			}],
			"#blockComment": [{
				token: "comment.block.lit",
				regex: /\/\*/,
				push: [{
					token: "comment.block.lit",
					regex: /\*\//,
					next: "pop"
				}, {
					include: "#blockComment"
				}, {
					defaultToken: "comment.block.lit"
				}]
			}],
			"#call": [{
				token: "support.function.lit",
				regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b(?=\s*(?:[(]|\[\[))/
			}],
			"#stringEscapes": [{
				token: "constant.character.escape.lit",
				regex: /\\[0"\0{abfnrtv]/
			}],
			"#interpolation": [{
				token: "constant.character.interpolation.lit",
				regex: /\{/,
				push: [{
					token: "constant.character.interpolation.lit",
					regex: /\}/,
					next: "pop"
				}, {
					include: "#code"
				}, {
					defaultToken: "constant.character.interpolation.lit"
				}]
			}],
			"#code": [{
				include: "#keywords"
			}, {
				include: "#strings"
			}, {
				include: "#constant"
			}, {
				include: "#expectedComment"
			}, {
				include: "#comment"
			}, {
				include: "#blockComment"
			}, {
				include: "#call"
			}, {
				include: "#stringEscapes"
			}]
		}

		this.normalizeRules();
	};

	LitHighlightRules.metaData = {
		"$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
		name: "Lit",
		scopeName: "source.lit"
	}


	oop.inherits(LitHighlightRules, TextHighlightRules);

	exports.LitHighlightRules = LitHighlightRules;
});

define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (require, exports, module) {
	"use strict";

	var oop = require("../../lib/oop");
	var Range = require("../../range").Range;
	var BaseFoldMode = require("./fold_mode").FoldMode;

	var FoldMode = exports.FoldMode = function (commentRegex) {
		if (commentRegex) {
			this.foldingStartMarker = new RegExp(
				this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
			);
			this.foldingStopMarker = new RegExp(
				this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
			);
		}
	};
	oop.inherits(FoldMode, BaseFoldMode);

	(function () {

		this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
		this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
		this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
		this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
		this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
		this._getFoldWidgetBase = this.getFoldWidget;
		this.getFoldWidget = function (session, foldStyle, row) {
			var line = session.getLine(row);

			if (this.singleLineBlockCommentRe.test(line)) {
				if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
					return "";
			}

			var fw = this._getFoldWidgetBase(session, foldStyle, row);

			if (!fw && this.startRegionRe.test(line))
				return "start"; // lineCommentRegionStart

			return fw;
		};

		this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
			var line = session.getLine(row);

			if (this.startRegionRe.test(line))
				return this.getCommentRegionBlock(session, line, row);

			var match = line.match(this.foldingStartMarker);
			if (match) {
				var i = match.index;

				if (match[1])
					return this.openingBracketBlock(session, match[1], row, i);

				var range = session.getCommentFoldRange(row, i + match[0].length, 1);

				if (range && !range.isMultiLine()) {
					if (forceMultiline) {
						range = this.getSectionRange(session, row);
					} else if (foldStyle != "all")
						range = null;
				}

				return range;
			}

			if (foldStyle === "markbegin")
				return;

			var match = line.match(this.foldingStopMarker);
			if (match) {
				var i = match.index + match[0].length;

				if (match[1])
					return this.closingBracketBlock(session, match[1], row, i);

				return session.getCommentFoldRange(row, i, -1);
			}
		};

		this.getSectionRange = function (session, row) {
			var line = session.getLine(row);
			var startIndent = line.search(/\S/);
			var startRow = row;
			var startColumn = line.length;
			row = row + 1;
			var endRow = row;
			var maxRow = session.getLength();
			while (++row < maxRow) {
				line = session.getLine(row);
				var indent = line.search(/\S/);
				if (indent === -1)
					continue;
				if (startIndent > indent)
					break;
				var subRange = this.getFoldWidgetRange(session, "all", row);

				if (subRange) {
					if (subRange.start.row <= startRow) {
						break;
					} else if (subRange.isMultiLine()) {
						row = subRange.end.row;
					} else if (startIndent == indent) {
						break;
					}
				}
				endRow = row;
			}

			return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
		};
		this.getCommentRegionBlock = function (session, line, row) {
			var startColumn = line.search(/\s*$/);
			var maxRow = session.getLength();
			var startRow = row;

			var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
			var depth = 1;
			while (++row < maxRow) {
				line = session.getLine(row);
				var m = re.exec(line);
				if (!m) continue;
				if (m[1]) depth--;
				else depth++;

				if (!depth) break;
			}

			var endRow = row;
			if (endRow > startRow) {
				return new Range(startRow, startColumn, endRow, line.length);
			}
		};

	}).call(FoldMode.prototype);

});

define('ace/mode/lit', ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/solidity_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range", "ace/worker/worker_client", "ace/mode/behaviour/cstyle", "ace/mode/folding/cstyle"], function (require, exports, module) {
	"use strict";

	var oop = require("../lib/oop");
	var TextMode = require("./text").Mode;
	var LitHighlightRules = require("./lit_highlight_rules").LitHighlightRules;
	// TODO: pick appropriate fold mode
	var FoldMode = require("./folding/cstyle").FoldMode;

	var Mode = function () {
		this.HighlightRules = LitHighlightRules;
		this.foldingRules = new FoldMode();
	};
	oop.inherits(Mode, TextMode);

	(function () {
		// this.lineCommentStart = ""/\\*"";
		// this.blockComment = {start: ""/*"", end: ""*/""};
		// Extra logic goes here.
		this.$id = "ace/mode/lit"
	}).call(Mode.prototype);

	exports.Mode = Mode;
});

(function () {
	window.require(["ace/mode/lit"], function (m) {
		if (typeof module == "object" && typeof exports == "object" && module) {
			module.exports = m;
		}
	});
})();
