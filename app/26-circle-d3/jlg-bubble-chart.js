(function() {
	'use strict';

	class JLGBubbleChart extends circle.Element {
		render() {
			this.root.innerHTML =
				'<svg width="400" height="400" font-family="sans-serif" font-size="10" text-anchor="middle"></svg>';
			const svgNode = this.root.querySelector('svg');
			const svg = d3.select(svgNode);
			const width = +svg.attr('width');
			const height = +svg.attr('height');

			const format = d3.format(',d');

			const color = d3.scaleOrdinal(d3.schemeCategory20c);

			const pack = d3.pack()
				.size([width, height])
				.padding(1.5);

			let csv = this.model.csv;
			if (csv === '') {
				return;
			}

			const data = d3.csvParse(csv, function(d) {
				d.value = +d.value;
				return d;
			});

			const root = d3.hierarchy({ children: data })
				.sum(function(d) { return d.value; })
				.each(function(d) {
					var id;
					if ((id = d.data.id)) {
						var i = id.lastIndexOf('.');
						d.id = id;
						d.package = id.slice(0, i);
						d.class = id.slice(i + 1);
					}
				});

			const node = svg.selectAll('.node')
				.data(pack(root).leaves())
				.enter().append('g')
				.attr('class', 'node')
				.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

			node.append('circle')
				.attr('id', function(d) { return d.id; })
				.attr('r', function(d) { return d.r; })
				.style('fill', function(d) { return color(d.package); });

			node.append('clipPath')
				.attr('id', function(d) { return 'clip-' + d.id; })
				.append('use')
				.attr('xlink:href', function(d) { return '#' + d.id; });

			node.append('text')
				.attr('clip-path', function(d) { return 'url(#clip-' + d.id + ')'; })
				.selectAll('tspan')
				.data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
				.enter().append('tspan')
				.attr('x', 0)
				.attr('y', function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
				.text(function(d) { return d; });

			node.append('title')
				.text(function(d) { return d.id + '\n' + format(d.value); });

		}
	}
	JLGBubbleChart.register();


})();
