(function () {
    'use strict';

    class CircleElement extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({
                mode: 'closed'
            });
            this.keys = [];
            circle.digestRegistry.push(this);
            this.render();
        }
        render() {}
        onDigest() {
            console.log('onDigest', this)
            this.render();
        }
        bindKey(key) {
            if (this.keys.indexOf(key) === -1) {
                this.keys.push(key);
            }
        }
    }

    class Circle {
        constructor() {
            const circle = this;
            const handler = {
                set(target, key, value) {
                    target[key] = value;
                    circle.digest(key);
                    return true;
                },
            };
            this.model = new Proxy({}, handler);
            this.digestRegistry = [];
            this.CircleElement = CircleElement;
        }
        digest(key) {
            console.log('digest start for', key);
            let counter = 0;
            this.digestRegistry.forEach((elt, index) => {
                if (elt.keys.indexOf(key) > -1) {
                    counter++;
                    elt.onDigest();
                }
            });
            console.log('digest end in %d steps for key %s', counter, key);
        }
    }
    window.circle = new Circle();
})();