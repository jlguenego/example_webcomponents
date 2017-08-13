(function () {
	'use strict';

	class JLGStars extends circle.Element {
		constructor() {
			super();
			this.note = this.getAttribute('note');
			this.bindKey(this.note);
			delete this.templateSelector;
		}

		render() {
			const note = this.getParent().model[this.note] || 0;
			let html = `
<style>
	:host {
		display: block;
	}
</style>
			`;
			for (let i = 0; i < note; i++) {
				html += `<img onclick="this.getRootNode().host.update(${i+1})" src="img/yellow_star.png">`;
			}

			for (let i = note; i < 5; i++) {
				html += `<img onclick="this.getRootNode().host.update(${i+1})" src="img/white_star.png">`;
			}
			this.root.innerHTML = html;
		}

		update(newNote) {
			this.getParent().model[this.note] = newNote;
		}
	}

	window.customElements.define('jlg-stars', JLGStars);
})();