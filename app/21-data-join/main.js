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
	const element = document.querySelector('my-work-area');
	const template = element.querySelector('template');
    
	const dj = new window.DJ(element, 'data-join');
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

	function makeSlot(obj) {
		let html = '';
		const nodes = template.content.querySelectorAll('slot');
		nodes.forEach(node => {
			const name = node.getAttribute('name');
			const value = eval('obj.' + name);
			html += `<span slot="${name}">${value}</span>`;
		});
		return html;
	}

	dj.onAddNewElement(function(obj) {
		const elt = document.createElement('data-join');
		const root = elt.attachShadow({ mode: 'closed' });
		const docFrag = document.importNode(template.content, true);
		root.appendChild(docFrag);
		elt.innerHTML = makeSlot(obj);
		return elt;
	});

	let array = Object.assign([], a1);
	dj.update(array);
	array = Object.assign([], a2);
	setInterval(() => {
		dj.update(array);
		array = (array === a1) ? Object.assign([], a2) : Object.assign([], a1);;
	}, 3000);

})();
