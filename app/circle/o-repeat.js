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
					}, 500);
				});
			});

			this.dj.onEnter(function(elt) {
				return new Promise((fulfill, reject) => {
					elt.className += 'entering';
					setTimeout(() => {
						elt.classList.remove('entering');
						fulfill();
					}, 500);
				});
			});

			this.dj.onAddNewElement(function(obj) {
				const elt = createElementFromString(
					document,
					`<o-repeat-item iterator="${iterator}" 
						index="${obj.index}" 
						${iterator}="[list[${obj.index}]]"></o-repeat-item>`);

				return elt;
			});

			this.dj.onUpdateElement(function(elt) {
				const index = elt.$data$.index;
				elt.setAttribute('index', index);
				return elt;
			});
		}

		render(digestId) {
			console.log('about to render o-repeat %O', this);

			if (!this.dj) {
				this.InitDJ();
			}

			this.dj.update(this.model.list);
		}
	}

	ORepeat.register();

	class ORepeatItem extends circle.Element {

		static get observedAttributes() { return ['index']; }

		attributeChangedCallback(attr, oldValue, newValue) {
			if (attr === 'index') {
				this.model.index = newValue;
			}
			
		}

		render(digestId) {
			if (!this.alreadyWentHere) {
				this.alreadyWentHere = true;
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
