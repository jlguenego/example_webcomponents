(function () {
    'use strict';

    class Circle {
        constructor() {
            const $ = document.querySelector.bind(document);
            const $$ = document.querySelectorAll.bind(document);
            const circle = this;
            const handler = {
                set(target, key, value) {
                    console.log(`Setting value ${key} as ${value}`)
                    target[key] = value;
                    circle.digest();
                    return true;
                },

                get(target, key) {
                    console.log(`Getting value ${key}`)
                    return target[key];
                },
            };
            this.model = new Proxy({}, handler);
            this.digestRegistry = [];
        }

        digest() {
            console.log('digest start');
            this.digestRegistry.forEach((elt, index) => {
                if (elt.onDigest) {
                    elt.onDigest();
                }
            });
            console.log('digest end');

        }
    }

    window.circle = new Circle();

})();