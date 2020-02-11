
// node ensite.js site-name

const composeManager = require('models/composeManager');


console.log((function(){

	let arg = process.argv;
	let siteRef = arg[2];
	
	return composeManager.enableSite(siteRef);
	
})());
