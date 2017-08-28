(function() {
	'use strict';

	function createElementFromString(document, str) {
		const template = document.createElement('template');
		template.innerHTML = str;
		console.log('template.content.firstChild', template.content.firstChild);
		return template.content.firstChild;
	}

	class ORepeat extends circle.Element {

		constructor() {
			super();
		}

		InitDJ() {
			const iterator = this.model.iterator;

			this.root.innerHTML = '<link rel="stylesheet" href="o-repeat.css" />';

			this.dj = new window.DJ(this.root, 'o-repeat-item');
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

			this.dj.onAddNewElement(function(obj) {
				const elt = createElementFromString(
					document,
					`<o-repeat-item  index="${obj.index}" ${iterator}="[list[${obj.index}]]"></o-repeat-item>`);

				return elt;
			});
		}

		render(digestId) {
			console.log('about to render o-repeat', this);

			if (!this.dj) {
				this.InitDJ();
			}


			const array = Object.assign([], this.model.list);
			console.log('array', array);
			this.dj.update(array);

		}
	}

	ORepeat.register();

	class ORepeatItem extends circle.Element {

		render(digestId) {
			console.log('about to render o-repeat-item');
			const clone = document.importNode(this.getParent().originalContent, true);
			this.parseExpr(clone);
			this.root.innerHTML = '';
			this.root.appendChild(clone);
		}

		get index() {
			return this.model.index;
		}
	}

	ORepeatItem.register();



})();
