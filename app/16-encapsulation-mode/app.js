(function() {
	'use strict';

	const c1 = document.querySelector('open-shadow-dom');

	const shadowRoot = c1.attachShadow({ mode: 'open' });
	shadowRoot.innerHTML = `
<p>Hello World!</p>
`;

	const c2 = document.querySelector('closed-shadow-dom');

	const myComponentShadowRoot = c2.attachShadow({ mode: 'closed' });
	myComponentShadowRoot.innerHTML = `
<p>Again... Hello the world!</p>
`;

	console.log('open-shadow-dom: c1.shadowRoot', c1.shadowRoot);
	console.log('closed-shadow-dom: c2.shadowRoot', c2.shadowRoot);


})();
