(function () {
    'use strict';

    class CircleElement extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({
                mode: 'closed'
            });
            const self = this;
            this.model = new Proxy({}, {
                set(target, key, value) {
                    target[key] = value;
                    self.digest(key);
                    return true;
                },
            });
            this.digestRegistry = {};
        }
        getParent() {
            return this.getRootNode().host;
        }
        connectedCallback() {
            this.render();
        }
        render() {
            const element = document.currentScript.ownerDocument.querySelector('template');
            if (element) {
                this.source = element.innerHTML;
                this.root.innerHTML = this.parseSource();
            }
        }
        parseSource() {
            return this.source.replace(/{{(.*?)}}/g, (match, name) => {
                return this.model[name];
            });
        }
        onDigest() {
            console.log('onDigest', this)
            this.render();
        }
        bindKey(key) {
            const digestRegistry = this.getParent().digestRegistry;
            if (digestRegistry[key] === undefined) {
                digestRegistry[key] = [this];
            } else {
                digestRegistry[key].push(this);
            }
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
            counter++;
            this.onDigest();
            console.log('digest end in %d steps for key %s', counter, key);
        }
    }

    class Circle {
        constructor() {
            this.Element = CircleElement;
        }
    }
    window.circle = new Circle();
})();