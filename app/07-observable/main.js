(function () {
    'use strict';
    var $ = document.querySelector.bind(document);

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
    console.log(model.myNote);

    function digest() {
        console.log('digest start');
        $('#show-note').innerHTML = model.myNote;
        console.log('$(jlg-stars) %O', $('jlg-stars'));
        if ($('jlg-stars').onDigest) {
            $('jlg-stars').onDigest();
        }
        console.log('digest end');

    }

})();