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
				throw new Error('cannot find the selector: %s', selector);
			}
			this.data = [];
		}

		update(array) {
			console.log('origin', this.data);
			console.log('destination', array);

			// 1) remove
			const elts = this.element.querySelectorAll('[name="dj"]');
			let lastIndex = -1;
			const intersect = [];
			for (let i = 0; i < elts.length; i++) {
				const item = elts[i].$data$.item;
				const index = array.indexOf(item, lastIndex + 1);
				if (index === -1) {
					console.log('not found', item);
					this.exit(elts[i]).then(() => {
						this.element.removeChild(elts[i]);
					});
				} else {
                    elts[i].$data$ = { item, index };
					intersect.push({ item, index });
					lastIndex = index;
				}

			}

			console.log('intersect', intersect);


			const newItems = array
				.map((n, i) => { return { item: n, index: i }; })
				.filter(obj => {
					return !intersect.find(x => x.item === obj.item && x.index === obj.index);
				});

			console.log('newItems', newItems);


			console.log('elts', elts);
			let i = 0;
			newItems.forEach((obj) => {
				let currentElt = elts[i];
				while (currentElt && currentElt.$data$.index < obj.index) {
					i++;
					currentElt = elts[i];
				}
				const doc = document.importNode(this.template.content, true);
                doc.querySelector('[name="letter"]').innerHTML = obj.item;
                const elt = doc.querySelector('[name="dj"]');
				elt.$data$ = obj;
				if (currentElt) {
					this.element.insertBefore(elt, currentElt);
				} else {
                    this.element.appendChild(elt);
                }
                this.enter(elt).then(() => {
                    console.log('element added');
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
            console.log('enter', elt);
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
