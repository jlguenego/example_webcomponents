(function() {
	'use strict';

	// Unfortunately, custom built-in element are not yet implemented.

	class OFor extends circle.Element {

		constructor() {
			super();
			console.log('o-if constructor');
		}

		connectedCallback() {
			console.log('o-if connectedCallback');
			super.connectedCallback();
		}

		render(digestId) {
			
		}
	}

	OFor.register();
})();
