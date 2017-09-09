(function() {
	'use strict';

	class OSelect extends circle.Element {
		
		render(digestId) {
			console.log('o-select render');
			this.root.innerHTML = '<slot></slot>';
			const select = this.root.querySelector('select');
			console.log('select', select);
		}
	}
	OSelect.register();
})();
