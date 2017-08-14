(function () {
	'use strict';

	const doc = document.currentScript.ownerDocument;	

	class JLGHello extends HTMLElement {
		constructor() {
			super();
			console.log('Hello constructor');
			
			this.template = doc.querySelector('#hw').innerHTML;
			this.name = '';

			this.root = this.attachShadow({
				mode: 'open'
			});
		}

		static get observedAttributes() {
			return ['name'];
		}

		attributeChangedCallback(name, oldValue, newValue) {
			console.log('attributeChangedCallback', arguments)
			this.name = newValue;
			this.render();
		}

		render() {
			const string = this.template.replace(/{{name}}/g, this.name);
			
			this.root.innerHTML = string;
		}
	}

	window.customElements.define('jlg-hello', JLGHello);
})();