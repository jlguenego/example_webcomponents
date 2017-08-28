(function() {
	'use strict';

	// const a1 = ['A', 'A', 'A', 'B', 'C'];
	// const a2 = ['A', 'B', 'A', 'D'];

	// const a1 = ['A', 'B', 'A', 'D'];
	// const a2 = ['A', 'A', 'A', 'B', 'C'];

	// const n = 10;
	// const a1 = Array.apply(null, { length: n }).map(Number.call, Number)
	// 	.map(n => { return { value: n, value2: 2 * n }; });
	// const a2 = a1.filter(n => n.value % 2);
	const element = document.querySelector('my-work-area');
	const template = element.querySelector('template');

	const a1 = new Proxy([new Proxy({
		name: 'Paris',
		population: 2000000
	}, {}), new Proxy({
		name: 'Nancy',
		population: 100000
	}, {}), new Proxy({
		name: 'Lunéville',
		population: 20000
	}, {})], {});

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

	dj.update(a1);
	a1.splice(0, 1);
	setInterval(() => {
		dj.update(a1);
		if (a1.length === 2) {
			a1.unshift({
				name: 'Paris',
				population: 2000000
			});
		} else {
			a1.splice(0, 1);
		}
	}, 3000);

})();
