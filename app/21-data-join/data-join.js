(function() {
	'use strict';

	// const a1 = ['A', 'A', 'A', 'B', 'C'];
	// const a2 = ['A', 'B', 'A', 'D'];

	// const a1 = ['A', 'B', 'A', 'D'];
	// const a2 = ['A', 'A', 'A', 'B', 'C'];

	const n = 10;
	const a1 = Array.apply(null, { length: n }).map(Number.call, Number)
		.map(n => { return { value: n, value2: 2 * n }; });
	const a2 = a1.filter(n => n.value % 2);

	class DJ {

		constructor(selector, template) {
			this.element = document.querySelector(selector);
			this.template = this.element.querySelector('template');
			if (!this.element || !this.template) {
				throw new Error('cannot find the selector or the template: %s %s', selector);
			}
			this.data = [];
		}

		makeSlot(obj) {
			let html = '';
			const nodes = this.template.content.querySelectorAll('slot');
			console.log('nodes', nodes);
			nodes.forEach(node => {
				const name = node.getAttribute('name');
				const value = eval('obj.' + name);
				html += `<span slot="${name}">${value}</span>`;
			});
			console.log('html', html);
			return html;
		}

		/**
		 * update the array that is joined to the DOM.
		 * 
		 * Step 1: remove the elements that will not appear in the new array
		 * or that need to be moved in a lower index.
		 * 
		 * @param {any} array 
		 * @returns 
		 * @memberof DJ
		 */
		update(array) {
			// even if element are removed, this array will not be impacted.
			const elts = this.element.querySelectorAll('data-join');
			let lastIndex = -1;
			const intersection = [];
			for (let elt of elts) {
				const item = elt.$data$.item;
				const index = array.indexOf(item, lastIndex + 1);
				if (index === -1) {
					// not found case
					this.exit(elt).then(() => {
						this.element.removeChild(elt);
					});
				} else {
					// found case: keep the element in the intersect array
					elt.$data$ = { item, index };
					intersection.push(elt.$data$);
					lastIndex = index;
				}
			}

			const newItems = array
				.map((item, index) => { return { item, index }; })
				.filter(obj => {
					return !intersection.find(x => x.item === obj.item && x.index === obj.index);
				});
			let i = 0;
			newItems.forEach(obj => {
				let currentElt = elts[i];
				while (currentElt && currentElt.$data$.index < obj.index) {
					i++;
					currentElt = elts[i];
				}
				const elt = document.createElement('data-join');
				const root = elt.attachShadow({ mode: 'closed' });
				const docFrag = document.importNode(this.template.content, true);
				root.appendChild(docFrag);
				elt.innerHTML = this.makeSlot(obj);
				elt.$data$ = obj;
				if (currentElt) {
					this.element.insertBefore(elt, currentElt);
				} else {
					this.element.appendChild(elt);
				}
				this.enter(elt).then(() => {});
			});
			this.data = array;
			return this;
		}
		onExit(promise) {
			this.exit = promise;
			return this;
		}
		onEnter(promise) {
			this.enter = promise;
			return this;
		}
	}

	window.DJ = DJ;

	const dj = new DJ('my-work-area');
	dj.onExit(function(elt) {
		return new Promise((fulfill, reject) => {
			elt.className += 'leaving';
			setTimeout(() => {
				fulfill();
			}, 2000);
		});
	});

	dj.onEnter(function(elt) {
		return new Promise((fulfill, reject) => {
			elt.className += 'entering';
			setTimeout(() => {
				elt.classList.remove('entering');
				fulfill();
			}, 2000);
		});
	});


	let array = a1;
	dj.update(array);
	array = a2;
	setInterval(() => {
		dj.update(array);
		array = (array === a1) ? a2 : a1;
	}, 3000);

})();
