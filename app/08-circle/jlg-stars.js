(function () {
	'use strict';

	class JLGStars extends circle.CircleElement {
		constructor() {
			super();
			this.modelName = undefined;
		}

		static get observedAttributes() {
			return ['note'];
		}

		attributeChangedCallback(name, oldValue, newValue) {
			console.log('attributeChangedCallback', arguments);
			this.modelName = newValue;
			this.onDigest();
		}

		render() {
			const note = circle.model[this.modelName];
			let html = `
<style>
	:host {
		display: block;
	}
</style>
			`;
			for (let i = 0; i < note; i++) {
				html += `<img onmouseover="console.log('%O', this)" src="img/yellow_star.png">`;
			}

			for (let i = note; i < 5; i++) {
				html += `<img src="img/white_star.png">`;
			}

			this.root.innerHTML = html;
			const images = this.root.querySelectorAll('img');
			console.log('images', images);
			const self = this;
			images.forEach((img, i) => {
				img.addEventListener('click', function () {
					self.update(i + 1);
				})
			});
		}

		hello() {
			console.log('hello !');
		}

		update(newNote) {
			console.log('update', arguments);
			circle.model[this.modelName] = newNote;
		}
	}

	window.customElements.define('jlg-stars', JLGStars);
})();