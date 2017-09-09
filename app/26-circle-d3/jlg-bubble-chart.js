(function() {
	'use strict';

	class JLGBubbleChart extends circle.Element {
		render() {
			if (!this.model.data) {
				return;
			}
			this.root.innerHTML =
				'<svg width="600" height="600" font-family="sans-serif" font-size="10" text-anchor="middle"></svg>';
			const svgNode = this.root.querySelector('svg');
			const svg = d3.select(svgNode);
			const width = +svg.attr('width');
			const height = +svg.attr('height');

			const color = d3.scaleOrdinal(d3.schemeCategory20c);

			const pack = d3.pack()
				.size([width, height])
				.padding(1.5);

			const root = d3.hierarchy({ children: this.model.data })
				.sum(function(d) { return d.value; })
				.each(function(d) {
					d.id = d.data.id;
				});

			const bubbleData = pack(root).leaves();
			console.log('bubbleData', bubbleData);

			const node = svg.selectAll('.node')
				.data(bubbleData)
				.enter().append('g')
				.attr('class', 'node')
				.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

			node.append('circle')
				.attr('id', function(d) { return d.id; })
				.attr('r', function(d) { return d.r; })
				.style('fill', function(d) { return color(d.id); });

			node.append('clipPath')
				.attr('id', function(d) { return 'clip-' + d.id; })
				.append('use')
				.attr('xlink:href', function(d) { return '#' + d.id; });

			node.append('text')
				.attr('clip-path', function(d) { return 'url(#clip-' + d.id + ')'; })
				.selectAll('tspan')
				.data(function(d) { 
					const result = d.data.labels; 
					console.log('result', result);
					return result;
				}).enter().append('tspan')
				.attr('x', 0)
				.attr('y', function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
				.text(function(d) { return d; });

			node.append('title')
				.text(function(d) { return d.data.tooltip; });

		}
	}
	JLGBubbleChart.register();


})();
