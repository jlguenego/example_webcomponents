(function () {
	'use strict';

	class JLGExpr extends circle.CircleElement {

		render() {
			this.root.innerHTML = this.innerHTML.replace(/{{(.*?)}}/g, function (match, p1) {
				console.log('replace', arguments);
				return circle.model[p1];
			});
		}
	}

	window.customElements.define('jlg-expr', JLGExpr);
})();