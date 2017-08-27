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
    
	const dj = new window.DJ(element, template);
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
