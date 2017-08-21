(function() {
	'use strict';

	class HelloWorld extends HTMLElement {
		constructor() {
			super();
			console.log('HelloWorld constructor');
			const shadowRoot = this.attachShadow({
				mode: 'open'
			});
			shadowRoot.innerHTML = `
<style>
* {
	padding: 0px;
	margin: 0px;
	color: white;
}
</style>			
<h1>Hello World</h1>`;
		}
	}

	setTimeout(() => {
		window.customElements.define('hello-world', HelloWorld);
	}, 2000);
})();
