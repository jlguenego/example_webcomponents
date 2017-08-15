(function () {
	'use strict';

	// while inside the imported HTML, `doc` should be used instead of `document`
	const doc = document.currentScript.ownerDocument;

	class HelloWorld extends HTMLElement {
		constructor() {
			super();
			console.log('HelloWorld constructor');
			const shadowRoot = this.attachShadow({
				mode: 'open'
			});
			
			// notice the usage of `doc`
			const element = doc.querySelector('#hw');
			shadowRoot.innerHTML = element.innerHTML;
		}
	}

	window.customElements.define('hello-world', HelloWorld);
})();