# Simple-BiMap


A tiny implementation of a Bidirectional Map in JavaScript, using Proxies. Aim of the library is to allow for simple selection/deletion with basic JavaScript object operators, with fallback functions to assign objects and functions as keys.
Works with node v0.10+, although only fallback functions are available until v6+.

## usage
define `BiMap = require("./simple-bimap");` in Node.js or link to `simple-bimap.js` in the browser.

To use, just instantiate a new object:

```javascript
var bimap = newBiMap();
```


#### primitive values
To assign a property bidirectional, just assign the property regularly or use `_set()`:

```javascript
bimap.a = 3; // set via operator/Proxy

bimap._set("b", 4) // set via fallback function
```

To get a value, just fetch the value as usual or use the _get operator:
```javascript
console.log(bimap.a);          // "3"
console.log(bimap._get(3));    // "a"

console.log(bimap._get("b"));  // "4"
console.log(bimap[4]);         // "b"
```


#### advanced: functions and objects
You can *assign* functions and objects as values without issues:
```javascript
function get5(){ return 5 }

bimap.get5 = get5;

var someObj = {x:1, y:2};
bimap.someObj = someObj;

console.log(bimap.get5()); // 5
console.log(bimap.someObj.x); // 1
```

But since JavaScript converts attribute selectors to Strings (and objects as keys to the dreaded `"[object Object]"`), you have to use the fallback functions for setting/getting functions and objects as keys:
```javascript
function get10(){ return 2 * get5() }
function get20(){ return 4 * get5() }

//bimap[get10] = get20; //this does not work, get10 will not be a function
bimap._set(get10, get20); // this does

// functions work as selectors though
console.log(bimap[get10]()); // 20

// with objects, it's not that easy:
var anotherObj = {z:3};
var oneMoreObj = {w:4};
bimap._set(anotherObj, oneMoreObj);

// console.log(bimap.[anotherObj]);  // this is undefined
console.log(bimap._get(anotherObj));  // this works: "{ w: 4 }"
```

## test
run `node test.js` to test in the node version of your choice.