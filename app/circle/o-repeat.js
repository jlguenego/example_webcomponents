(function() {
	'use strict';

	class ORepeat extends circle.Element {

		constructor() {
			super();
		}

		connectedCallback() {
			this.dj = new window.DJ(this);
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

			super.connectedCallback();
			
		}

		render(digestId) {
			console.log('about to render o-repeat', this);

			const array = this.model.list || [];
			this.dj.update(array);
			
		}
	}

	ORepeat.register();


})();
