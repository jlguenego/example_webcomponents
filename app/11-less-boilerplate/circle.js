(function () {
    'use strict';

    const doc = document.currentScript.ownerDocument;

    function camel2Spinal(str) {
        str = str.replace(/^([A-Z]+)([A-Z][a-z])/g, '$1-$2');
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    function isFirefox() {
        const result = navigator.userAgent.match(/Firefox/) !== null;
        return result;
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
        static get tag() {
            return camel2Spinal(this.name);
        }
        static register() {
            window.customElements.define(this.tag, this);
        }
        constructor() {
            super();
            console.log('CircleElement constructor start: ', this.constructor.name);

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
            console.log('CircleElement constructor end: ', this.constructor.name);
        }
        getParent() {
            return this.getRootNode().host;
        }
        connectedCallback() {
            console.log('connectedCallback start: ', this.constructor.name);

            this.root = this.attachShadow({
                mode: 'closed'
            });
            const myDoc = (isFirefox()) ? doc : document.currentScript.ownerDocument;
            const t = myDoc.querySelector(this.templateSelector);
            if (t) {
                const clone = document.importNode(t.content, true);
                manageExpr(clone);
                this.root.innerHTML = '';
                this.root.appendChild(clone);
            }
            // databinding
            for (let attr in this.databinding) {
                const modelVar = this.getAttribute(attr);
                this.bindKey(modelVar);
                this.onDigest(modelVar);
            }
            if (!this.databinding) {
                console.log('no databinding');
                this.render();
            }
            // end databinding
            console.log('connectedCallback end: ', this.constructor.name);
        }
        render() {}

        onDigest(key) {
            console.log('onDigest', key, this);
            // databinding
            for (let attr in this.databinding) {
                const modelVar = this.getAttribute(attr);
                if (modelVar === key) {
                    if (this.model[attr] !== this.getParent().model[key]) {
                        this.model[attr] = this.getParent().model[key];
                    }
                }
            }
            // end databinding
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
            // databinding
            for (let attr in this.databinding) {
                const modelVar = this.getAttribute(attr);
                if (modelVar === key && this.databinding[attr] === '=') {
                    if (this.getParent().model[key] !== this.model[attr]) {
                        this.getParent().model[key] = this.model[attr];
                    }
                }
            }
            // end databinding
            this.render();
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

    JLGExpr.register();
})();