(function () {
    'use strict';

    const doc = document.currentScript.ownerDocument;

    function isFirefox() {
        return navigator.userAgent.match(/Firefox/) !== null;
    }

    function isEdge() {
        return navigator.userAgent.match(/Edge/) !== null;
    }

    function manageExpr(elt) {
        const walk = document.createTreeWalker(elt, NodeFilter.SHOW_TEXT, null, false);
        let node;
        let array = [];
        while (node = walk.nextNode()) {
            if (node.data.match(/{{(.*?)}}/g)) {
                array.push(node);
            }
        }
        array.forEach((node) => {
            const replacementNode = document.createElement('span');
            replacementNode.innerHTML = node.data.replace(/{{(.*?)}}/g, (match, name) => {
                return `<jlg-expr>${name}</jlg-expr>`;
            });
            const parentNode = node.parentNode;
            parentNode.insertBefore(replacementNode, node);
            parentNode.removeChild(node);
        });
    }


    class CircleElement extends HTMLElement {
        constructor() {
            super();
            const self = this;
            this.model = new Proxy({}, {
                set(target, key, value) {
                    console.log('handler: key=%s, value=%s', key, value);
                    target[key] = value;
                    self.digest(key, self);
                    return true;
                },
            });
            this.digestRegistry = {};
            this.templateSelector = '#' + this.constructor.tag;
        }
        getParent() {
            return this.getRootNode().host;
        }
        connectedCallback() {
            this.root = this.attachShadow({
                mode: 'closed'
            });
            if (this.templateSelector) {
                const myDoc = (isFirefox() || isEdge()) ? doc : document.currentScript.ownerDocument;
                const t = myDoc.querySelector(this.templateSelector);
                const clone = document.importNode(t.content, true);
                manageExpr(clone);
                this.root.innerHTML = '';
                this.root.appendChild(clone);
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
        static get tag() {
            return 'jlg-expr';
        }
        constructor() {
            super();
            delete this.templateSelector;
        }

        connectedCallback() {
            super.connectedCallback();
            this.key = this.innerHTML;
            this.bindKey(this.key);
            this.render();
        }

        render() {
            super.render();
            this.root.innerHTML = this.getParent().model[this.key] || '';
        }
    }

    window.customElements.define(JLGExpr.tag, JLGExpr);
})();