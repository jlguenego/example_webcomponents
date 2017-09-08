(function() {
	'use strict';
	const doc = document.currentScript.ownerDocument;

	class JLGDefinition extends HTMLElement {
		connectedCallback() {
			const shadowRoot = this.attachShadow({
				mode: 'open'
			});
			shadowRoot.innerHTML = doc.querySelector('template').innerHTML;
		}
	}

	window.customElements.define('jlg-definition', JLGDefinition);


})();
