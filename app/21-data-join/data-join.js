(function() {
	'use strict';

	const a1 = ['A', 'C', 'D', 'U', 'V', 'C', 'D', 'Z'];
	const a2 = ['B', 'C', 'D', 'X', 'D', 'V', 'U', 'D'];

	

	class DJ {

		constructor(selector, template, data) {
			this.element = document.querySelector(selector);
			this.template = document.querySelector(template);
			if (!this.element || !this.template) {
				throw new Error('cannot find the selector: %s', selector);
			}
		}

		update(array) {
            // a1 -> intersect -> a2
            const a1 = this.element.querySelectorAll('[name="dj"]');
            for (let i = 0; i < a1.length; i++) {
                const item = a1[i].$data$.item;
                if (!a2.includes(item)) {
                    this.exit(a1[i]).then(() => {
                        this.element.removeChild(a1[i]);
                    });
                    
                }
            }

			array.forEach((item, index) => {
                const elt = document.importNode(this.template.content, true);
                console.log('elt %O', elt);
                elt.querySelector('[name="letter"]').innerHTML = item;
                elt.querySelector('[name="dj"]').$data$ = {item, index};
                this.element.appendChild(elt);
            });
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
            }, 5000);
        });
    });
    dj.update(a1);
    console.log('dj', dj);
    setTimeout(() => {
        dj.update(a2);
    }, 3000);
	

})();
