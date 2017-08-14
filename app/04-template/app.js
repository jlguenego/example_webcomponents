(function () {
	'use strict';

	// while inside the imported HTML, `currentDocument` should be used instead of `document`
	const currentDocument = document.currentScript.ownerDocument;

	class HelloWorld extends HTMLElement {
		constructor() {
			super();
			console.log('HelloWorld constructor');
			const shadowRoot = this.attachShadow({
				mode: 'open'
			});
			
			// notice the usage of `currentDocument`
			const element = currentDocument.querySelector('#hw');
			console.log('element', element);
			console.log('element.innerHTML', element.innerHTML);
			
			shadowRoot.innerHTML = element.innerHTML;
		}
	}

	window.customElements.define('hello-world', HelloWorld);
})();