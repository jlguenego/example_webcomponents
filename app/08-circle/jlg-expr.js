(function () {
	'use strict';

	class JLGExpr extends CircleElement {

		render() {
			const str = this.innerHTML.replace(/{{(.*?)}}/g, function (match, p1) {
				console.log('replace', arguments);
				return circle.model[p1];
			});
			let html = 'toto';

			this.root.innerHTML = str;
		}

	}

	window.customElements.define('jlg-expr', JLGExpr);
})();