class OShow {
    constructor(elt) {
        console.log('%s constructor', this.constructor.name, elt);
        this.elt = elt;
        this.expr = this.elt.getAttribute('o-show');
        console.log('this.expr', this.expr);
        this.expr = this.expr.replace(/^\[(.*)\]$/g, '$1');
        console.log('this.expr', this.expr);
        this.wc = elt.getRootNode().host;        
        console.log('wc', this.wc);
        this.wc.bindKey(this.expr, this);
        this.onDigest(this.expr);
    }

    onDigest(key) {
        const show = this.wc.model[this.expr];
        console.log('show', show);
        if (show) {
            console.log('we want to show');
            this.elt.classList.remove('o-hide');
        } else {
            this.elt.classList.add('o-hide');
        }
    }
}
circle.behaviorRegistry['o-show'] = OShow;