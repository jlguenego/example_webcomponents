(function () {
	'use strict';

	class JLGStars extends circle.Element {
		static get tag() {
			return 'jlg-stars';
		}
		constructor() {
			super();
			console.log('JLGStars this.outerHTML ' + this.outerHTML);
			this.model.note = 0;
			delete this.templateSelector;
		}

		connectedCallback() {
			super.connectedCallback();
			this.noteName = this.getAttribute('note');
			this.bindKey(this.noteName);
			this.onDigest();
		}

		render() {

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
			for (let i = 0; i < this.model.note; i++) {
				html += `<img ${eventname}="this.getRootNode().host.update(${i+1})" src="img/yellow_star.png">`;
			}

			for (let i = this.model.note; i < 5; i++) {
				html += `<img ${eventname}="this.getRootNode().host.update(${i+1})" src="img/white_star.png">`;
			}
			this.root.innerHTML = html;
		}

		update(newNote) {
			console.log('update', newNote);
			this.model.note = newNote;
			// this.getParent().model[this.noteName] = newNote;
			this.render();
		}

		onDigest(key) {
			console.log('onDigest', key, this);
			if (this.model.note === this.getParent().model[this.noteName]) {
				return;
			}
			this.model.note = this.getParent().model[this.noteName] || 0;
			this.render();
		}

		digest(key, caller) {
			this.getParent().model[this.noteName] = this.model.note;
		}

	}

	window.customElements.define(JLGStars.tag, JLGStars);
})();