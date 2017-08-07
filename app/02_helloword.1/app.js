(function () {
	'use strict';

	class HelloWorld extends HTMLElement {
		constructor() {
			super();
			console.log('HelloWorld constructor', HelloWorld.nbr);
			HelloWorld.nbr++;

			const shadowRoot = this.attachShadow({
				mode: 'open'
			});
			shadowRoot.innerHTML = `<h1>Hello Shadow DOM ${HelloWorld.nbr}</h1>`;
		}

		connectedCallback() {
			console.log('HelloWorld connectedCallback');
		}
	}
	HelloWorld.nbr = 0;
	window.customElements.define('hello-world', HelloWorld);
})();