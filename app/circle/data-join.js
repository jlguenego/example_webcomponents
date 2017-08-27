(function() {
	'use strict';

	class DJ {
		constructor(element, template) {
			this.element = element;
			this.template = template;
			if (!this.element || !this.template) {
				throw new Error('cannot find the selector or the template: %O %O', element, template);
			}
			this.data = [];
		}

		/**
		 * Build the light DOM of a <data-join> element.
		 * 
		 * @param {any} obj 
		 * @returns 
		 * @memberof DJ
		 */
		makeSlot(obj) {
			let html = '';
			const nodes = this.template.content.querySelectorAll('slot');
			nodes.forEach(node => {
				const name = node.getAttribute('name');
				const value = eval('obj.' + name);
				html += `<span slot="${name}">${value}</span>`;
			});
			return html;
		}

		/**
		 * update the array of <data-join> that is joined to the DOM.
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
			this.data = Object.assign([], array);
			return this;
		}

		/**
		 * Specify the promise to be run just before a <data-join> being removed.
		 * 
		 * @param {any} promise 
		 * @returns 
		 * @memberof DJ
		 */
		onExit(promise) {
			this.exit = promise;
			return this;
		}

		/**
		 * Specify the promise to be run just before a <data-join> being added.
		 * 
		 * @param {any} promise 
		 * @returns 
		 * @memberof DJ
		 */
		onEnter(promise) {
			this.enter = promise;
			return this;
		}
	}

	window.DJ = DJ;

})();
