(function () {
	'use strict';

	class JLGStars extends circle.Element {

		connectedCallback() {
			console.log('JLGStars connectedCallback');
			super.connectedCallback();
		}

		disconnectedCallback() {
			console.log('JLGStars disconnectedCallback');
		}

		adoptedCallback() {
			console.log('JLGStars adoptedCallback');
		}

		render() {
			const note = +this.model.note || 0;
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
				let update = `onclick="this.getRootNode().host.update(${i+1})"`;
				if ('ontouchstart' in document.documentElement) {
					update += ` ontouchstart="this.getRootNode().host.update(${i+1})"`;
				}
				html += `<img ${update} src="../img/yellow_star.png">`;
			}

			for (let i = note; i < 5; i++) {
				let update = `onclick="this.getRootNode().host.update(${i+1})"`;
				if ('ontouchstart' in document.documentElement) {
					update += ` ontouchstart="this.getRootNode().host.update(${i+1})"`;
				}
				html += `<img ${update} src="../img/white_star.png">`;
			}
			this.root.innerHTML = html;
		}

		update(newNote) {
			console.log('update', newNote);
			this.model.note = newNote;
		}

	}

	JLGStars.register();
})();