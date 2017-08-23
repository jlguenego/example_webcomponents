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
			console.log('about to render o-for');
			const array = this.model.list || [];
			let html = '';
			for (let item of array) {
				html += this.originalContent;
			}
			
			this.root.innerHTML = html;
		}
	}

	OFor.register();
})();
