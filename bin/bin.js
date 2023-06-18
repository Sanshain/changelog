#!/usr/bin/env node

'use strict';

var require$$0 = require('fs');
var require$$1 = require('child_process');
var require$$2 = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var bin = {};

var sources = {};

//@ts-check

const fs = require$$0__default["default"];
const { execSync: execSync$1 } = require$$1__default["default"];
const path = require$$2__default["default"];


const CHANGELOG = path.join(process.cwd(), 'CHANGELOG.md');

const PACKAGE_PATH = path.join(process.cwd(), 'package.json');


const packageConfig = fs.readFileSync(PACKAGE_PATH).toString();


/**
 * 
 * @param {RegExp | RegExp[]} [filter] : optional filter;
 */
sources.default = function changeLog(filter) {

    var [lastVer, lastLog] = getLastVer();

    const packageInfo = JSON.parse(packageConfig);
    if (packageInfo.version !== lastVer) {
        const log = execSync$1('git log --oneline').toString();
        let lines = log.split('\n')
            .map(title => title.replace(/\([\s\S]+\)/, ''))                             // remove current branch name
            .map(line => line.split(' ').slice(1).join(' '))                            // remove commit hash
            .filter(w => !w.match(/(readme|merge branch|npmignore|gitignore)/i))        // remove service commits by specifying keywords
            .filter(title => !title.match(/^[\w\d\-_]+$/m))                             // remove one-word commits as useless info
            .filter(title => title.length > 6);                                          // remove too short commit names as useless

        if (filter) {
            if (filter instanceof RegExp) {
                lines = lines.filter(title => !title.match(filter));
            }
            else if (Array.isArray(filter)) {
                lines = filter.reduce((acc, f) => acc.filter(title => !title.match(f)), lines);                
            }
        }

        let newLog = '';
        for (const line of lines) {
            if (lastLog == line) break;
            newLog += line + '. ';
        }

        if (newLog) {
            console.log('CHANGELOG updated');
            fs.writeFileSync(CHANGELOG, `${packageInfo.version} - ${newLog}\n` + log);
        }
    }
};



function getLastVer() {
    if (fs.existsSync(CHANGELOG)) {
        const log = fs.readFileSync(CHANGELOG).toString();
        const lastVerInfo = log.split('\n')[0];
        const verInfo = lastVerInfo.match(/(?<ver>\d+.\d+.\d+)b? - (?<log>[\s\S]+)/);
        if (verInfo) {
            return [verInfo.groups?.ver, verInfo.groups?.log];
        }
    }
    return [];
}

var json_beautifier$1 = {exports: {}};

var json2Mod = {exports: {}};

/*

  **** json2-mod.js

  **** 2013-12-22, Martin Drapeau
  **** Modified json2 to add a 4th parameter dropQuotesOnKeys on
  **** stringify to drop quotes around keys. Defaults to false.
  **** Creates a global object JSON2_mod.

  **** 2017-10-07, Abimbola Idowu
  **** Added quoteType option.
  
    json2.js
    2013-05-26

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON2_mod.stringify(value, replacer, space, dropQuotesOnKeys, quoteType)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.
      
            dropQuotesOnKeys
                        an optional parameter to specify the quote character.
                        Specify either `double` for " or `single` for '.
                        Defaults to double quote however you can overwrite with
                        a single quote. Do note that the output will not be valid
                        JSON, but it will be valid Javascript.

            quoteType
                        an optional parameter to specify the quote character.
                        Use either `double` or `single`.
                        Defaults to double quote " however you can overwrite with
                        a single quote '. Do note that the output will not be valid
                        JSON is you use `single`, but it will be valid Javascript.
      
            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON2_mod.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/
json2Mod.exports;

var hasRequiredJson2Mod;

function requireJson2Mod () {
	if (hasRequiredJson2Mod) return json2Mod.exports;
	hasRequiredJson2Mod = 1;
	(function (module, exports) {
		/*jslint evil: true, regexp: true */

		/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
		    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
		    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
		    lastIndex, length, parse, prototype, push, replace, slice, stringify,
		    test, toJSON, toString, valueOf
		*/

		(function () {

		    var JSON2_mod = {};

		    function f(n) {
		        // Format integers to have at least two digits.
		        return n < 10 ? '0' + n : n;
		    }

		    if (typeof Date.prototype.toJSON !== 'function') {

		        Date.prototype.toJSON = function () {

		            return isFinite(this.valueOf())
		                ? this.getUTCFullYear()     + '-' +
		                    f(this.getUTCMonth() + 1) + '-' +
		                    f(this.getUTCDate())      + 'T' +
		                    f(this.getUTCHours())     + ':' +
		                    f(this.getUTCMinutes())   + ':' +
		                    f(this.getUTCSeconds())   + 'Z'
		                : null;
		        };

		        String.prototype.toJSON      =
		            Number.prototype.toJSON  =
		            Boolean.prototype.toJSON = function () {
		                return this.valueOf();
		            };
		    }

		    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		        keyable = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
		    gap,
		        indent,
		        meta = {    // table of character substitutions
		            '\b': '\\b',
		            '\t': '\\t',
		            '\n': '\\n',
		            '\f': '\\f',
		            '\r': '\\r',
		            '"' : '\\"',
		            "'": "\\'",
		            '\\': '\\\\'
		        },
		        rep;


		    function quote(string, quoteType) {

		// If the string contains no control characters, no quote characters, and no
		// backslash characters, then we can safely slap some quotes around it.
		// Otherwise we must also replace the offending characters with safe escape
		// sequences.

		        escapable.lastIndex = 0;

		        var surroundingQuote = '"';
		        if (quoteType === 'single') {
		            surroundingQuote = "'";
		        }

		        return escapable.test(string) ? surroundingQuote + string.replace(escapable, function (a) {
		            var c = meta[a];
		            return typeof c === 'string'
		                ? c
		                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		        }) + surroundingQuote : surroundingQuote + string + surroundingQuote;
		    }
		  
		// Conditionally quote a key if it cannot be a Javascript variable
		  function condQuoteKey(string, quoteType) {
		    return keyable.test(string) ? string : quote(string, quoteType);
		  }


		    function str(key, holder, dropQuotesOnKeys, quoteType) {

		// Produce a string from holder[key].

		        var i,          // The loop counter.
		            k,          // The member key.
		            v,          // The member value.
		            length,
		            mind = gap,
		            partial,
		            value = holder[key];

		// If the value has a toJSON method, call it to obtain a replacement value.

		        if (value && typeof value === 'object' &&
		                typeof value.toJSON === 'function') {
		            value = value.toJSON(key);
		        }

		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.

		        if (typeof rep === 'function') {
		            value = rep.call(holder, key, value);
		        }

		// What happens next depends on the value's type.

		        switch (typeof value) {
		        case 'string':
		            return quote(value, quoteType);

		        case 'number':

		// JSON numbers must be finite. Encode non-finite numbers as null.

		            return isFinite(value) ? String(value) : 'null';

		        case 'boolean':
		        case 'null':

		// If the value is a boolean or null, convert it to a string. Note:
		// typeof null does not produce 'null'. The case is included here in
		// the remote chance that this gets fixed someday.

		            return String(value);

		// If the type is 'object', we might be dealing with an object or an array or
		// null.

		        case 'object':

		// Due to a specification blunder in ECMAScript, typeof null is 'object',
		// so watch out for that case.

		            if (!value) {
		                return 'null';
		            }

		// Make an array to hold the partial results of stringifying this object value.

		            gap += indent;
		            partial = [];

		// Is the value an array?

		            if (Object.prototype.toString.apply(value) === '[object Array]') {

		// The value is an array. Stringify every element. Use null as a placeholder
		// for non-JSON values.

		                length = value.length;
		                for (i = 0; i < length; i += 1) {
		                    partial[i] = str(i, value, dropQuotesOnKeys, quoteType) || 'null';
		                }

		// Join all of the elements together, separated with commas, and wrap them in
		// brackets.

		                v = partial.length === 0
		                    ? '[]'
		                    : gap
		                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
		                    : '[' + partial.join(',') + ']';
		                gap = mind;
		                return v;
		            }

		// If the replacer is an array, use it to select the members to be stringified.

		            if (rep && typeof rep === 'object') {
		                length = rep.length;
		                for (i = 0; i < length; i += 1) {
		                    if (typeof rep[i] === 'string') {
		                        k = rep[i];
		                        v = str(k, value, dropQuotesOnKeys, quoteType);
		                        if (v) {
		                            partial.push((dropQuotesOnKeys ? condQuoteKey(k, quoteType) : quote(k, quoteType)) + (gap ? ': ' : ':') + v);
		                        }
		                    }
		                }
		            } else {

		// Otherwise, iterate through all of the keys in the object.

		                for (k in value) {
		                    if (Object.prototype.hasOwnProperty.call(value, k)) {
		                        v = str(k, value, dropQuotesOnKeys, quoteType);
		                        if (v) {
		                            partial.push((dropQuotesOnKeys ? condQuoteKey(k, quoteType) : quote(k, quoteType)) + (gap ? ': ' : ':') + v);
		                        }
		                    }
		                }
		            }

		// Join all of the member texts together, separated with commas,
		// and wrap them in braces.

		            v = partial.length === 0
		                ? '{}'
		                : gap
		                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
		                : '{' + partial.join(',') + '}';
		            gap = mind;
		            return v;
		        }
		    }

		// If the JSON object does not yet have a stringify method, give it one.

		    if (typeof JSON2_mod.stringify !== 'function') {
		        JSON2_mod.stringify = function (value, replacer, space, dropQuotesOnKeys, quoteType) {

		// The stringify method takes a value and an optional replacer, and an optional
		// space parameter, and returns a JSON text. The replacer can be a function
		// that can replace values, or an array of strings that will select the keys.
		// A default replacer method can be provided. Use of the space parameter can
		// produce text that is more easily readable.

		            var i;
		            gap = '';
		            indent = '';

		// If the space parameter is a number, make an indent string containing that
		// many spaces.

		            if (typeof space === 'number') {
		                for (i = 0; i < space; i += 1) {
		                    indent += ' ';
		                }

		// If the space parameter is a string, it will be used as the indent string.

		            } else if (typeof space === 'string') {
		                indent = space;
		            }

		// If there is a replacer, it must be a function or an array.
		// Otherwise, throw an error.

		            rep = replacer;
		            if (replacer && typeof replacer !== 'function' &&
		                    (typeof replacer !== 'object' ||
		                    typeof replacer.length !== 'number')) {
		                throw new Error('JSON.stringify');
		            }

		// Make a fake root object containing our value under the key of ''.
		// Return the result of stringifying the value.

		            return str('', {'': value}, dropQuotesOnKeys, quoteType);
		        };
		    }


		// If the JSON object does not yet have a parse method, give it one.

		    if (typeof JSON2_mod.parse !== 'function') {
		        JSON2_mod.parse = function (text, reviver) {

		// The parse method takes a text and an optional reviver function, and returns
		// a JavaScript value if the text is a valid JSON text.

		            var j;

		            function walk(holder, key) {

		// The walk method is used to recursively walk the resulting structure so
		// that modifications can be made.

		                var k, v, value = holder[key];
		                if (value && typeof value === 'object') {
		                    for (k in value) {
		                        if (Object.prototype.hasOwnProperty.call(value, k)) {
		                            v = walk(value, k);
		                            if (v !== undefined) {
		                                value[k] = v;
		                            } else {
		                                delete value[k];
		                            }
		                        }
		                    }
		                }
		                return reviver.call(holder, key, value);
		            }


		// Parsing happens in four stages. In the first stage, we replace certain
		// Unicode characters with escape sequences. JavaScript handles many characters
		// incorrectly, either silently deleting them, or treating them as line endings.

		            text = String(text);
		            cx.lastIndex = 0;
		            if (cx.test(text)) {
		                text = text.replace(cx, function (a) {
		                    return '\\u' +
		                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		                });
		            }

		// In the second stage, we run the text against regular expressions that look
		// for non-JSON patterns. We are especially concerned with '()' and 'new'
		// because they can cause invocation, and '=' because it can cause mutation.
		// But just to be safe, we want to reject all unexpected forms.

		// We split the second stage into 4 regexp operations in order to work around
		// crippling inefficiencies in IE's and Safari's regexp engines. First we
		// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
		// replace all simple value tokens with ']' characters. Third, we delete all
		// open brackets that follow a colon or comma or that begin the text. Finally,
		// we look to see that the remaining characters are only whitespace or ']' or
		// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

		            if (/^[\],:{}\s]*$/
		                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
		                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
		                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

		// In the third stage we use the eval function to compile the text into a
		// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
		// in JavaScript: it can begin a block or an object literal. We wrap the text
		// in parens to eliminate the ambiguity.

		                j = eval('(' + text + ')');

		// In the optional fourth stage, we recursively walk the new structure, passing
		// each name/value pair to a reviver function for possible transformation.

		                return typeof reviver === 'function'
		                    ? walk({'': j}, '')
		                    : j;
		            }

		// If the text is not JSON parseable, then a SyntaxError is thrown.

		            throw new SyntaxError('JSON.parse');
		        };
		    }

		    // CommonJS or Browser
		    {
		        if (module.exports) {
		            exports = module.exports = JSON2_mod;
		        }
		        exports.JSON2_mod = JSON2_mod;
		    }

		}.call(commonjsGlobal)); 
	} (json2Mod, json2Mod.exports));
	return json2Mod.exports;
}

json_beautifier$1.exports;

(function (module, exports) {
	(function() {
	  /**
	   *
	   * CSVJSON.json_beautifier(object, options)
	   *
	   * Parses, validates, beautifies and formats JSON. Returns a JSON string.
	   *
	   * Available options:
	   *  - space: The number of spaces to indent. Default is 2.
	   *  - quoteType: You can change double quotes to single quotes (') if you
	   *           like to. Will make for invalid JSON but valid Javascript.
	   *           Default is (").
	   *  - dropQuotesOnKeys: JSON wraps keys with double quotes by default.
	   *           Javascript doesn't need them though. Set to true to drop them.
	   *           Will make for invalid JSON but valid Javascript. Default is false.
	   *  - dropQuotesOnNumbers: Set to true to parse number values and drop quotes
	   *           around them. Default is false.
	   *  - inlineShortArrays: Set to true to collpase arrays inline if less than 80
	   *           characters. You can also set to an arbitrary number such as 160 to
	   *           change the width. Default is `false`.
	   *  - inlineShortArraysDepth: If you turned on the above option, your can limit
	   *           the nesting depth. Default is 1.
	   *  - minify: Set to `true` to simply compact the JSON. Removes indentations and
	   *           new lines. Default is `false`.
	   *
	   * Dependencies:
	   *  - json2-mod.js https://github.com/martindrapeau/json2-mod
	   *
	   * Copyright (c) 2014-2019 Martin Drapeau
	   *
	   */
	  
	  // Recursively walk an object to convert strings that are numbers
	  // to pure integers or floats.
	  function walkObjectAndDropQuotesOnNumbers(object) {
	    if (!isObject(object)) return;
	    var keys = Object.keys(object);
	    if (!keys) return;

	    keys.forEach(function(key) {
	      var value = object[key];
	      if (typeof value == 'string') {
	        var number = value - 0;
	        object[key] = isNaN(number) ? value : number;
	      } else if (isObject(value) || Array.isArray(value)) {
	        walkObjectAndDropQuotesOnNumbers(value);
	      }
	    });
	  }

	  function isObject(o) {
	    return o && typeof o == 'object';
	  }
	  
	  // Collapses arrays inline when they fit inside the specified width 
	  // in characters (including indentation).
	  function inlineShortArraysInResult(result, width) {
	    width || (width = 80);
	    if (typeof width != 'number' || width < 20) {
	      throw "Invalid width '" + width + "'. Expecting number equal or larger than 20."
	    }
	    var list = result.split('\n'),
	        i = 0,
	        start = null,
	        content = [];
	    while (i < list.length) {
	      var startMatch = !!list[i].match(/\[/),
	          endMatch = !!list[i].match(/\],?/);

	      if (startMatch && !endMatch) {
	        content = [list[i]];
	        start = i;
	      } else if (endMatch && !startMatch && start) {
	        content.push((list[i]||'').trim());
	        var inline = content.join(' ');
	        if (inline.length < width) {
	          list.splice(start, i-start+1, inline);
	          i = start;
	        }
	        start = null;
	        content = [];
	      } else {
	        if (start) content.push((list[i]||'').trim());
	      }
	      i += 1;
	    }
	    return list.join('\n');
	  }
	  
	  function convert(object, options) {
	    var space = options.space || 2,
	        dropQuotesOnKeys = options.dropQuotesOnKeys || false,
	        dropQuotesOnNumbers = options.dropQuotesOnNumbers || false,
	        inlineShortArrays = options.inlineShortArrays || false,
	        inlineShortArraysDepth = options.inlineShortArraysDepth || 1,
	        quoteType = options.quoteType || 'double',
	        minify = options.minify || false;

	    if (dropQuotesOnNumbers) walkObjectAndDropQuotesOnNumbers(object);
	    
	    var result = JSON2_mod.stringify(object, null, minify ? undefined : space, dropQuotesOnKeys, quoteType);
	    if (inlineShortArrays && !minify) {
	      var newResult = inlineShortArraysInResult(result);
	      if (inlineShortArraysDepth > 1) {
	        for (var i = 1; i < inlineShortArraysDepth; i++) {
	          result = newResult;
	          newResult = inlineShortArraysInResult(result);
	          if (newResult == result) break;
	        }
	      }
	      result = newResult;
	    }
	    
	    return result;
	  }
	  // CommonJS or Browser
	  var JSON2_mod;
	  {
	      if (module.exports) {
	          exports = module.exports = convert;
	      }
	      JSON2_mod = requireJson2Mod();
	      exports.json_beautifier = convert;
	  }
	  
	}).call(commonjsGlobal); 
} (json_beautifier$1, json_beautifier$1.exports));

var json_beautifierExports = json_beautifier$1.exports;

//@ts-check

const { default: changeLog } = sources;
const {execSync} = require$$1__default["default"];


const json_beautifier = json_beautifierExports;



if (process.argv.indexOf('--config')) {

    const fs = require$$0__default["default"];
    const path = require$$2__default["default"];

    const PACKAGE_PATH = path.join(process.cwd(), 'package.json');        
    const packageInfo = JSON.parse(fs.readFileSync(PACKAGE_PATH).toString());

    if (!packageInfo?.scripts['changelog']) packageInfo.scripts['changelog'] = "changelog";
    if (!packageInfo['simple-git-hooks']) {
        packageInfo['simple-git-hooks'] = { "pre-push": "npm run changelog" };
    }
    const json = json_beautifier(packageInfo, { dropQuotesOnNumbers: true, inlineShortArrays: true });
    // fs.writeFileSync(PACKAGE_PATH, JSON.stringify(packageInfo))
    fs.writeFileSync(PACKAGE_PATH, json);

    const gitConfigured = execSync('git config core.hooksPath .git/hooks/').toString();
    console.log(gitConfigured);

    const hooksConfigured = execSync('npx simple-git-hooks').toString();
    console.log(hooksConfigured);
}
else {
    const filters = process.argv.filter(w => w.startsWith('--filter='));
    if (!filters.length) changeLog();
    else {
        changeLog(filters.map(w => new RegExp(w.slice(9))));
    }
}

module.exports = bin;
