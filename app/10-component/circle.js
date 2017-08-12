(function () {
    'use strict';

    class CircleElement extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({
                mode: 'closed'
            });
            this.render();
        }
        render() {
            const doc = document.currentScript.ownerDocument;
            var element = doc.querySelector('template');
            if (element) {
                this.root.innerHTML = element.innerHTML;
            }
        }
        onDigest() {
            console.log('onDigest', this)
            this.render();
        }
        bindKey(key) {
            if (circle.digestRegistry[key] === undefined) {
                circle.digestRegistry[key] = [this];
            } else {
                circle.digestRegistry[key].push(this);
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
            this.digestRegistry = {};
            this.CircleElement = CircleElement;
        }
        digest(key) {
            console.log('digest start for', key);
            let counter = 0;
            if (this.digestRegistry[key]) {
                this.digestRegistry[key].forEach((elt, index) => {
                    counter++;
                    elt.onDigest();
                });
            }
            console.log('digest end in %d steps for key %s', counter, key);
        }
    }
    window.circle = new Circle();
})();