(function () {
	'use strict';

	class JLGStars extends HTMLElement {
		constructor() {
			super();
			console.log('Hello constructor');

			this.note = 1;

			this.root = this.attachShadow({
				mode: 'closed'
			});
		}

		static get observedAttributes() {
			return ['note'];
		}

		attributeChangedCallback(name, oldValue, newValue) {
			console.log('attributeChangedCallback', arguments);
			this.note = +newValue;
			this.render();
		}

		render() {
			let html = '';
			for (let i = 0; i < this.note; i++) {
				html += '<img src="img/yellow_star.png">';
			}

			for (let i = this.note; i < 5; i++) {
				html += '<img src="img/white_star.png">';
			}

			this.root.innerHTML = html;
			const images = this.root.querySelectorAll('img');
			console.log('images', images);
			const self = this;
			images.forEach((img, i) => {
				let eventname = 'click';
				if ('ontouchstart' in document.documentElement) {
					eventname = 'touchstart';
				}
				img.addEventListener(eventname, function () {
					self.update(i + 1);
				});
			});
		}

		update(newNote) {
			console.log('update', arguments);
			this.note = newNote;
			this.render();
			this.setAttribute('note', this.note);
			window.digest();
		}
	}

	window.customElements.define('jlg-stars', JLGStars);
})();