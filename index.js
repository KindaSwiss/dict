'use strict';

var utils = require('./utils');

var getType          = utils.getType;
var assign           = utils.assign;
var isLength         = utils.isLength;
var isIterable       = utils.isIterable;
var isArrayLike      = utils.isArrayLike;
var iterate          = utils.iterate;




function KeyError(message) {
	this.name = 'KeyError';
	this.message = message;
};
KeyError.prototype = Object.create(Error.prototype);
KeyError.prototype.constructor = KeyError;


function ValueError(message) {
	this.name = 'ValueError';
	this.message = message;
};
ValueError.prototype = Object.create(Error.prototype);
ValueError.prototype.constructor = ValueError;




var DictProto = {
	/**
	 * Delete all keys that the object owns.
	 * @return {void}
	 */
	clear: function clear() {
		var keys = Object.keys(this)
			.forEach(function (key) {
				delete this[key];
			}, this);
	},

	/**
	 * Returns the value associated with the key passed.
	 * If the key does not exist in the object, the default
	 * is returned. Keys with values that are undefined will
	 * return undefined.
	 * @param  {String}   key
	 * @param  {*}        default
	 * @return {Property}
	 */
	get: function get(key, defaultValue) {
		if (this.hasOwnProperty(key)) {
			return this[key];
		}

		return defaultValue;
	},

	/**
	 * Return a mapping of the keys and values
	 * @return {Array}
	 */
	items: function items() {
		var result = [];

		Object
			.keys(this)
			.forEach(function (key) {
				result.push([key, this[key]]);
			}, this);

		return result;
	},

	/**
	 * Return an array of all the items in the dictionary
	 * @return {Array}
	 */
	values: function values() {
		var result = [];

		Object
			.keys(this)
			.forEach(function (key) {
				result.push(this[key]);
			}, this);

		return result;
	},

	/**
	 * Return the keys of an object.
	 * @return {Array}
	 */
	keys: function keys() {
		return Object.keys(this);
	},

	/**
	 * Removes the specified key from the dict and returns
	 * the value for the key. If the key does not exist,
	 * and a default value is passed, the default value
	 * is returned. If the default value is not passed,
	 * an error is thrown.
	 * @param  {String} key
	 * @param  {*}    defaultValue
	 */
	pop: function pop(key, defaultValue) {
		var value;

		if (this.hasOwnProperty(key)) {
			value = this[key];
			delete this[key];
			return value;
		} else if (typeof defaultValue === 'undefined') {
			throw new Error('KeyError: ' + key);
		}

		return defaultValue;
	},

	/**
	 * Pop an arbitrary key and return the key and value
	 * as an array. If the dictionary is empty, an error
	 * is thrown.
	 * @return {void}
	 */
	popitem: function popitem() {
		for (var key in this) {
			if ( ! this.hasOwnProperty(key)) {
				key = undefined;
				continue;
			}

			break;
		}

		if (key === undefined) {
			throw new KeyError('popitem(): dictionary is empty');
		}

		var result = [key, this[key]];
		delete this[key];

		return result;
	},

	/**
	 * Set a key an return the value
	 * If the value exists, return the value
	 * Else if the value does not exist, set the key to the default value
	 * @param  {String} key
	 * @param  {*}    defaultValue
	 * @return {*}
	 */
	setdefault: function setdefault(key, defaultValue) {
		var result;

		if (this.hasOwnProperty(key)) {
			result = this[key];
		} else {
			this[key] = defaultValue;
			result = defaultValue;
		}

		return result;
	},

	/**
	 * Merge the properties of the source object into `this`
	 * @param  {Object} source
	 * @return {this}
	 */
	update: function update(value) {
		var err;

		if ( ! isIterable(value)) {
			err = new TypeError(getType(value) + ' is not iterable');
			throw err;
		}

		var index = 0;
		var length = value.length;

		// If the value passed is array like, such as
		// `dict([...])`, do the following
		if (isArrayLike(value)) {

			if (length === 0) {
				return;
			}

			// Add properties to the dictionary using the first and second elements
			// of each array contained within the array passed
			for (; index < length; index++) {
				var item = value[index];

				// The equivalent of passing `dict([None])`
				if (item === undefined || item === null) {
					err = new TypeError('cannot convert dictionary sequence element #' + index + ' to a sequence');
					throw err;
				}

				var iterable = iterate(item, true);
				if (iterable.length < 2 || iterable.length > 2) {
					err = new ValueError('dictionary update sequence element #' + index + ' has length ' + iterable.length + '; 2 is required');
					throw err;
				}

				// ? if the array contains an object with two keys, which key
				// becomes the key and which becomes the value?

				// They seem to be compared by char code
				var values = [iterable.next().value, iterable.next().value];

				if ( ! isArrayLike(item)) {
					values.sort(function (a, b) {
						return b.charCodeAt() - a.charCodeAt();
					});
				}

				var key = values[0];
				var keyValue = values[1];

				this[key] = keyValue;
			}
		}
		else {
			assign(this, value);
		}
	},

	/**
	 * Return a shallow copy of the `this`
	 *
	 * @return {dict}
	 */
	copy: function copy() {
		var result = dict();

		assign(result, this);

		return result;
	},

	/**
	 * Create a new dict from a collection or object
	 * @static
	 * @return {dict}
	 */
	fromkeys: function fromkeys(keys, prop) {
		// If keys is an array, each value in the array
		// will become a key in the dict

		// Else if `keys` is an object, the keys in the
		// object will be used as the keys in the new dict
		var i = iterate(keys, true);
		var result = dict();
		var next;

		while ( ! (next = i.next()).done) {
			result[next.value] = prop;
		}

		return result;
	},
};

/**
 * Returns a "dictionary"
 * @param  {Object|Array<Array>} obj
 * @return {dict}
 */
var dict = function (value) {
	var err, result = Object.create(DictProto);

	if (value === undefined || value === null) {
		return result;
	}

	if ( ! isIterable(value)) {
		err = new TypeError(getType(value) + ' is not iterable');
		throw err;
	}

	result.update(value);

	return result;
};




module.exports = dict;