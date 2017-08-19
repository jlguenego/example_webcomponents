(function() {
	'use strict';

	function stackTrace() {
		var err = new Error();
		return err.stack;
	}

	console.log('o-if definition');

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
			console.log('render', arguments);
			console.log('rendering %d from', digestId, stackTrace());
			if (this.model.cond) {
				console.log('render on');
				this.root.innerHTML = '';
				this.root.innerHTML = this.originalContent;
			} else {
				console.log('render off');
				this.root.innerHTML = '';
			}
		}
	}

	OIf.register();
})();
