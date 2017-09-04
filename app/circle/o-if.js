(function() {
	'use strict';

	// Unfortunately, custom built-in element are not yet implemented.

	class OIf extends circle.Element {

		constructor() {
			super();
			console.log('o-if constructor');
			this.oifChildNodes = [];
		}

		connectedCallback() {
			super.connectedCallback();
			// o-if
			if (this.hasAttribute('tmpl-selector')) {
				const originalTemplate = this.myDoc.querySelector(this.getAttribute('tmpl-selector'));
				if (originalTemplate) {
					this.originalContent = document.importNode(originalTemplate.content, true);
				}
			} else {
				const originalTemplate = this.querySelector('template');
				if (originalTemplate) {
					this.originalContent = document.importNode(originalTemplate.content, true);
				}
			}
		}

		render(digestId) {
			if (this.model.cond) {
				this.root.innerHTML = '';
				if (this.oifChildNodes.length === 0) {
					this.root.appendChild(this.originalContent);					
				} else {
					while (this.oifChildNodes.length > 0) {
						this.root.appendChild(this.oifChildNodes.shift());
					}
				}
			} else {
				console.log('render off', this.root);
				while (this.root.firstChild) {
					this.oifChildNodes.push(this.root.removeChild(this.root.firstChild));
				}
			}
		}
	}

	OIf.register();
})();
