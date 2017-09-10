(function () {
    class OValue extends circle.Behavior {
        constructor(elt) {
            super(elt);
            console.log('this.elt', this.elt);
            this.elt.addEventListener('input', () => {
                console.log('input event');
                this.host.setModel(this.key, this.elt.value);
            });
            if (this.elt.form) {
                this.elt.form.addEventListener('reset', () => {
                    console.log('reset event', this.key, '');
                    this.host.setModel(this.key, '');
                });
            }
        }

        onDigest(key) {
            this.render();
        }

        render() {
            this.elt.value = this.host.getModel(this.key) || '';
        }
    }
    OValue.register();
})();