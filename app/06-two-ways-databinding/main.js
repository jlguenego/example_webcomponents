(function () {
    'use strict';
    const $ = document.querySelector.bind(document);
    // const $$ = document.querySelectorAll.bind(document);
    
    let note;

    function digest() {
        note = $('jlg-stars').getAttribute('note');
        $('#show-note').innerHTML = note;
    }

    window.digest = digest;

    digest();

    function updateAttr(n) {
        note = n;
        $('jlg-stars').setAttribute('note', note);
        digest();
    }
    window.updateAttr = updateAttr;
})();