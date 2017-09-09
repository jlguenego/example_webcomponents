(function() {
	'use strict';

	class OSelect extends circle.Element {
		
		render(digestId) {
			console.log('o-select render');
			this.root.innerHTML = '<slot></slot>';
			const select = this.querySelector('select');
			console.log('select %O', select);
			const value = select.selectedOptions[0].value;
			console.log('value', value);
			// init case.
			if (this.model.value === undefined && value !== undefined) {
				this.update(value);
			}

			// program events
			select.addEventListener('change', () => {
				const value = select.selectedOptions[0].value;
				console.log('value', value);
				this.update(value);
			});
		}

		update(value) {
			this.model.value = value;
		}
	}
	OSelect.register();
})();
