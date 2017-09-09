(function () {
    'use strict';

    class JLGBubbleChart extends circle.Element {
        render() {
            console.log('bubble render');
            this.root.innerHTML = 'coucou';
        }
    }
    JLGBubbleChart.register();
})();