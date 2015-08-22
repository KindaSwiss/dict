'use strict';

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if value is a valid length of an array-like object
 * https://github.com/lodash/lodash/blob/master/lodash.js#L4130
 *
 * @param  {*}       value
 * @return {Boolean}
 */
function isLength(value) {
	return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
};

/**
 * Returns true if the value passed is array like.
 * @param  {*}       value
 * @return {Boolean}
 */
function isArrayLike(value) {
	return value !== undefined && value !== null && isLength(value.length);
};

/**
 * Returns the type of the value
 * @param  {*}      value
 * @return {String}
 */
function getType(value) {
	return Object.prototype.toString.call(value);
};

/**
 * Returns true if the value is an object, function, or
 * is array like.
 * @param  {*}       value
 * @return {Boolean}
 */
function isIterable(value) {
	var isValueAnObject = typeof value === 'object' && !! value || typeof value === 'function';

	if (isValueAnObject || isArrayLike(value)) {
		return true;
	}

	return false;
};

/**
 * Return an iterable that iterates over the keys of
 * an object, the characters in a string, and the items
 * in an array. If the value is not iterable, an error
 * is thrown.
 * @param  {*}        value
 * @return {Iterator}
 */
var iteratorLengthDescriptor = {};
function iterate(value) {
	var err;

	if ( ! isIterable(value)) {
		err = TypeError(getType(value) + ' is not iterable');
		throw err;
	}

	var isArray = isArrayLike(value);
	var items = (isArray) ? Array.prototype.slice.call(value, 0) : Object.keys(value);
	var index = 0;
	var length = items.length;

	var it = {
		next: function () {
			var result;
			var done = index >= items.length;

			result = {
				value: items[index],
				done: done,
				index: index,
			};
			index++;

			return result;
		}
	};

	iteratorLengthDescriptor.value = length;
	Object.defineProperty(it, 'length', iteratorLengthDescriptor);

	return it;
};

function assign(target) {
	'use strict';
	if (target === undefined || target === null) {
		throw new TypeError('Cannot convert first argument to object');
	}

	var to = Object(target);
	for (var i = 1; i < arguments.length; i++) {
		var nextSource = arguments[i];
		if (nextSource === undefined || nextSource === null) {
			continue;
		}
		nextSource = Object(nextSource);

		var keysArray = Object.keys(Object(nextSource));
		for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
			var nextKey = keysArray[nextIndex];
			var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
			if (desc !== undefined && desc.enumerable) {
				to[nextKey] = nextSource[nextKey];
			}
		}
	}
	return to;
}

module.exports = {
	assign:           assign,
	getType:          getType,
	isIterable:       isIterable,
	iterate:          iterate,
	isLength:         isLength,
	isArrayLike:      isArrayLike,
};