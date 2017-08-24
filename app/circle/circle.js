(function() {
	'use strict';

	// window.console = {
	// 	log: function() {
	// 		var args = Array.prototype.slice.call(arguments);
	// 		var str = args.join(' ');
	// 		var node = document.createTextNode('log: ' + str);
	// 		var para = document.createElement('span');
	// 		para.appendChild(node);
	// 		para.appendChild(document.createElement('br'));
	// 		document.body.appendChild(para);
	// 		// alert(str);
	// 	}
	// };

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
		console.log('parseExpr');
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
				console.log('parseExpr replace ' + name);
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
			};
		}
	}

	class Databinding {
		constructor(circleElement) {
			this.elt = circleElement;
			this.scope = {};
		}

		initScope() {
			for (let i = 0; i < this.elt.attributes.length; i++) {
				const key = this.elt.attributes[i].name;
				const value = this.elt.attributes[i].value;
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
			this.initScope();
			let isEmpty = true;
			for (let attr in this.scope) {
				isEmpty = false;
				if (this.scope[attr] === DBNotation.scope.LITTERAL) {
					console.log('about to get attribute literal %s to %s', attr, this.elt.getAttribute(attr));
					this.elt.model[attr] = this.elt.getAttribute(attr);
					continue;
				}

				const modelVar = this.getModelVar(attr);
				this.elt.bindKey(modelVar);
				this.elt.onDigest(modelVar);
			}
			if (isEmpty) {
				this.elt.render();
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
			this.elt.render();
		}

		digest(key) {
			if (key in this.scope) {
				if (this.scope[key] === DBNotation.scope.LITTERAL) {
					console.log('about to set attribute literal %s to %s', key, this.elt.model[key]);
					this.elt.setAttribute(key, this.elt.model[key]);
				}
				if (this.scope[key] === DBNotation.scope.TWO_WAYS) {
					const modelVar = this.getModelVar(key);
					if (this.elt.getParent().model[modelVar] !== this.elt.model[key]) {
						this.elt.getParent().model[modelVar] = this.elt.model[key];
					}
				}
			}
			this.elt.render();
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

			function handler(parentKey) {
				return {
					set(target, key, value) {
						const absoluteKey = (parentKey) ? `${parentKey}['${key}']` : key;
						if (Array.isArray(target)) {
							if (key === 'length') {
								return true;
							}
						}
						if (value !== null && typeof value === 'object') {
							target[key] = new Proxy(value, handler(absoluteKey));
						} else {
							target[key] = value;
						}
						circle.digestId++;
						console.log('%d: %s: update %s to %s',
							circle.digestId, self.constructor.name, absoluteKey, value);
						self.digest(absoluteKey);
						return true;
					},
			
					deleteProperty(target, key) {
						// TODO: later...
						return true;
					}
				};
			}

			this.model = new Proxy({}, handler());
			this.digestRegistry = {};
			this.templateSelector = '#' + this.constructor.tag;
			this.databinding = new Databinding(this);
		}

		getParent() {
			return this.getRootNode().host;
		}
		parseExpr(node) {
			parseExpr(node);
		}
		connectedCallback() {
			// o-if
			this.originalContent = this.cloneNode(true);
			this.root = this.root || this.attachShadow({
				mode: 'closed'
			});
			// to find the template, Firefox works differently.
			const myDoc = (isFirefox() || isEdge() || (document.currentScript === null)) ?
				doc : document.currentScript.ownerDocument;
			const t = myDoc.querySelector(this.templateSelector);
			if (t) {
				const clone = document.importNode(t.content, true);
				this.parseExpr(clone);
				this.root.innerHTML = '';
				this.root.appendChild(clone);
			}
			this.databinding.connectedCallBack();
			console.log('connectedCallback end', this.constructor.name);
		}

		render() {}

		onDigest(key) {
			this.databinding.onDigest(key);
		}
		bindKey(key) {
			console.log('bindKey %O', this.getParent());
			const digestRegistry = this.getParent().digestRegistry;
			if (digestRegistry[key] === undefined) {
				digestRegistry[key] = [this];
			} else {
				digestRegistry[key].push(this);
			}
		}

		digest(key) {
			if (this.digestRegistry[key]) {
				this.digestRegistry[key].forEach((elt, index) => {
					elt.onDigest(key);
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
			this.digestId = 0;
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
			console.log('this.model.expr', this.model.expr);
			this.root.innerHTML = (this.model.expr === undefined) ? '' : this.model.expr;
		}
	}
	CircleExpr.register();
})();
