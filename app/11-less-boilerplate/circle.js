(function () {
    'use strict';

    const doc = document.currentScript.ownerDocument;

    /**
     * Translate a string from CamelCase to spinal-case.
     * Note: works well with SPECIALCamelCase as well.
     * 
     * @param {string} str - CamelCase string
     * @returns spinal-case equivalent string.
     */
    function camel2Spinal(str) {
        // handle case like JLGStars becoming jlg-stars
        str = str.replace(/^([A-Z]+)([A-Z][a-z])/g, '$1-$2');
        // then do the traditional conversion to spinal case.
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     * check if the user agent is Firefox
     * 
     * @returns true if user agent is Firefox, false otherwise.
     */
    function isFirefox() {
        const result = navigator.userAgent.match(/Firefox/) !== null;
        return result;
    }

    /**
     * We want the user be able to easily insert expression like in AngularJS.
     * But internally, the {{myModelVar}} must be converted to <circle-expr expr="[myModelVar]"></circle-expr>
     * 
     * @param {any} elt 
     */
    function parseExpr(elt) {
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
                return `<circle-expr expr="[${name}]"></circle-expr>`;
            });
            const parentNode = node.parentNode;
            parentNode.insertBefore(replacementNode, node);
            parentNode.removeChild(node);
        });
    }

    /**
     * Tests if the notation is a 2 ways data binding.
     * Notation is for the time being: [[...]]
     * 
     * @param {any} value 
     * @returns 
     */
    function isTwoWaysDatabindingNotation(value) {
        return value.match(/^\[\[(.*?)\]\]$/);
    }

    /**
     * Tests if the notation is a 1 way data binding.
     * Notation is for the time being: [...]
     * 
     * @param {any} value 
     * @returns 
     */
    function isOneWaysDatabindingNotation(value) {
        return value.match(/^\[(.*?)\]$/);
    }

    /**
     * A component in circle must extends the circle.Element class
     * which is a pointer on the CircleElement class.
     * 
     * @class CircleElement
     * @extends {HTMLElement}
     */
    class CircleElement extends HTMLElement {
        static get tag() {
            return camel2Spinal(this.name);
        }
        static register() {
            window.customElements.define(this.tag, this);
        }
        constructor() {
            super();
            const self = this;
            this.model = new Proxy({}, {
                set(target, key, value) {
                    target[key] = value;
                    self.digest(key, self);
                    return true;
                },
            });
            this.digestRegistry = {};
            this.templateSelector = '#' + this.constructor.tag;
        }
        get databinding() {
            let result = {};
            for (let i = 0; i < this.attributes.length; i++) {
                const key = this.attributes[i].name;
                const value = this.attributes[i].value;
                if (isTwoWaysDatabindingNotation(value)) {
                    result[key] = '=';
                } else if (isOneWaysDatabindingNotation(value)) {
                    result[key] = '>';
                // } else {
                //     result[key] = '@';
                }
            }
            return result;
        }
        getDatabinding(attr) {
            return this.getAttribute(attr).replace(/\[|\]/g, '');
        }
        getParent() {
            return this.getRootNode().host;
        }
        connectedCallback() {
            this.root = this.attachShadow({
                mode: 'closed'
            });
            const myDoc = (isFirefox()) ? doc : document.currentScript.ownerDocument;
            const t = myDoc.querySelector(this.templateSelector);
            if (t) {
                const clone = document.importNode(t.content, true);
                parseExpr(clone);
                this.root.innerHTML = '';
                this.root.appendChild(clone);
            }
            // databinding
            for (let attr in this.databinding) {
                const modelVar = this.getDatabinding(attr);
                this.bindKey(modelVar);
                this.onDigest(modelVar);
            }
            if (!this.databinding) {
                this.render();
            }
            // end databinding
        }
        render() {}

        onDigest(key) {
            // databinding
            for (let attr in this.databinding) {
                const modelVar = this.getDatabinding(attr);
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
            let counter = 0;
            if (this.digestRegistry[key]) {
                this.digestRegistry[key].forEach((elt, index) => {
                    counter++;
                    elt.onDigest(key);
                });
            }
            // databinding
            for (let attr in this.databinding) {
                const modelVar = this.getDatabinding(attr);
                if (attr === key && this.databinding[attr] === '=') {
                    if (this.getParent().model[modelVar] !== this.model[attr]) {
                        this.getParent().model[modelVar] = this.model[attr];
                    }
                }
            }
            // end databinding
            this.render();
        }
    }

    /**
     * The Circle class is the exposed class of the library.
     * The circle.js produces a global variable window.circle which is the hook
     * to all functionalities of this library.
     * 
     * @class Circle
     */
    class Circle {
        constructor() {
            this.Element = CircleElement;
        }
    }
    window.circle = new Circle();

    /**
     * CircleExpr is the component that allows displaying expressions.
     * 
     * @class CircleExpr
     * @extends {circle.Element}
     */
    class CircleExpr extends CircleElement {
        render() {
            this.root.innerHTML = this.model.expr || '';
        }
    }
    CircleExpr.register();
})();