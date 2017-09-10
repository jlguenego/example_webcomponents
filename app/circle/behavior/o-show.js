(function () {
    class OShow extends circle.Behavior {
        constructor(elt) {
            super(elt);
            
            const key = this.elt.getAttribute('o-show').replace(/^\[(.*)\]$/g, '$1');
            this.host.bindKey(key, this);
            this.onDigest(key);
        }

        onDigest(key) {
            const show = this.host.model[key];
            if (show) {
                this.elt.classList.remove('o-hide');
            } else {
                this.elt.classList.add('o-hide');
            }
        }
    }
    circle.behaviorRegistry['o-show'] = OShow;
})();