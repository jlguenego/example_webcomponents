(function () {
	'use strict';

	class JLGStars extends circle.Element {
		static get tag() {
			return 'jlg-stars';
		}
		constructor() {
			super();
			console.log('JLGStars this.outerHTML ' + this.outerHTML);

			delete this.templateSelector;
		}

		connectedCallback() {
			this.note = this.getAttribute('note');
			this.bindKey(this.note);
			super.connectedCallback();
		}

		render() {
			const note = this.getParent().model[this.note] || 0;
			let eventname = 'onclick'
			if ('ontouchstart' in document.documentElement) {
				eventname = 'ontouchstart';
			}
			let html = `
<style>
	jlg-stars {
		display: block;
	}			
	:host {
		display: block;
	}
</style>
			`;
			for (let i = 0; i < note; i++) {
				html += `<img ${eventname}="this.getRootNode().host.update(${i+1})" src="img/yellow_star.png">`;
			}

			for (let i = note; i < 5; i++) {
				html += `<img ${eventname}="this.getRootNode().host.update(${i+1})" src="img/white_star.png">`;
			}
			this.root.innerHTML = html;
		}

		update(newNote) {
			this.getParent().model[this.note] = newNote;
		}
	}

	window.customElements.define(JLGStars.tag, JLGStars);
})();