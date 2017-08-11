(function () {
    'use strict';

    class CircleElement extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({
                mode: 'closed'
            });
            circle.digestRegistry.push(this);
            this.render();
        }
        render() {}
        onDigest() {
            this.render();
        }
    }

    class Circle {
        constructor() {
            const circle = this;
            const handler = {
                set(target, key, value) {
                    console.log(`Setting value ${key} as ${value}`)
                    target[key] = value;
                    circle.digest();
                    return true;
                },
            };
            this.model = new Proxy({}, handler);
            this.digestRegistry = [];
            this.CircleElement = CircleElement;
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