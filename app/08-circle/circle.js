(function() {
	'use strict';

	class CircleElement extends HTMLElement {
		
		connectedCallback() {
            console.log('connectedCallback', this.constructor.name);
            this.isElementConnected = true;
			this.root = this.attachShadow({
				mode: 'closed'
			});
			circle.digestRegistry.push(this);
			this.render();
		}
		render() {}
		onDigest() {
            if (!this.isElementConnected) {
                return;
            }
			this.render();
		}
	}

	class Circle {
		constructor() {
			const circle = this;
			const handler = {
				set(target, key, value) {
					console.log(`Setting value ${key} as ${value}`)
					target[key] = value;
					circle.digest();
					return true;
				},
			};
			this.model = new Proxy({}, handler);
			this.digestRegistry = [];
			this.CircleElement = CircleElement;
		}
		digest() {
			console.log('digest start');
			let counter = 0;
			this.digestRegistry.forEach((elt, index) => {
				elt.onDigest();
				counter++;
			});
			console.log('digest end in %d steps', counter);
		}
	}
	window.circle = new Circle();
})();
