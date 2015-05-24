var ObjectPrototype = Object.prototype;
var call = Function.prototype.call;
var owns = call.bind(ObjectPrototype.hasOwnProperty);




/*
	NaN
	Infinity
	undefined
	null
	
	Object
	Function
	Boolean
	Symbol
	Error
	Number
	Date
	String
	RegExp
	Array
 */




/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;




/**
 * Determine whether the value is object 
 * can set properties onto the value)
 * @return {Boolean}
 */
var isObject = function (value) {
	return typeof value === 'function' || (typeof value === 'object' && !!value);
};




/**
 * Return whether an value is a number. 
 * 
 * @param  {*}     value
 * @return {Boolean} 
 */
var isNumber = function(value) {
	value = value - 0;
	return value === value && typeof value === 'number' && isFinite(value);
};




/**
 * Checks if value is a valid length of an array-like object 
 * https://github.com/lodash/lodash/blob/master/lodash.js#L4130
 * 
 * @param  {*}       value 
 * @return {Boolean} 
 */
var isLength = function isLength(value) {
	return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}




var isArrayLike = function isArrayLike(value) {
	return value !== undefined && value !== null && isLength(value.length)
};




/**
 * Get an positive index from a negative index 
 * 
 * @param  {Integer} index
 * @return {Integer} 
 */
var getIndex = function(index, length, bounds) {
	if (index < 0) {
		index = length + index;
	}
	if (bounds) {
		if (index > length) { index = length; }
		if (index < 0) { index = 0; }
	}
	return index;
};




/**
 * Check if an array contains an item. 
 *
 * If literal === `true`, use `===` else compare the properties 
 * or items the object contains. 
 * 
 * @param {Array}    array
 * @param {Booelean} item 
 * @param {Integer}  from
 * @param {Boolean}  literal
 */
var ArrayHas = function(array, item, from, literal) {
	array = Object(array);
	var length = parseInt(array.length, 10) || 0;
	
	if (length === 0) {
		return false;
	}
	
	var index = getIndex(parseInt(from, 10) || 0, length, true);

	while (index < length) {
		var current = array[index];
		if (item === current || item === NaN && current === NaN) {
			return true;
		}
		index++;
	}

	return false;
};




/**
 * Return whether an array contains all items passed. 
 * 
 * @param {Array}   array
 * @param {Boolean} items
 */
var ArrayHasItems = function(array, items, literal) {
	var i = 0;

	for (; i < items.length; i++) {
		var item = items[i];
		if ( ! ArrayHas(array, item, undefined, literal)) {
			return false;
		}
	}

	return true;
};




/**
 * Remove an item from an array. 
 * 
 * @param {Array} array 
 * @param {*}   item
 */
var ArrayRemove = function(array, item) {
	var index = array.length;

	while(index--) {
		if (array[index] === item) {
			array.splice(index, 1);
		}
	}

	return array;
};




var ArrayRemoveItems = function(array, items) {
	var i = 0;

	for (; i < items.length; i++) {
		ArrayRemove(array, items[i]);
	}
	
	return array;
};




/**
 * Walk over the own properties of an object 
 * 
 * @param {Object}   obj
 * @param {Function} callback
 * @param {Object}   thisArg
 */
var ObjectWalk = function(obj, callback, thisArg, call) {

	var O = Object(obj),
		index = 0,
		keys = Object.keys(O);

	// Walk over the keys 

	for (; index < keys.length; index++) {
		var name = keys[index];
		if ( ! call) {
			callback(name, O[name], index);
			continue;
		}
		callback.call(thisArg, name, O[name], index);
	}
};




/**
 * Merge the properties of the first source into the target 
 * 
 * @param  {Object} target
 * @param  {Object} firstSource 
 */
var extend = function(target, firstSource) {
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
};




/**
 * Retrieve the length of an object, string, or array 
 * @param  {Array|String|Object} value
 * @return {Integer}
 */
var len = function(value) {
	// Check if the value is iterable 
	if ( ! isIterable(value)) {
		var err = TypeError(getType(value) + ' has no len')
		throw err;
	}

	// If the value has a length, return it
	if (isNumber(value.length)) {
		length = value.length;
	}

	// Else if the value is an object, return the number of own properties 
	else if (typeof value === "object") {
		var length = 0;
		for (var key in value) {
			if ( ! owns(value, key)) { continue; }
			length++;
		}
	}

	return length;
};




var getType = function getType(value) {
	return Object.prototype.toString.call(value);
};




/**
 * Check if all items are truthy 
 * 
 * @param  {Array} items
 * @return {Boolean}     Whether all items in the array are truthy 
 */
var all = function(items) {
	var index = 0, 
		len = items.length;

	for (; index < len; index++) {
		if (!items[index]) { return false; }
	}

	return true;
};




/**
 * Check if all items are truthy 
 * 
 * @param  {Array} items
 * @return {Boolean}     Whether all items in the array are truthy 
 */
var any = function(items) {
	var index = 0, len = items.length;

	for (; index < len; index++) {
		if (items[index]) { return true; }
	}

	return false;
};




/**
 * If `value` is null, undefined, a number, Infinity, NaN, a boolean 
 * then return `false`. 
 * 
 * If `value` is an object and has a length property that is 
 * less than 0 return `false`. 
 * 
 * Else return true 
 * 
 * @param  {*}     value
 * @return {Boolean}
 */
var isIterable = function isIterable(value) {

	if (	value === undefined || value === null || 
			typeof value === 'number' || typeof value === 'boolean') {

		return false;
	}
	else if ( typeof value.length === 'number' && ! isLength(value.length)) {
		return false;
	}

	return true;
}; 




/**
 * Return an iterator that iterates over the `value` passed. 
 *
 * If the `value` is not iterable, throw a TypeError. 
 * 
 * If the `value` has a length property, then iterate over the 
 * `value` as if it is an array. 
 * 
 * Else if the `value` is an object, iterate over the keys the object owns  
 *
 * If `efficient` is `true` then reuse and return `iterator_result` instead
 * of creating a new object every time `next` is called. 
 * 
 * @param  {*}      value 
 * @param  {Boolean}  efficient 
 * @return {Iterator}  
 */

/**
 * An object to reuse in the case `efficient` === `true` 
 * @type {Object}
 */
var iterator_result = {};
var iterator_config = {};
var iterator = function iterator(value, efficient) {
	var err;

	if ( ! isIterable(value)) {
		err = TypeError(getType(value) + ' is not iterable');
		throw err;
	}

	// If the 

	var isArray = isArrayLike(value),
		items = (isArray) ? Array.prototype.slice.call(value, 0) : Object.keys(value),
		index = 0,
		length = items.length;

	var it = {
		next: function () {
			var result,
				done = index >= items.length;

			if (efficient) {
				iterator_result.value = items[index];
				iterator_result.done = done;
				iterator_result.index = index;
				result = iterator_result;
			}
			else {
				result = {
					value: items[index], 
					done: done, 
					index: index,
				};
			}
			
			index++;

			return result;
		},
		restart: function () {
			index = 0;
		},
	};
	
	iterator_config.value = length;
	Object.defineProperty(it, 'length', iterator_config);

	return it;
};




module.exports = {
	owns:             owns,
	isObject:         isObject,
	isNumber:         isNumber,
	ArrayHas:         ArrayHas,
	ArrayHasItems:    ArrayHasItems,
	ArrayRemove:      ArrayRemove,
	ArrayRemoveItems: ArrayRemoveItems,
	getIndex:         getIndex,
	ObjectWalk:       ObjectWalk,
	extend:           extend,
	len:              len,
	getType:          getType,
	all:              all,
	any:              any,
	isIterable:       isIterable,
	iterator:         iterator,
	isLength:         isLength,
	isArrayLike:      isArrayLike,
};





