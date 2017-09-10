(function () {
    class OShow extends circle.Behavior {
        constructor(elt) {
            super(elt);
            
            this.key = this.elt.getAttribute('o-show').replace(/^\[(.*)\]$/g, '$1');
            this.host.bindKey(this.key, this);
            this.onDigest(this.key);
        }

        onDigest(key) {
            this.render();
        }

        render() {
            const show = this.host.model[this.key];
            if (show) {
                this.elt.classList.remove('o-hide');
            } else {
                this.elt.classList.add('o-hide');
            }
        }
    }
    OShow.register();
})();