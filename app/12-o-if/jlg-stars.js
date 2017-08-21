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

		render() {
			console.log('about to render JLGStars with note = ', this.model.note, circle.stackTrace());
			const note = this.model.note || 0;
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
			console.log('update', newNote);
			this.model.note = newNote;
		}

	}

	JLGStars.register();
})();