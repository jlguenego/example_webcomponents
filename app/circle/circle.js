(function() {
	'use strict';

	let digestId = 0;

	// Firefox and Edge does not understand well currentScript after init.
	// So we keep this pointer for later.
	const doc = document.currentScript.ownerDocument;

	/**
	 * Translate a string from CamelCase to spinal-case.
	 * Note: works well with SPECIALCamelCase as well.
	 * 
	 * @param {string} str - CamelCase string
	 * @returns spinal-case equivalent string.
	 */
	function camel2Spinal(str) {
		// handle case like JLGStars becoming jlg-stars
		str = str.replace(/^([A-Z]+)([A-Z][a-z])/g, '$1-$2');
		// then do the traditional conversion to spinal case.
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}

	/**
	 * check if the user agent is Firefox
	 * 
	 * @returns true if user agent is Firefox, false otherwise.
	 */
	function isFirefox() {
		return navigator.userAgent.match(/Firefox/) !== null;
	}

	/**
	 * check if the user agent is Microsoft Edge
	 * 
	 * @returns true if user agent is Edge, false otherwise.
	 */
	function isEdge() {
		return navigator.userAgent.match(/Edge/) !== null;
	}

	/**
	 * We want the user be able to easily insert expression like in AngularJS.
	 * But internally, the {{myModelVar}} must be converted to <circle-expr expr="[myModelVar]"></circle-expr>
	 * 
	 * @param {any} elt 
	 */
	function parseExpr(elt) {
		const walk = document.createTreeWalker(elt, NodeFilter.SHOW_TEXT, null, false);
		let array = [];
		for (let node = walk.nextNode(); node !== null; node = walk.nextNode()) {
			if (node.data.match(/{{(.*?)}}/g)) {
				array.push(node);
			}
		}
		array.forEach((node) => {
			const replacementNode = document.createElement('span');
			replacementNode.innerHTML = node.data.replace(/{{(.*?)}}/g, (match, name) => {
				return `<circle-expr expr="[${name}]"></circle-expr>`;
			});
			const parentNode = node.parentNode;
			parentNode.insertBefore(replacementNode, node);
			parentNode.removeChild(node);
		});
	}

	class DBNotation {
		/**
		 * Tests if the notation is a 2 ways data binding.
		 * Notation is for the time being: [[...]]
		 * 
		 * @param {any} value 
		 * @returns 
		 */
		static isTwoWays(value) {
			return value.match(/^\[\[.*\]\]$/);
		}

		/**
		 * Tests if the notation is a 1 way data binding.
		 * Notation is for the time being: [...]
		 * 
		 * @param {any} value 
		 * @returns 
		 */
		static isOneWay(value) {
			return value.match(/^\[.*\]$/);
		}

		static extractModelVar(value) {
			return value.replace(/\[|\]/g, '');
		}

		static get scope() {
			return {
				TWO_WAYS: '=',
				ONE_WAY: '<',
				LITTERAL: '@'
			}
		}
	}

	class Databinding {
		constructor(circleElement) {
			this.elt = circleElement;
			this.scope = {};
			for (let i = 0; i < circleElement.attributes.length; i++) {
				const key = circleElement.attributes[i].name;
				const value = circleElement.attributes[i].value;
				if (DBNotation.isTwoWays(value)) {
					this.scope[key] = DBNotation.scope.TWO_WAYS;
				} else if (DBNotation.isOneWay(value)) {
					this.scope[key] = DBNotation.scope.ONE_WAY;
				} else {
					this.scope[key] = DBNotation.scope.LITTERAL;
				}
			}
		}

		getModelVar(attr) {
			return DBNotation.extractModelVar(this.elt.getAttribute(attr));
		}

		connectedCallBack() {
			let isEmpty = true;
			for (let attr in this.scope) {
				isEmpty = false;
				if (this.scope[attr] === DBNotation.scope.LITTERAL) {
					this.elt.model[attr] = this.elt.getAttribute(attr);
					continue;
				}

				const modelVar = this.getModelVar(attr);
				this.elt.bindKey(modelVar);
				this.elt.onDigest(modelVar, digestId);
			}
			if (isEmpty) {
				this.elt.render(digestId);
			}
		}

		onDigest(key) {
			for (let attr in this.scope) {
				if (this.scope[attr] === DBNotation.scope.LITTERAL) {
					continue;
				}
				const modelVar = this.getModelVar(attr);
				if (modelVar === key) {
					if (this.elt.model[attr] !== this.elt.getParent().model[key]) {
						this.elt.model[attr] = this.elt.getParent().model[key];
						return;
					}
				}
			}
			this.elt.render(digestId);
		}

		digest(key) {
			for (let attr in this.scope) {
				if (this.scope[attr] === DBNotation.scope.LITTERAL) {
					this.elt.setAttribute(attr, this.elt.model[attr]);
					continue;
				}
				const modelVar = this.getModelVar(attr);
				if (attr === key && this.scope[attr] === DBNotation.scope.TWO_WAYS) {
					if (this.elt.getParent().model[modelVar] !== this.elt.model[attr]) {
						this.elt.getParent().model[modelVar] = this.elt.model[attr];
					}
				}
			}
			this.elt.render(digestId);
		}
	}

	/**
	 * A component in circle must extends the circle.Element class
	 * which is a pointer on the CircleElement class.
	 * 
	 * @class CircleElement
	 * @extends {HTMLElement}
	 */
	class CircleElement extends HTMLElement {
		static get tag() {
			return camel2Spinal(this.name);
		}
		static register() {
			window.customElements.define(this.tag, this);
		}
		constructor() {
			super();
			const self = this;
			this.model = new Proxy({}, {
				set(target, key, value) {

					target[key] = value;
					digestId++;
					console.log('%d: %s: update %s to %s', digestId, self.constructor.name, key, value);
					self.digest(key, digestId);

					return true;
				},
			});
			this.digestRegistry = {};
			this.templateSelector = '#' + this.constructor.tag;
			this.databinding = new Databinding(this);
		}

		getParent() {
			return this.getRootNode().host;
		}
		connectedCallback() {
			// o-if
			this.originalContent = this.innerHTML;
			this.innerHTML = '';

			this.root = this.attachShadow({
				mode: 'closed'
			});
			// to find the template, Firefox works differently.
			const myDoc = (isFirefox() || isEdge() || (document.currentScript === null)) ?
				doc : document.currentScript.ownerDocument;
			const t = myDoc.querySelector(this.templateSelector);
			if (t) {
				const clone = document.importNode(t.content, true);
				parseExpr(clone);
				this.root.innerHTML = '';
				this.root.appendChild(clone);
			}
			this.databinding.connectedCallBack();
		}
		render(digestId) {}

		onDigest(key, digestId) {
			this.databinding.onDigest(key);
		}
		bindKey(key) {
			const digestRegistry = this.getParent().digestRegistry;
			if (digestRegistry[key] === undefined) {
				digestRegistry[key] = [this];
			} else {
				digestRegistry[key].push(this);
			}
		}

		digest(key, digestId) {
			if (this.digestRegistry[key]) {
				this.digestRegistry[key].forEach((elt, index) => {
					elt.onDigest(key, digestId);
				});
			}
			this.databinding.digest(key);
		}
	}

	/**
	 * The Circle class is the exposed class of the library.
	 * The circle.js produces a global variable window.circle which is the hook
	 * to all functionalities of this library.
	 * 
	 * @class Circle
	 */
	class Circle {
		constructor() {
			this.Element = CircleElement;
		}

		stackTrace() {
			var err = new Error();
			return err.stack;
		}
	}
	window.circle = new Circle();

	/**
	 * CircleExpr is the component that allows displaying expressions.
	 * 
	 * @class CircleExpr
	 * @extends {circle.Element}
	 */
	class CircleExpr extends CircleElement {
		render() {
			this.root.innerHTML = (this.model.expr === undefined) ? '' : this.model.expr;
		}
	}
	CircleExpr.register();
})();
