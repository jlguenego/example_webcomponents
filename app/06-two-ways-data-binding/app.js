(function () {
	'use strict';

	class JLGHello extends HTMLElement {
		constructor() {
			super();
			console.log('Hello constructor');

			this.note = 1;

			this.root = this.attachShadow({
				mode: 'open'
			});
		}

		static get observedAttributes() {
			return ['note'];
		}

		attributeChangedCallback(name, oldValue, newValue) {
			console.log('attributeChangedCallback', arguments)
			this.note = +newValue;
			this.render();
		}

		render() {
			let html = '';
			for (let i = 0; i < this.note; i++) {
				html += `<img src="img/yellow_star.png">`;
			}

			for (let i = this.note; i < 5; i++) {
				html += `<img src="img/white_star.png">`;
			}

			this.root.innerHTML = html;
		}
	}

	window.customElements.define('jlg-stars', JLGHello);
})();