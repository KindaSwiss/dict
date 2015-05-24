
var util = require('util');
var utils = require('./utils');

var owns             = utils.owns;
var ArrayHas         = utils.ArrayHas;
var ArrayHasItems    = utils.ArrayHasItems;
var ArrayRemove      = utils.ArrayRemove;
var ArrayRemoveItems = utils.ArrayRemoveItems;
var ObjectWalk       = utils.ObjectWalk;
var getIndex         = utils.getIndex;
var getType          = utils.getType;
var extend           = utils.extend;
var all              = utils.all;
var any              = utils.any;
var isNumber         = utils.isNumber;
var isObject         = utils.isObject;
var isLength         = utils.isLength;
var isIterable       = utils.isIterable;
var isArrayLike      = utils.isArrayLike;
var iterator         = utils.iterator;
var len              = utils.len;




var KeyError = function(message) {
	this.name = 'KeyError';
	this.message = message;
};
KeyError.prototype = Object.create(Error.prototype);
KeyError.prototype.constructor = KeyError;




var ValueError = function(message) {
	this.name = 'ValueError';
	this.message = message;
};
ValueError.prototype = Object.create(Error.prototype);
ValueError.prototype.constructor = ValueError;




/**
 * Sort a an array of strings 
 * 
 * @param  {String} a 
 * @param  {String} b
 */
var reverseAlphabet = function (a, b) {
	return b.charCodeAt() - a.charCodeAt()
};




var DictProto = {
	/**
	 * Delete all keys that the object owns
	 * 
	 * @return {void}
	 */
	clear: function clear() {
		var keys = Object.keys(this);

		for (var i = 0; i < keys.length; i++) {
			delete this[keys[i]];
		}
	},




	/**
	 * Get and return the value associated with the key. 
	 * If the key does not exist in the object, return the 
	 * default value passed. Undefined properties are still 
	 * considered defined and will be returned. 
	 * 
	 * @param  {String}   key
	 * @param  {*}        default
	 * @return {Property}
	 */
	get: function get(key, defaultValue) {
		if (owns(this, key)) {
			return this[key];
		}
		return defaultValue;
	},




	/**
	 * Return a mapping of the keys and values 
	 * 
	 * @return {Array}
	 */
	items: function items() {
		var result = [];

		ObjectWalk(this, function(key, value) {
			result.push([key, value])
		}, null, false);

		return result;
	},




	/**
	 * Return an array of all the items in the dictionary 
	 * 
	 * @return {Array}
	 */
	values: function values() {
		var result = [];

		ObjectWalk(this, function (key, value) {
			result.push(value);
		}, null , false);

		return result;
	},




	/**
	 * Return the keys of an object. 
	 * 
	 * @return {Array}
	 */
	keys: function keys() {
		return Object.keys(this);
	},




	/**
	 * Remove a key from the object and return the value of the key. 
	 * If the key does not exist and the default value is not passed, raise an error. 
	 * 
	 * @param  {String} key
	 * @param  {*}    defaultValue
	 */
	pop: function pop(key, defaultValue) {
		var value;

		if (owns(this, key)) {
			value = this[key];
			delete this[key];
			return value;
		}
		else if (typeof defaultValue === 'undefined') {
			throw new Error('KeyError: ' + key)
		}

		return defaultValue;
	},




	/**
	 * Pop an arbitrary key and return the key and value as an array.
	 * If the dictionary is empty, throw an error. 
	 * 
	 * @return {void}
	 */
	popitem: function popitem() {

		// Loop through the keys in this. 
		for (var key in this) {
			if ( ! owns(this, key)) {
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
	 * 
	 * If the value exists, return the value
	 * Else if the value does not exist, set the key to the default value 
	 * 
	 * @param  {String} key         
	 * @param  {*}    defaultValue
	 * @return {*}             
	 */
	setdefault: function setdefault(key, defaultValue) {
		var value;

		if (owns(this, key)) {
			value = this[key];
		}
		else {
			this[key] = defaultValue;
			value = defaultValue;
		}
		return value;
	},




	/**
	 * Merge the properties of the source object in to `this` 
	 * 
	 * @param  {Object} source 
	 * @return {this} 
	 */
	update: function update(value) {
		var err;
				// 	err = new ValueError('dictionary update sequence element #' + index + ' has length');

		if (value === undefined) {
			return;
		}

		if ( ! isIterable(value)) {
			err = new TypeError(getType(value) + ' is not iterable');
			throw err;
		}

		var isArray = isArrayLike(value),
			index = 0,
			length = value.length;

		if (isArray) {
			
			if (length === 0) {
				return;
			}

			// Add properties to the dictionary using the first and second elements 
			// of each array contained within the array passed
			for (; index < length; index++) {
				var v = value[index];

				if (v === undefined || v === null) {
					err = new TypeError('cannot convert dictionary sequence element #' + index + ' to a sequence');
					throw err;
				}

				var it = iterator(v, true);
				if (it.length < 2 || it.length > 2) {
					err = new ValueError('dictionary update sequence element #' + index + ' has length ' + it.length + '; 2 is required');
					throw err;
				}

				// ? if the array contains an object with two keys, which key 
				// becomes the key and which becomes the value? 

				// They seem to be compared by char code 
				var values = [it.next().value, it.next().value]

				if ( ! isArrayLike(v)) {
					values.sort(reverseAlphabet);
				}
				
				var key = values[0];
				var keyValue = values[1];
				
				this[key] = keyValue;
			}
		}
		else {
			extend(this, value);
		}
	},




	/**
	 * Return a shallow copy of the `this`
	 * 
	 * @return {dict}
	 */
	copy: function copy() {
		var result = dict();

		extend(result, this);

		return result;
	},




	/**
	 * Create a new dict from a collection or object 
	 
	 * @static
	 * @return {dict}
	 */
	fromkeys: function fromkeys(keys, prop) {
		// If keys is an array, each value in the array 
		// 		will become a key in the dict
		// Else if `keys` is an object, the keys in the 
		// 		object will be used as the keys in the new dict
		var i = iterator(keys, true);
		var result = dict();

		while ( ! (next = i.next()).done) {
			result[next.value] = prop;
		}

		return result;
	},
};




/**
 * Returns a "dictionary" 
 * 
 * @param  {Object|Array<Array>} obj
 * @return {dict}
 */
var dict_update = {};

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




module.exports.dict = dict;
module.exports.len = len;



