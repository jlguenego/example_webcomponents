(function() {
	'use strict';

	// Unfortunately, custom built-in element are not yet implemented.

	class OIf extends circle.Element {

		constructor() {
			super();
			console.log('o-if constructor');
		}

		connectedCallback() {
			console.log('o-if connectedCallback');
			super.connectedCallback();
		}

		render(digestId) {
			if (this.model.cond) {
				console.log('render on');
				this.root.innerHTML = '';
				this.root.innerHTML = this.originalContent.innerHTML;
			} else {
				console.log('render off');
				this.root.innerHTML = '';
			}
		}
	}

	OIf.register();
})();
