(function () {
    'use strict';

    class CircleElement extends HTMLElement {
        constructor() {
            super();
            console.log('CircleElement constructor start: ' + this.constructor.name);
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
            console.log('this.tag ' + this.constructor.tag);
            this.templateSelector = '#' + this.constructor.tag;
            console.log('CircleElement constructor end: ' + this.constructor.name);
        }
        getParent() {
            return this.getRootNode().host;
        }
        connectedCallback() {
            console.log('CircleElement connectedCallback start: ' + this.constructor.name);
            if (this.templateSelector) {
                this.element = document.currentScript.ownerDocument.querySelector(this.templateSelector);
                this.root.innerHTML = this.element.innerHTML.replace(/{{(.*?)}}/g, (match, name) => {
                    return `<jlg-expr expr="coucou">${name}</jlg-expr>`;
                });
            }
            this.render();
            console.log('CircleElement connectedCallback end: ' + this.constructor.name);            
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
        static get tag() {
            return 'jlg-expr';
        }
        constructor() {
            super();
            console.log('JLGExpr constructor specific start');
            console.log('JLGExpr this.outerHTML ' + this.outerHTML);
            this.key = this.innerHTML;
            this.bindKey(this.key);
            delete this.templateSelector;
            this.render();
            console.log('JLGExpr constructor specific end');
        }

        render() {
            console.log('JLGExpr render start');
            super.render();
            this.root.innerHTML = this.getParent().model[this.key] || '';
             console.log('JLGExpr render end');
        }
    }

    window.customElements.define(JLGExpr.tag, JLGExpr);
})();