(function() {
	'use strict';

    // const svg = document.createElement('svg');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.innerHTML = '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />';
    svg.setAttribute('width', 100);
    svg.setAttribute('height', 100);
	document.body.appendChild(svg);
})();
