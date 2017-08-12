(function () {
	'use strict';

	class JLGStars extends circle.CircleElement {
		constructor() {
			super();
			this.note = this.getAttribute('note');
			this.bindKey(this.note);
			this.onDigest();
		}

		render() {
			const note = circle.model[this.note] || 0;
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

		hello() {
			console.log('hello !');
		}

		update(newNote) {
			console.log('update', arguments);
			circle.model[this.note] = newNote;
		}
	}

	window.customElements.define('jlg-stars', JLGStars);
})();