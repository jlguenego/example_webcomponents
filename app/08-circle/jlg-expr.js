(function () {
	'use strict';

	class JLGExpr extends HTMLElement {
		constructor() {
			super();
			console.log('JLGExpr constructor');

			this.modelName = undefined;

			this.root = this.attachShadow({
				mode: 'closed'
			});
			circle.digestRegistry.push(this);
			this.render();
		}

		render() {
			const str = this.innerHTML.replace(/{{(.*?)}}/g,  function(match, p1) {
				console.log('replace', arguments);
				return circle.model[p1];
			});
			let html = 'toto';

			this.root.innerHTML = str;
		}

		onDigest() {
			console.log('JLGExpr onDigest');
			this.render();
		}
	}

	window.customElements.define('jlg-expr', JLGExpr);
})();