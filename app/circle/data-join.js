(function() {
	'use strict';

	function myIndexOf(array, item, start) {
		for (let i = start; i < array.length; i++) {
			console.log('JLG myIndexOf start', start);
			console.log('JLG array[%d]', i, array[i]);
			console.log('JLG item', item);
			if (array[i] === item) {
				return i;
			}
		}
		return -1;
	}

	class DJ {
		constructor(element, selector) {
			this.element = element;
			this.selector = selector;
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
			const elts = this.element.querySelectorAll(this.selector);
			let lastIndex = -1;
			const intersection = [];
			for (let elt of elts) {
				const item = elt.$data$.item;
				console.log('item', item);
				// const index = array.indexOf(item, lastIndex + 1);

				const index = myIndexOf(array, item, lastIndex + 1);

				if (index === -1) {
					console.log('JLG not found in', array);
					// not found case
					this.exit(elt).then(() => {
						this.element.removeChild(elt);
					});
				} else {
					console.log('JLG FOUND in', array);
					// found case: keep the element in the intersect array
					elt.$data$ = { item, index };
					intersection.push(elt.$data$);
					lastIndex = index;
				}
			}

			console.log('JLG array', array);

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
				const elt = this.addNewElement(obj);
				elt.$data$ = obj;
				console.log('JLG elt.$data$', elt.$data$);
				if (currentElt) {
					this.element.insertBefore(elt, currentElt);
				} else {
					this.element.appendChild(elt);
				}
				this.enter(elt).then(() => {});
			});
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

		onAddNewElement(addNewElement) {
			this.addNewElement = addNewElement;
			return this;
		}
	}

	window.DJ = DJ;

})();
