(function() {
	'use strict';

	// Unfortunately, custom built-in element are not yet implemented.

	class OFor extends circle.Element {

		constructor() {
			super();
			console.log('o-for constructor');
		}

		connectedCallback() {
			console.log('o-for connectedCallback');
			super.connectedCallback();
		}

		render(digestId) {
			console.log('about to render o-for', this);
			const iterator = this.model.iterator;
			console.log('iterator', iterator);
			const array = this.model.list || [];
			let html = '';
			for (let i = 0; i < array.length; i++) {
				html += `<o-for-item ${iterator}="[list[${i}]]" ></o-for-item>`;

			}

			this.root.innerHTML = html;
		}
	}

	OFor.register();

	class OForItem extends circle.Element {

		constructor() {
			super();
			console.log('o-for-item constructor');
		}

		connectedCallback() {
			console.log('o-for-item connectedCallback');
			super.connectedCallback();
		}

		render(digestId) {
			console.log('about to render o-for-item');
			const clone = document.importNode(this.getParent().originalContent, true);
			this.parseExpr(clone);
			this.root.innerHTML = '';
			this.root.appendChild(clone);
		}
	}

	OForItem.register();
})();
