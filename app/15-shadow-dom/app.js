(function() {
	'use strict';

	const hw = document.querySelector('hello-world');

	const shadowRoot = hw.attachShadow({ mode: 'closed' });
	shadowRoot.innerHTML = `
<p>Hello World!</p>
`;

	setTimeout(() => {
		const myComponent = document.querySelector('my-component');

		const myComponentShadowRoot = myComponent.attachShadow({ mode: 'closed' });
		myComponentShadowRoot.innerHTML = `
<p>I will be displayed but you cannot find me...</p>
`;
	}, 2000);

})();
