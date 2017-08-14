(function () {
    'use strict';

    class CircleElement extends HTMLElement {
        constructor(doc) {
            super();
            this.doc = doc;
            this.templateSelector = '#' + this.constructor.tag;
            this.root = this.attachShadow({
                mode: 'closed'
            });
            const t = this.doc.querySelector(this.templateSelector);
            const clone = document.importNode(t.content, true);
            this.root.appendChild(clone);
        }
    }

    class Circle {
        constructor() {
            this.Element = CircleElement;
        }
    }

    window.circle = new Circle();

})();