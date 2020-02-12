
// node conf.js en|dis|new container_name

const composeManager = require('./models/composeManager.js');

(async function() {
	
	let action = process.argv[2];
	
	switch (action) {
		case 'en':
			return await composeManager.enableApp(process.argv[3]);
		case 'dis':
			return await composeManager.disableApp(process.argv[3]);
		case 'new':
			return await composeManager.newApp(process.argv[3]);
	}
	
	return { error: 'expected: conf.js en|dis|new container_name' };
	
})().then(function (result) {
	console.log('', result);
})
;