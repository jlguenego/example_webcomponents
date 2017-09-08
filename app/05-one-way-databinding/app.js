(function () {
	'use strict';

	const doc = document.currentScript.ownerDocument;	

	class JLGHello extends HTMLElement {
		constructor() {
			super();
			this.root = this.attachShadow({
				mode: 'open'
			});
		}

		static get observedAttributes() {
			return ['name'];
		}

		connectedCallback() {
			console.log('connectedCallback', arguments);
		}

		attributeChangedCallback(name, oldValue, newValue) {
			console.log('attributeChangedCallback', arguments)
			this.name = newValue;
			this.render();
		}

		render() {
			const string = doc.querySelector('#hw').innerHTML.replace(/{{name}}/g, this.name);
			
			this.root.innerHTML = string;
		}
	}

	window.customElements.define('jlg-hello', JLGHello);
})();