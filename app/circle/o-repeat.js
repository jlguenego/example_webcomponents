(function() {
	'use strict';

	class ORepeat extends circle.Element {

		constructor() {
			super();
		}

		connectedCallback() {

			this.root = this.attachShadow({
				mode: 'closed'
			});

			this.root.innerHTML = '<link rel="stylesheet" href="o-repeat.css" />';
			
			const template = this.querySelector('template');
			this.dj = new window.DJ(this.root, template);
			this.dj.onExit(function(elt) {
				return new Promise((fulfill, reject) => {
					elt.className += 'leaving';
					setTimeout(() => {
						fulfill();
					}, 2000);
				});
			});

			this.dj.onEnter(function(elt) {
				return new Promise((fulfill, reject) => {
					elt.className += 'entering';
					setTimeout(() => {
						elt.classList.remove('entering');
						fulfill();
					}, 2000);
				});
			});

			this.databinding.connectedCallBack();
			

		}

		render(digestId) {
			console.log('about to render o-repeat', this);

			const array = Object.assign([], this.model.list || []);
			console.log('array', array);
			this.dj.update(array);

		}
	}

	ORepeat.register();


})();
