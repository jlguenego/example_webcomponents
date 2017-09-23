class JLGBody extends o.Element {

	doAction() {
		console.log('doAction start');
		const xhr = o.di('xhr');

		xhr.get('content.json').then((response) => {
			const div = this.root.querySelector('#content');
			div.innerHTML = response.data.content;
		}).catch((error) => {
			console.log('error', error);
		});
	}

	reset() {
		console.log('reset start');
		const div = this.root.querySelector('#content');
		div.innerHTML = '';
	}
}
JLGBody.reg;
