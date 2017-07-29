var tests = {
    "Empty Init": function(bimap){
        return checkEmpty(bimap);
    },
    "creation of primitives via _set": function(bimap){
        bimap._set("a", 3);
        return (
            bimap._get("a") === 3 &&
            bimap._get(3) === "a" &&
            bimap._keys().length === 2
        );
    },
    "overwrite of primitives via _set": function(bimap){
        bimap._set("a", 3);
        bimap._set("a", 4);
        return (
            bimap._get("a") === 4 &&
            bimap._get(4) === "a" &&
            bimap._keys().length === 2
        );
    },
    "deletion of primitives via _del by key": function(bimap){
        bimap._set("a", 3);
        bimap._del("a");
        return bimap._keys.length === 0;
    },
    "deletion of primitives via _del by value": function(bimap){
        bimap._set("a", 3);
        bimap._del(3);
        return bimap._keys.length === 0;
    },
    "creation of function value via _set": function(bimap){
        function b(){return 3;}
        bimap._set("b", b);
        return (
            bimap._get(b) === "b" &&
            bimap.b() === 3 &&
            bimap._keys().length === 2
        );
    },
    "creation of function key via _set": function(bimap){
        function b(){return 3;}
        bimap._set(b, "b");
        return (
            bimap._get(b) === "b" &&
            bimap._get("b")() === 3 &&
            bimap._keys().length === 2
        );
    },
    "creation of function key and value via _set": function(bimap){
        function b1(){return 3;}
        function b2(){return 4;}
        bimap._set(b1, b2);
        return (
            bimap._get(b1)() === 4 &&
            bimap._get(b2)() === 3 &&
            bimap._keys().length === 2
        );
    },
    "deletion of function value via _del by key": function(bimap){
        function b(){return 3;}
        bimap._set("b", b);
        bimap._del("b");
        return bimap._keys.length === 0;
    },
    "deletion of function value via _del by value": function(bimap){
        function b(){return 3;}
        bimap._set("b", b);
        bimap._del(b);
        return bimap._keys.length === 0;
    },
    "creation of object value via _set": function(bimap){
        var c = {d:1, e:2};
        bimap._set("c", c);
        return (
            bimap._get(c) === "c" &&
            bimap._get("c").d + bimap._get("c").e === 3 &&
            bimap._keys().length === 2
        );
    },
    "creation of object key via _set": function(bimap){
        var c = {d:1, e:2};
        bimap._set(c, "c");
        return (
            bimap._get(c) === "c" &&
            bimap._get("c").d + bimap._get("c").e === 3 &&
            bimap._keys().length === 2
        );
    },
    "deletion of object value via _del by key": function(bimap){
        var c = {d:1, e:2};
        bimap._set("c", c);
        bimap._del("c");
        return bimap._keys.length === 0;
    },
    "deletion of object value via _del by value": function(bimap){
        var c = {d:1, e:2};
        bimap._set("c", c);
        bimap._del(c);
        return bimap._keys.length === 0;
    }
};

var proxyTests = {
    "creation of primitives via object operator": function(bimap){
        bimap.a = 3;
        return (
            bimap.a === 3 &&
            bimap[3] === "a" &&
            bimap._keys().length === 2
        );
    },
    "deletion of primitives via object operator, by key": function(bimap){
        bimap.a = 3;
        delete bimap.a;
        return bimap._keys.length === 0;
    },
    "deletion of primitives via object operator, by value": function(bimap){
        bimap.a = 3;
        delete bimap[3];
        return bimap._keys.length === 0;
    },
    "creation of function value via object operator": function(bimap){
        function b(){return 3;}
        bimap.b = b;
        return (
            bimap[b] === "b" &&
            bimap.b() === 3 &&
            bimap._keys().length === 2
        );
    },
    "creation of object value via object operator": function(bimap){
        var c = {d:1, e:2};
        bimap.c = c;
        return (
            bimap._get(c) === "c" &&
            bimap.c.d + bimap.c.e === 3 &&
            bimap._keys().length === 2
        );
    }
};

//color codes
var cRed = "\x1b[31m";
var cGreen = "\x1b[32m";
var cRedBG = "\x1b[41m\x1b[39m";
var cGreenBG = "\x1b[42m\x1b[39m";
var cDefault = "\x1b[0m";

function checkEmpty(bimap) {
    return Object.keys(bimap).length === 0 &&
        Object.keys(bimap._rev).length === 0
}

function getCheckMark(x) {
    var success = cGreenBG + " OK " + cDefault;
    var failure = cRedBG + " !! " + cDefault;
    return x?success:failure;
}

function getCheckText(x, text) {
    var successText = cGreen + text + cDefault;
    var failureText = cRed + text + cDefault;
    return x?successText:failureText;
}

//test basics
var Bimap = require("./simple-bimap");
Object.keys(tests).forEach(function(key) {
    try {
        var res = tests[key](new Bimap(true));
        console.log(getCheckMark(res) + "\t" + getCheckText(res, key));
    } catch (e) {
        console.log(getCheckMark(false) + "\t" + getCheckText(false, key + " [" + e.message + "]"));
    }
});

//test proxies
if (typeof Proxy !== "undefined") {
    Object.keys(proxyTests).forEach(function(key) {
        try {
            var res = proxyTests[key](new Bimap());
            console.log(getCheckMark(res) + "\t" + getCheckText(res, key));
        } catch (e) {
            console.log(getCheckMark(false) + "\t" + getCheckText(false, key + " [" + e.message + "]"));
        }
    });
}