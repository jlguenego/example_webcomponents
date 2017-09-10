(function () {
    class OValue extends circle.Behavior {
        constructor(elt) {
            super(elt);
            console.log('this.elt', this.elt);
            this.elt.addEventListener('input', () => {
                console.log('input event');
                this.host.setModel(this.key, this.elt.value);
            });
            this.elt.form.addEventListener('reset', () => {
                console.log('reset event', this.key, '');
                this.host.setModel(this.key, '');
            });
        }
    }
    OValue.register();
})();