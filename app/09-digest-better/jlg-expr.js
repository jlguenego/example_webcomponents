(function () {
	'use strict';

	class JLGExpr extends circle.CircleElement {
		constructor() {
			super();
			this.key = this.innerHTML.replace(/{{(.*?)}}/g, '$1');
			this.bindKey(this.key);
		}

		render() {
			this.root.innerHTML = circle.model[this.key] || '';
		}
	}

	window.customElements.define('jlg-expr', JLGExpr);
})();