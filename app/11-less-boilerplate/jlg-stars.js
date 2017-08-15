(function () {
	'use strict';

	class JLGStars extends circle.Element {

		constructor() {
			super();
			this.databinding = {
				'note': '='
			}
		}

		render() {
			console.log('about to render JLGStars with note = ', this.model.note);
			const note = this.model.note;
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