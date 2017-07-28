var Bimap = exports = function(isComplex){

    var bimap = {};

    var mapOps = {

        set: function set(target, prop, val) {

            target[prop] = val;
            if (typeof val !== "object") {
                target[val] = prop;
            }

            return true;
        },

        deleteProperty: function deleteProperty(target, prop) {

            delete target[target[prop]];
            delete target[prop];

            return true;
        }

    };

    Object.defineProperty(bimap, "_set", {
        value: function(prop, val) {
            mapOps.set(this, prop, val);
        }
    });

    Object.defineProperty(bimap, "_del", {
        value: function(prop) {
            mapOps.deleteProperty(this, prop);
        }
    });

    if (typeof Proxy !== "undefined") {

        return new Proxy(bimap, mapOps);

    } else {

        console.warn("could not create simple BiMap: requires Proxy");

    }
    return bimap;
};
