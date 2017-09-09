(function() {
	'use strict';

	// const svg = document.createElement('svg');
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.innerHTML = '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />';
	svg.setAttribute('width', 100);
	svg.setAttribute('height', 100);
	document.body.appendChild(svg);

	// Custom Element must extends from only HTMLElement. Not SVGElement, etc.

	class HelloWorld extends HTMLElement {
		constructor() {
			super();
			console.log('HelloWorld constructor');
		}

		connectedCallback() {
			console.log('HelloWorld connectedCallback');

			const shadowRoot = this.attachShadow({
				mode: 'open'
			});
			shadowRoot.innerHTML = `
<svg width="100" height="100">
	<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
</svg>`;
		}
	}

	window.customElements.define('hello-world', HelloWorld);
})();
