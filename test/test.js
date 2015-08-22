var utils = require('./../utils.js');
var dict = require('./../index');
var len = dict.len;

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('isIterable', function () {
	var isIterable = utils.isIterable;

	it('Should return whether an value can be iterated', function () {
		expect(isIterable(''),        String).to.be.true;
		expect(isIterable({}),        Object).to.be.true;
		expect(isIterable([]),        Array).to.be.true;
		expect(isIterable(null),      null).to.be.false;
		expect(isIterable(undefined), undefined).to.be.false;
		expect(isIterable(false),     false).to.be.false;
		expect(isIterable(true),      true).to.be.false;
		expect(isIterable(NaN),       NaN).to.be.false;
		expect(isIterable(Infinity),  Infinity).to.be.false;
	});
});

describe('isArrayLike', function () {
	var isArrayLike = utils.isArrayLike;

	it('Should return whether an value can be iterated', function () {
		expect(isArrayLike(''),                  String).to.be.true;
		expect(isArrayLike([]),                  Array).to.be.true;
		expect(isArrayLike({ 0: 0, length: 1 }), Object).to.be.true;

		expect(isArrayLike({ 0: 0 }),            Object).to.be.false;
		expect(isArrayLike({}),                  Object).to.be.false;
		expect(isArrayLike(null),                null).to.be.false;
		expect(isArrayLike(undefined),           undefined).to.be.false;
		expect(isArrayLike(false),               false).to.be.false;
		expect(isArrayLike(true),                true).to.be.false;
		expect(isArrayLike(NaN),                 NaN).to.be.false;
		expect(isArrayLike(Infinity),            Infinity).to.be.false;
	});
});

describe('dict', function () {
	var dictionary;

	var AGE = 20;
	var ID = 1;
	var NAME = 'John';

	var AGE_KEY = 'age';
	var ID_KEY = 'id';
	var NAME_KEY = 'name';


	afterEach(function () {

		dictionary = null;

	});

	beforeEach(function () {
		dictionary = dict({ 'name': 'John', 'id': 1, 'age': 20 });
	});

	it('Should be defined as an function', function () {
		expect(dict).to.be.a('function')
	});

	it('Should return a dictionary object', function () {
		expect(dict()).to.be.a('object');
	});

	it('Should not throw an error when passed an iterable that contains no items', function () {
		expect(function () {
			dict('');
			dict([]);
		}).to.not.throw;
	});

	it('Should return an object containing keys of the objects in the array passed', function () {
		expect(
			dict([{ 'name': 'John', 'age': 20 }])
		).to.have.property('name', 'age');
	});

	it('Should return an object with the key and properties of the array contained within the array passed', function () {
		expect(
			dict(['hi'])
		).to.have.property('h', 'i');
		expect(
			dict([[1,2]])
		).to.have.property('1', 2);
	});

	it('Should throw an error when passed an array that contains non-iterables', function () {
		expect(function () {
			dict([null]); //
		}).to.throw(/cannot convert dictionary sequence element #\d to a sequence/)
	});

	it('Should throw an error when passed an array that only contains an iterable containing one item', function () {
		expect(function () {
			dict([['name']]);
		}).to.throw(/dictionary update sequence element \#\d has length \d; 2 is required/)

		expect(function () {
			dict([[null]]);
		}).to.throw(/dictionary update sequence element #\d has length \d; 2 is required/)
	});

	it('Should throw an error when passed an object with more than three own properties', function () {
		expect(function () {
			dict([{'name': 'Johnny', 'age': 20, 'likes': ['oranges']}]);
		}).to.throw(/dictionary update sequence element #\d has length \d; 2 is required/)
	});

	describe('#clear', function () {

		it('Should clear all keys in the object', function () {
			dictionary.clear();
			expect(dictionary)
				.to.not.include.keys(NAME_KEY, ID_KEY, AGE_KEY)
		});

	});

	describe('#get', function () {

		it('Should return an item from the object by key', function () {
			var value = dictionary.get(AGE_KEY);
			expect(value)
				.to.equal(AGE)
		});

		it('Should return a default item from the objec if the key does not exist', function () {
			var defaultValue = [];
			var value = dictionary.get('nope', defaultValue);

			expect(value)
				.to.equal(defaultValue);

		});

	});

	describe('#items', function () {

		it('Should return a list of lists containing the key and values contained within the object', function () {
			var items = dictionary.items();

			expect(items)
				.to.be.a('array')
				.with.deep.property('[0]')
				.to.be.a('array')
				.to.include(NAME_KEY)
				.to.include(NAME)

			expect(items)
				.to.be.a('array')
				.with.deep.property('[1]')
				.to.be.a('array')
				.to.include(ID_KEY)
				.to.include(ID)

			expect(items)
				.to.be.a('array')
				.with.deep.property('[2]')
				.to.be.a('array')
				.to.include(AGE_KEY)
				.to.include(AGE)

		});

	});

	describe('#values', function () {

		it('Should return an array of values in the dictionary', function () {

			var values = dictionary.values();

			expect(values)
				.to.be.a('array')
				.to.include(NAME)
				.to.include(AGE)
				.to.include(ID)

		});

	});

	describe('#keys', function () {

		it('Should return the keys of an object as an Array', function () {

			var keys = dictionary.keys();

			expect(keys)
				.to.be.a('array')
				.to.include(AGE_KEY)
				.to.include(ID_KEY)
				.to.include(NAME_KEY)

		});

	});

	describe('#pop', function () {

		it('Should remove an item from the dictionary by key', function () {

			dictionary.pop('age');
			expect(dictionary)
				.to.be.a('object')
				.to.not.include.keys(AGE_KEY)

		});

		it('Should throw an error if the key does not exist and default value is not passed ', function () {

			expect(dictionary.pop.bind(this, 'nope'))
				.to.throw(/KeyError/)

		});

		it('Should return the default value passed if the key does not exist', function () {
			var defaultValue = [];
			var value = dictionary.pop('nope', defaultValue);

			expect(value)
				.to.equal(defaultValue)

		});

		it('Should not pop any key from its prototype', function () {
			var defaultValue = [];
			var value = dictionary.pop('clear', defaultValue);

			expect(value)
				.to.equal(defaultValue)

		});

	});

	describe('#popitem', function () {

		it('Should remove a key from the object and return an array of the key and value', function () {

			var value = dictionary.popitem();
			expect(value)
				.to.be.a('array')

		});

		it('Should throw an error when there are no more keys to pop', function () {

			dictionary.popitem();
			dictionary.popitem();
			dictionary.popitem();

			expect(dictionary.popitem.bind(dictionary))
				.to.throw(/dictionary is empty/);

		});

	});

	describe('#setdefault', function () {

		it('Should return the key\'s value if the value is already defined', function () {

			var defaultValue = 123;
			var value = dictionary.setdefault(AGE_KEY, defaultValue)

			expect(value)
				.to.equal(AGE)
				.to.not.equal(defaultValue)

		});

		it('Should return the default value passed if the key does not exist', function () {

			var defaultValue = 123;
			var value = dictionary.setdefault('nope', defaultValue);

			expect(value)
				.to.equal(defaultValue);

		});

		it('Should set the key to the default value if the key does not exist', function () {

			var defaultValue = 123;
			var value = dictionary.setdefault('nope', defaultValue);

			expect(dictionary)
				.to.have.property('nope')
				.to.equal(defaultValue);

		});

	});

	describe('#update', function () {

		it('Should merge the items of the object passed into the dictionary', function () {

			var obj = { 'gender': 'male' };

			dictionary.update(obj);

			expect(dictionary)
				.to.be.a('object')
				.to.include.keys('gender')

		});

	});

	describe('#copy', function () {

		it('Should return a shallow copy of the dictionary called on', function () {

			var copy = dictionary.copy();

			expect(copy)
				.to.be.a('object')
				.to.include.keys(NAME_KEY, AGE_KEY, ID_KEY)

		});

	});

	describe('#fromkeys', function () {

		it('Should return a dict where each key is a value from the array passed and each key points the second argument passed', function () {

			var value = 1;
			var d = dictionary.fromkeys([1,2,3], value);
			expect(d).to.have.property('1', value)
			expect(d).to.have.property('2', value)
			expect(d).to.have.property('3', value)

		});

		it('Should return a dict where each key is a key of the object passed', function () {

			var value = [];
			var d = dictionary.fromkeys({'one': 1, 'two': 2, 'three': 3}, value);

			expect(d).to.have.property('one', value)
			expect(d).to.have.property('two', value)
			expect(d).to.have.property('three', value)

		});

		it('Should return a dict where each key is a key of the object passed', function () {

			var value = [];
			var d = dictionary.fromkeys('letters', value);

			expect(d).to.have.property('l', value)
			expect(d).to.have.property('e', value)
			expect(d).to.have.property('t', value)
			expect(d).to.have.property('t', value)
			expect(d).to.have.property('e', value)
			expect(d).to.have.property('r', value)
			expect(d).to.have.property('s', value)
		});

	});

});