# dict

Just having a little fun making a Python dict in JavaScript. 


# API 
Python dict [API](https://docs.python.org/3.3/library/stdtypes.html#mapping-types-dict)


## dict([, obj])

Returns a dictionary object. It is not necessary to use the `new` keyword.  The object returned works like a normal object. Properties may be added or deleted just like a normal object. 

### obj

Optional: `true`

Type: `Object|Array`


```Javascript
var dict = require('dict');
var person = dict();

person.name = 'John';
person.keys(); // ['name']

var cat = dict({ 'name': 'Lola', 'gender': 'female' });
console.log(cat); // { 'name': 'Lola', 'gender': 'female' }
```

A multidimensional array may be passed, but only two items may be passed per inner array. The first item in the array becomes the key and the second becomes the value. Having more or less than 2 items in the array will cause an error to be thrown. 

```javascript

dict([['name', 'John'], ['age', 20]]); // { name: 'John' }
dict([[undefined, null]]); // { 'undefined': null }

// ValueError: dictionary update sequence element #0 has length 1; 2 is required
dict([['name']]); 

// ValueError: dictionary update sequence element #0 has length 3; 2 is required
dict([['name', 'age', 'gender']]); 
```

Passing an array of objects doesn't really work properly. I don't know which key is supposed to be the value. For example, my version does this:

```Javascript
dict([{ 'age': 20, 'name': 'John' }]); // { name: 'age' }
dict([{ 'apple': 1, 'carrot': 2 }]); // { carrot: 'apple' }
```

Python does this:

```python
dict([{ 'age': 20, 'name': 'John' }]); // {'name': 'age'}
dict([{ 'apple': 1, 'carrot': 2 }]) // {'apple': 'carrot'}
```


<br>


### dict.clear()

Deletes all the keys of off the object. There really isn't a point to the clear function when you can just make a new object. Also, I've read in multiple places that using the delete operator is not a good practice because it makes the object "slow". 

```Javascript
var person = dict({ name: 'John', age: 20 });

person.clear(); 
console.log(person); // {}

// or just create a new dict
person = dict(); // {}
```


<br>


### dict.get(key, [, default=undefined])

Gets and returns the value associated with the key if the object owns the key. If the object owns the key, but the value associated with the key is `undefined`, then the key is still considered to exist and `undefined` will be returned.

```Javascript
var person = dict({ name: undefined, age: 20 });
person.get('name', 'John'); // undefined
person.get('age'); // 20
person.get('favoriteFoods', []); // []
```


<br>


### dict.items()

Returns a multi-dimensional array of key and value pairs. 

```Javascript
var d = dict({ name: 'John', age: 20 });
var items = d.items(); // [['name', 'John'], ['age', 20]]
```


<br>


### dict.values()

Return all the values from each property in the object as an array. 

```Javascript
var d = dict({ name: 'John', age: 20 });
var values = d.values(); // ['John', 20 ]
```


<br>


### dict.keys()

An alias for `Object.keys` which returns the keys the object owns. 

```Javascript
var d = dict({ name: 'John', age: 20 });
var keys = d.keys(); // ['name', 'age']
```


<br>


### dict.pop(key, default)

Removes the specified key and returns the value. If the key does not exist, the default value passed is returned. If the key does not exist in the object and the default value is not passed, a KeyError is thrown. 

```Javascript
var d = dict({ name: 'John', age: 20 });
d.pop('name'); // 'John' 
d.pop('favoriteFoods', []); // []
d.pop('favoriteFoods'); // KeyError
```


<br>


### dict.popitem()

An arbitrary key is removed from the object and an array of the key and value is returned. 

```Javascript
var d = dict({ name: 'John', age: 20 });
d.popitem(); // ['name', 'John']
d.popitem(); // ['age', 20]
d.popitem(); // KeyError 
```


<br>


### dict.setdefault(key, [, default=undefined])

If the object owns the key, the value associated with the key is returned. If the object doesn't own the key, the key value to the `default` 

```Javascript
var person = dict({ name: 'John', age: 20 });
var name = person.setdefault('name', 'Jim'); // 
console.log(person.name); // 'John'

var greeting = person.setdefault('greeting', 'hello');
console.log(person.greeting, greeting); // 'hello'

person = dict();
person.setdefault('farewell');
console.log(person); // { 'farewell': undefined }
```


<br>


### dict.update(value)

Adds properties to the object from the value passed. The arguments are the same as the `dict` function arguments.

#### value

Type: `Object`|`Array`

```Javascript
var a = dict(); // {}
a.update({ 'name': 'John' }); // { 'name': 'John'} 
a.update([['age', 20]]); // { 'name': 'John', 'age': 20 } 
```


<br>


### dict.copy()

Returns a shallow copy of the dict. 

```Javascript
var a = dict({ name: 'John', age: 20, children: ['James'] })
var b = a.copy(); 

console.log(a === b) // false
console.log(a.children === b.children) // true
```


<br>


### dict.fromkeys(iterable, value)

A "static method" that creates a dictionary with keys from an iterable and assigns a single value to each key. 

#### iterable

Type: `Array`|`Object`|`String` 

#### value

Type: `*`


```Javascript
var d = dict.fromkeys([1,2,3], [])
console.log(d); // { 1: [], 2: [], 3: [] }
console.log(d[1] === d[2]) // All keys point to the same array 

dict.fromkeys('hey', 1); // { 'h': 1, 'e': 1, 'y': 1 }
dict.fromkeys({ name: 'John' }, 1); // { name: 1 }
```