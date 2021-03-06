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
			window.digestRegistry.push(this);
			this.render();
		}

		render() {
			const str = this.innerHTML.replace(/{{(.*?)}}/g,  function(match, p1) {
				console.log('replace', arguments);
				return model[p1];
			});

			this.root.innerHTML = str;
		}

		onDigest() {
			console.log('JLGExpr onDigest');
			this.render();
		}
	}

	window.customElements.define('jlg-expr', JLGExpr);
})();