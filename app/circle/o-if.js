(function() {
	'use strict';

	// Unfortunately, custom built-in element are not yet implemented.

	class OIf extends circle.Element {

		constructor() {
			super();
			console.log('o-if constructor');
			this.oifChildNodes = [];
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
