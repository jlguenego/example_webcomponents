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
					`<o-repeat-item iterator="${iterator}" ></o-repeat-item>`);

				return elt;
			});
		}

		render(digestId) {
			console.log('about to render o-repeat %O', this);

			if (!this.dj) {
				this.InitDJ();
			}

			this.dj.update(this.model.list);
			const items = this.root.querySelectorAll('o-repeat-item');
			items.forEach(function(item) {
				console.log('render item');
				item.render(digestId);
			});

		}
	}

	ORepeat.register();

	class ORepeatItem extends circle.Element {

		render(digestId) {
			let update = false;
			if (!this.alreadyWentHere) {
				update = true;
				this.alreadyWentHere = true;
			}
			if (this.model[this.model.iterator] !== this.$data$.item) {
				this.model[this.model.iterator] = this.$data$.item;
				update = true;
			}
			if (this.model.index !== this.$data$.index) {
				this.model.index = this.$data$.index;
				update = true;
			}
			
			console.log('update', update);
			if (update) {
				console.log('about to render for the first time o-repeat-item');
				const clone = document.importNode(this.getParent().originalContent, true);
				this.parseExpr(clone);
				this.root.innerHTML = '';
				this.root.appendChild(clone);
				return;
			}
			
			
		}

		get index() {
			return this.model.index;
		}
	}

	ORepeatItem.register();



})();
