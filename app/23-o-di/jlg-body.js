class JLGBody extends circle.Element {

	doAction() {
		console.log('doAction start');
		const http = circle.get('http');

		http.get('content.json').then((response) => {
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
JLGBody.register();
