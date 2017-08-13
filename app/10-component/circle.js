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
            this.templateSelector = 'template';
        }
        getParent() {
            return this.getRootNode().host;
        }
        connectedCallback() {
            if (this.templateSelector) {
                this.element = document.currentScript.ownerDocument.querySelector(this.templateSelector);
                this.root.innerHTML = this.element.innerHTML.replace(/{{(.*?)}}/g, (match, name) => {
                    return `<jlg-expr>${name}</jlg-expr>`;
                });
            }
            this.render();
        }
        render() {
            console.log('render %O', this);
        }

        onDigest(key) {
            console.log('onDigest', key, this);
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
                    elt.onDigest(key);
                });
            }
            counter++;
            this.onDigest(key);
            console.log('digest end in %d steps for key %s', counter, key);
        }
    }

    class Circle {
        constructor() {
            this.Element = CircleElement;
        }
    }

    window.circle = new Circle();

    class JLGExpr extends circle.Element {
        constructor() {
            super();
            this.key = this.innerHTML;
            this.bindKey(this.key);
            delete this.templateSelector;
        }

        render() {
            super.render();
            this.root.innerHTML = this.getParent().model[this.key] || '';
        }
    }

    window.customElements.define('jlg-expr', JLGExpr);
})();