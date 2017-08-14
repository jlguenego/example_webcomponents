(function () {
    'use strict';

    const handler = {
        set(target, key, value) {
            console.log(`Setting value ${key} as ${value}`)
            target[key] = value;
            digest();
            return true;
        },

        get(target, key) {
            console.log(`Getting value ${key}`)
            return target[key];
        },
    };

    window.model = new Proxy({
        myNote: 3,
        myNote2: 4,
    }, handler);
    window.digestRegistry = [];

    function digest() {
        console.log('digest start');
        window.digestRegistry.forEach((elt, index) => {
            if (elt.onDigest) {
                elt.onDigest();
            }
        });
        console.log('digest end');

    }

})();