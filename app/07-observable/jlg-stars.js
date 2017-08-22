(function () {
	'use strict';

	class JLGStars extends HTMLElement {
		constructor() {
			super();
			console.log('JLGStars constructor');

			this.note = 1;
			this.modelName = undefined;

			this.root = this.attachShadow({
				mode: 'closed'
			});
			window.digestRegistry.push(this);
		}

		static get observedAttributes() {
			return ['note'];
		}

		attributeChangedCallback(name, oldValue, newValue) {
			console.log('attributeChangedCallback', arguments);
			this.modelName = newValue;
			this.note = window.model[this.modelName];
			this.render();
		}

		render() {
			let html = '';
			for (let i = 0; i < this.note; i++) {
				html += '<img src="../img/yellow_star.png">';
			}

			for (let i = this.note; i < 5; i++) {
				html += '<img src="../img/white_star.png">';
			}

			this.root.innerHTML = html;
			const images = this.root.querySelectorAll('img');
			console.log('images', images);
			const self = this;
			images.forEach((img, i) => {
				img.addEventListener('click', function () {
					self.update(i + 1);
				});
			});
		}

		update(newNote) {
			console.log('update', arguments);
			model[this.modelName] = newNote;
		}

		onDigest() {
			console.log('JLGStars onDigest');
			this.note = model[this.modelName];
			this.render();
		}
	}

	window.customElements.define('jlg-stars', JLGStars);
})();