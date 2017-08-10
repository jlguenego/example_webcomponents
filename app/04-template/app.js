(function () {
	'use strict';

	class HelloWorld extends HTMLElement {
		constructor() {
			super();
			console.log('HelloWorld constructor');
			const shadowRoot = this.attachShadow({
				mode: 'open'
			});
			// while inside the imported HTML, `currentDocument` should be used instead of `document`
			const currentDocument = document.currentScript.ownerDocument;
			// notice the usage of `currentDocument`
			var element = currentDocument.querySelector('#hw');
			console.log('element', element);
			console.log('element.innerHTML', element.innerHTML);
			
			shadowRoot.innerHTML = element.innerHTML;
		}
	}

	window.customElements.define('hello-world', HelloWorld);
})();