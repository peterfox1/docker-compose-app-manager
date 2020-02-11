
const cfg = require('./cfg');

const fs = require('fs-extra');
const YAML = require('yaml');



let ComposeManager = function(_opt) {
	
	this._FILE_LIVE = 'docker-compose.yml';
	this._FILE_ALL = 'docker-compose.all';
	
	
	
	let opt = {
		dirPath: cfg.rootDir,
		..._opt,
	};
	
	this._dirPath = opt.dirPath;
	
	this._compose_parsed = {};	// memory cache of parsed file data
	
};


ComposeManager.prototype.enableSite = function(siteRef) {
	
	let siteCfg = this._findSite(siteRef);
	
	if (!siteCfg) {
		throw new Error(`Site not found: '${siteRef}'`)
	}
	
	let liveCompose = this._readComposeData(this._FILE_LIVE);
	
	
	
	console.log(siteCfg);
	
};




/**
 * Check that the configs are valid.
 *  - Ensure there's no sites enabled that aren't in 'all'
 */
ComposeManager.prototype.validate = function() {
	// TODO
};

/**
 * Fix config validation errors.
 *  - Move missing sites from live to all.
 */
ComposeManager.prototype.fix = function() {
	// TODO
};




//region --- Data Lookup ---

ComposeManager.prototype._findSite = function(siteRef, _opt) {
	
	let opt = {
		filename: this._FILE_ALL,	// Default to find the site in all data.
		..._opt,
	};
	
	let allSites = this._readComposeData(opt.filename);
	
	if (typeof(allSites[siteRef]) === 'undefined') {
		return null;
	}
	
	return allSites[siteRef];
	
};

ComposeManager.prototype._findSitesUsingPort = function(portNo, _opt) {
	
	let opt = {
		filename: this._FILE_ALL,	// Default to find the site in all data.
		..._opt,
	};
	
	let allSites = this._readComposeData(opt.filename);
	
	if (typeof(allSites[siteRef]) === 'undefined') {
		return null;
	}
	
	return allSites[siteRef];
	
};

//endregion


//region --- Read / Write YML ---

/**
 * Read one or more files.
 *
 * Always returns an object.
 *
 * @param array|string filenames
 * @return {{}}
 * @private
 */
ComposeManager.prototype._readComposeData = function(filenames) {
	
	if (typeof(filenames) === 'string') { filenames = [filenames]; }	// convert a single filename to array.
	
	let composeData = {};
	
	for (let i = 0; i < filenames.length; i++) {
		let filename = filenames[i];
		let fileComposeData = this._readComposeDataFromFile(filename);
		composeData = {
			...fileComposeData,
			...composeData,	// Prioitise first file's data
		};
	}
	
	return composeData;
	
};

/**
 * Read and parse a single file.
 *
 * Always returns an object.
 *
 * @param filename
 * @return {{}}
 * @private
 */
ComposeManager.prototype._readComposeDataFromFile = function(filename) {
	
	if (typeof(this._compose_parsed[filename]) === 'undefined') {	// Ensure key exists in cache object
		this._compose_parsed[filename] = null;
	}
	
	// Check if we need to load data
	if (!this._compose_parsed[filename]) {
		// Attempt to load & parse the file.
		try { var file = fs.readFileSync(this._getComposePath(filename), 'utf8'); }
		catch (e) { return {}; }
		
		this._compose_parsed[filename] = YAML.parse(file) || {};
	}
	
	return this._compose_parsed[filename];
};

ComposeManager.prototype._writeComposeData = function(filename, composeData) {
	
	fs.writeFileSync(this._getComposePath(filename), YAML.stringify(composeData));
	return true;
	
};


ComposeManager.prototype._getComposePath = function(filename) {
	return this._dirPath + filename;
};

//endregion



module.exports = new ComposeManager();