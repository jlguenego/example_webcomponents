(function () {
	'use strict';

	class OInput extends circle.Element {
		connectedCallback() {
			super.connectedCallback();
			this.root.innerHTML = '<input type="text" value="">';
			this.input = this.root.querySelector('input');
			this.input.addEventListener('change', () => {
				this.model.value = this.input.value;
			});
		}
		render() {
			this.input.value = this.model.value;
		}
	}
	OInput.register();
})();
