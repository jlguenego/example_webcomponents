(function() {
	'use strict';

	class JLGDefinition extends HTMLElement {
		constructor() {
			super();
		}

		connectedCallback() {
			console.log('JLGDefinition constructor');
			const shadowRoot = this.attachShadow({
				mode: 'closed'
			});
			shadowRoot.innerHTML = document.currentScript.ownerDocument.querySelector('template').innerHTML;
		}
	}

	window.customElements.define('jlg-definition', JLGDefinition);


})();
