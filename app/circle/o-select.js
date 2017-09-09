(function () {
	'use strict';

	class OSelect extends circle.Element {
		connectedCallback() {
			super.connectedCallback();
			this.root.innerHTML = '<slot></slot>';
			this.select = this.querySelector('select');
			this.model.value = this.select.value;

			this.select.addEventListener('change', () => {
				this.model.value = this.select.value;
			});
		}
		render() {
			this.select.value = this.model.value;
		}
	}
	OSelect.register();
})();
