# dict

A basic Python dict in JavaScript. 


<br>


# API 
Python dict [API](https://docs.python.org/3.3/library/stdtypes.html#mapping-types-dict)



## dict([, obj])
Creates a dictionary object. It is not necessary to use the `new` keyword. The object returned works like a normal object in that properties may be added or deleted just like a normal object. 

#### obj

Optional: `true`

Type: `Object|Array`


```Javascript
var person = dict();

person.name = 'John';
person.keys(); // ['name']

delete person.name;
person.keys(); // []


var cat = dict({ 'name': 'Lola', 'gender': 'female' });
console.log(cat); // { 'name': 'Lola', 'gender': 'female' }


dict([['name', 'John']])          // { name: 'John' }
dict([[undefined, null]])         // { 'undefined': null }
dict([{ age: 20, name: 'John' }]) // { name: 'age' }
dict(['hi'])                      // { 'h': 'i' }


dict([['name']]); // ValueError: dictionary update sequence element #0 has length 1; 2 is required
dict([['name', 'age', 'gender']]); // ValueError: dictionary update sequence element #0 has length 3; 2 is required
dict([{ 'name': 'John', 'age': 20, 'gender': 'male' }]); // ValueError: dictionary update sequence element #0 has length 3; 2 is required

dict([null]) // TypeError: cannot convert dictionary sequence element #0 to a sequence
dict(1); // TypeError: [object Number] is not iterable 
```


<br>


### dict.clear()

Deletes all the keys of off the object. Even this this method exists, it is not recommended. I've read in multiple places that using the delete operator is not a good practice because it makes the object "slow". It is recommended to just use a completely new object. 

```Javascript
var person = dict({ name: 'John', age: 20 });

person.clear(); 
console.log(person); // {}

// or just create a new dict
person = dict(); // {}
```


<br>


### dict.get(key, [, default=undefined])

Gets and returns the value associated with the key if the object owns the key. If the object owns the key, but the value associated with the key is `undefined`, then the key is still considered to exist in the object and `undefined` will be returned.

```Javascript
var person = dict({ name: undefined, age: 20 });
var name = person.get('name', 'John'); // 'John'
var age = person.get('age'); // 20
var foods = person.get('favoriteFoods', []); // []
```


<br>


### dict.items()
Retrieve keys and values as an array of `key, value` pairs 

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

Removes a property from the object specified by `key` and returns the value. If the key does not exist, return default. If the key does not exist in the object and the default is not passed, a KeyError is thrown. 

```Javascript
var d = dict({ name: 'John', age: 20 });
d.pop('name'); // 'John' 
d.pop('favoriteFoods', []); // []
d.pop('favoriteFoods'); // KeyError
```


<br>




### dict.popitem()
A property is removed from the object and the key and value of the property are returned as an array. 

```Javascript
var d = dict({ name: 'John', age: 20 });
d.popitem(); // ['name', 'John']
d.popitem(); // ['age', 20]
d.popitem(); // KeyError 
```


<br>


### dict.setdefault(key, [, default=undefined])

If the object owns the key, the value associated with the key is returned. If the key does not exist, set the key's value to the `default` arg passed and return the `default` arg. `default` defaults to undefined. 

**Note:** A property set to `undefined` on an object is still said to exist. For example, `({ name: undefined }).hasOwnProperty('name')` will return `true`. By not defining a default value, the object will receive a property that is `undefined` and enumerable (it will show up in a for-in loop). 

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

Adds properties to the object from the value. The arguments are the same as the `dict` function arguments. 

#### value

Type: `Object`|`Array`

```Javascript
var a = dict(); // {}
a.update({ 'name': 'John' }); // { 'name': 'John'} 
a.update([['age', 20]]); // { 'name': 'John', 'age': 20 } 
```


<br>


### dict.copy()

Creates a shallow copy of the dict. 

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
console.log(d[1] === d[2]) // All arrays point to the same item 

d = dict.fromkeys('word', 1);
console.log(d); // { 'w': 1, 'o': 1, 'r': 1, 'd': 1 }

d = dict.fromkeys({ name: 'John' }, 1);
console.log(d); // { name: 1 }
```



# Other functions

### len(value)

Returns the length of an array, or the number of keys an object owns. 

#### value 

Type: `Array`|`Object`|`String`

```Javascript
console.log( len({ name: 'John', age: 20 }) ) // 2
console.log( len('letters') ) // 7 
console.log( len([1,2,3]) ) // 3 
console.log( len(1) ) // TypeError: [object Number] is not iterable 
```


<br>



