(function () {
    'use strict';
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

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

    window.model = new Proxy({}, handler);
    model.myNote = 4;
    model.myNote2 = 2;
    console.log(model.myNote);

    function digest() {
        console.log('digest start');
        $('#show-note').innerHTML = model.myNote;
        $$('jlg-stars').forEach((elt, index) => {
            if (elt.onDigest) {
                elt.onDigest();
            }

        });
        console.log('digest end');

    }

})();