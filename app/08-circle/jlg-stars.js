(function () {
	'use strict';

	class JLGStars extends CircleElement {
		constructor() {
			super();

			this.note = 1;
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
			let html = ``;
			for (let i = 0; i < this.note; i++) {
				html += `<img src="img/yellow_star.png">`;
			}

			for (let i = this.note; i < 5; i++) {
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

		update(newNote) {
			console.log('update', arguments);
			circle.model[this.modelName] = newNote;
		}

		onDigest() {
			console.log('JLGStars onDigest');
			this.note = circle.model[this.modelName];
			this.render();
		}
	}

	window.customElements.define('jlg-stars', JLGStars);
})();