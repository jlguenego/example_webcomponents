(function () {
	'use strict';

	class JLGExpr extends circle.Element {
		constructor() {
			super();
			const key = this.innerHTML.replace(/{{(.*?)}}/g, '$1');
			this.bindKey(key);
		}

		render() {
			this.root.innerHTML = this.innerHTML.replace(/{{(.*?)}}/g, (match, p1) => {
				return circle.model[p1] || '';
			});
		}
	}

	window.customElements.define('jlg-expr', JLGExpr);
})();