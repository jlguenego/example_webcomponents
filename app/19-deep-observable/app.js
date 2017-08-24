(function() {
	'use strict';

	function stackTrace() {
		const err = new Error();
		return err.stack;
	}

	const object = {};

	const handler = {
		set(target, key, value) {
			if (Array.isArray(target) && key === 'length') {
				return true;
			}
			console.log(`Setting value ${key} as ${value}`, stackTrace());
			if (value !== null && typeof value === 'object') {
				target[key] = new Proxy(value, handler);
			} else {
				target[key] = value;
			}
			
			return true;
		},

		deleteProperty(target, key) {
			console.log(`Deleting value ${key}`, stackTrace());
			return true;
		}
	};

    const model = new Proxy(object, handler);
    
	model.hello = 'world';
	model.obj = { hello: 'world'};
	model.obj.hello = model.hello;
	model.obj.foo = model.obj;
	delete model.obj;

	model.list = [{name: 'Paris', population: '2 000 000'}];
	model.list.push({name: 'Nancy', population: '100 000'});
})();
