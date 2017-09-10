class OShow {
    constructor(elt) {
        console.log('%s constructor', this.constructor.name, elt);
        this.elt = elt;
        this.expr = this.elt.getAttribute('o-show');
        console.log('this.expr', this.expr);
        this.expr = this.expr.replace(/^\[(.*)\]$/g, '$1');
        console.log('this.expr', this.expr);
        const wc = elt.getRootNode();        
        console.log('wc', wc);
        
    }
}
circle.behaviorRegistry['o-show'] = OShow;