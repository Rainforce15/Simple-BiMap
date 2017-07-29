var BiMap = function(ignoreProxyWarning){

    var biMap = {};
    var revMap = {};

    function escape(key) {
        var keyProp = key;
        if (typeof keyProp === "object") {
            keyProp = JSON.stringify(keyProp);
        }
        if (typeof keyProp === "function") {
            keyProp = keyProp.toString();
        }
        return keyProp;
    }

    var proxOps = {
        set: function set(target, prop, val) {
            if (biMap[escape(prop)]) {
                this.deleteProperty(target, prop);
            }
            if (biMap[escape(val)]) {
                this.deleteProperty(target, val);
            }
            biMap[escape(prop)] = val;
            revMap[escape(val)] = prop;
        },

        get: function get(target, prop) {
            if (Object.keys(mapOps).indexOf(prop) === -1) {
                prop = escape(prop);
                if (typeof biMap[prop] !== "undefined") {
                    return biMap[prop];
                }
                else if (typeof revMap[prop] !== "undefined") {
                    return revMap[prop];
                } else {
                    return undefined;
                }
            } else {
                return biMap[prop];
            }
        },

        deleteProperty: function deleteProperty(target, prop) {
            prop = escape(prop);
            if (biMap[prop]) {
                delete revMap[biMap[prop]];
                delete biMap[prop];
                return true;
            } else if (revMap[prop]) {
                delete biMap[revMap[prop]];
                delete revMap[prop];
                return true;
            } else {
                return false;
            }
        }
    };

    var mapOps = {
        _set: function(prop, val) {
            return proxOps.set(this, prop, val);
        },
        _get: function(prop) {
            return proxOps.get(this, prop);
        },
        _del: function(prop) {
            return proxOps.deleteProperty(this, prop);
        },
        _keys: function() {
            return Object.keys(biMap).concat(Object.keys(revMap))
        },
        _rev: revMap
    };

    Object.keys(mapOps).forEach(function(key){
        Object.defineProperty(biMap, key, {
            value: mapOps[key]
        });
    });

    if (typeof Proxy !== "undefined") {
        return new Proxy(biMap, proxOps);
    } else if (!ignoreProxyWarning) {
        console.warn("could not create simple BiMap: requires Proxy");
    }

    return biMap;
};

if (module) {
    module.exports = BiMap;
}
