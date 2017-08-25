(function() {
	'use strict';

	const a1 = ['A', 'B', 'C'];
	const a2 = ['C', 'B', 'D', 'Z'];

	function insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}



	class DJ {

		constructor(selector, template) {
			this.element = document.querySelector(selector);
			this.template = document.querySelector(template);
			if (!this.element || !this.template) {
				throw new Error('cannot find the selector: %s', selector);
			}
			this.data = [];
		}

		update(array) {

			// 1) remove
            const elts = this.element.querySelectorAll('[name="dj"]');
            let lastIndex = -1;
            const intersect = [];
			for (let i = 0; i < elts.length; i++) {
				const item = elts[i].$data$;
				const index = array.indexOf(item);
				if (index <= lastIndex) {
					this.exit(elts[i]).then(() => {
						this.element.removeChild(elts[i]);
					});
				} else {
					intersect.push({ item, index });
                }
                lastIndex = index;
            }
            console.log('intersect', intersect);

			const newItems = array.filter(n => { 
                return !intersect.find(x => x.item === n);
            });
			console.log('newItems', newItems);

			newItems.forEach((item, index) => {
				const elt = document.importNode(this.template.content, true);
				console.log('elt %O', elt);
				elt.querySelector('[name="letter"]').innerHTML = item;
				elt.querySelector('[name="dj"]').$data$ = item;
				this.element.appendChild(elt);
			});
			this.data = array;
			return this;
		}
		onExit(promise) {
			this.exit = promise;
			return this;
		}
	}



	window.DJ = DJ;

	const dj = new DJ('my-work-area', '#cities');
	dj.onExit(function(elt) {
		return new Promise((fulfill, reject) => {
			console.log('about to exit in 2s', elt.$data$);
			elt.className += 'leaving';
			setTimeout(() => {
				console.log('exit');
				fulfill();
			}, 4000);
		});
	});
	dj.update(a1);
	console.log('dj', dj);
	setTimeout(() => {
		dj.update(a2);
	}, 3000);


})();
