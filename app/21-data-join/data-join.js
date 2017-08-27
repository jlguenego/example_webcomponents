(function() {
	'use strict';

	// const a1 = ['A', 'A', 'A', 'B', 'C'];
    // const a2 = ['A', 'B', 'A', 'D'];

    // const a1 = ['A', 'B', 'A', 'D'];
    // const a2 = ['A', 'A', 'A', 'B', 'C'];

    const n = 10;
    const a1 = Array.apply(null, {length: n}).map(Number.call, Number)
    const a2 = a1.filter(n => n % 2);
    
	class DJ {

		constructor(selector, template) {
			this.element = document.querySelector(selector);
			this.template = document.querySelector(template);
			if (!this.element || !this.template) {
				throw new Error('cannot find the selector or the template: %s %s', selector);
			}
			this.data = [];
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
			const elts = this.element.querySelectorAll('[data-join]');
			let lastIndex = -1;
			const intersection = [];
			for (let i = 0; i < elts.length; i++) {
				const item = elts[i].$data$.item;
				const index = array.indexOf(item, lastIndex + 1);
				if (index === -1) {
					// not found case
					this.exit(elts[i]).then(() => {
						this.element.removeChild(elts[i]);
					});
				} else {
					// found case: keep the element in the intersect array
                    elts[i].$data$ = { item, index };
					intersection.push({ item, index });
					lastIndex = index;
				}
			}

			const newItems = array
				.map((n, i) => { return { item: n, index: i }; })
				.filter(obj => {
					return !intersection.find(x => x.item === obj.item && x.index === obj.index);
				});
			let i = 0;
			newItems.forEach((obj) => {
				let currentElt = elts[i];
				while (currentElt && currentElt.$data$.index < obj.index) {
					i++;
					currentElt = elts[i];
				}
				const doc = document.importNode(this.template.content, true);
                doc.querySelector('[name="letter"]').innerHTML = obj.item;
                const elt = doc.querySelector('[data-join]');
				elt.$data$ = obj;
				if (currentElt) {
					this.element.insertBefore(elt, currentElt);
				} else {
                    this.element.appendChild(elt);
                }
                this.enter(elt).then(() => {
                });

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

	const dj = new DJ('my-work-area', '#cities');
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
