
const fs = require('fs-extra');
const YAML = require('yaml');

const cfg = require('./cfg');
const TermInput = require('./TermInput');


let ComposeManager = function(_opt) {
	
	this._FILE_ACTIVE = 'docker-compose.yml';
	this._FILE_ALL = 'docker-compose.all.yml';
	
	
	let opt = {
		dirPath			: cfg.rootDir,
		DataInput		: TermInput,
		portStart		: cfg.portStart,
		portEnd			: cfg.portStart + cfg.portRange,
		..._opt,
	};
	
	this._dirPath		= opt.dirPath;
	this._DataInput		= opt.DataInput;
	this._portStart		= opt.portStart;
	this._portEnd		= opt.portEnd;
	
	this._compose_parsed = {};	// memory cache of parsed file data
	
};


ComposeManager.prototype.enableApp = async function(appRef) {
	
	let appConfig = this._findApp(appRef);
	if (!appConfig) { return { error: 'app not found' }; }
	
	let appConfig_active = this._findApp(appRef, { filename: this._FILE_ACTIVE });
	if (appConfig_active) { return { error: 'app already active', config: appConfig_active }; }
	
	
	let output = {};
	
	// TODO assign ports
	
	// TODO add to active file
	
	return output;
	
};


ComposeManager.prototype.disableApp = async function(appRef) {
	
	let appConfig = this._findApp(appRef);
	if (!appConfig) { return { error: 'app not found' }; }
	
	let appConfig_active = this._findApp(appRef, { filename: this._FILE_ACTIVE });
	if (!appConfig_active) { return { error: 'app already disabled', config: appConfig_active }; }
	
	
	let output = {};
	
	// TODO remove from active config
	
	return output;
	
};


ComposeManager.prototype.newApp = async function(appRef, _newAppConfig) {
	
	let appConfig_existing = this._findApp(appRef);
	if (appConfig_existing) { return { error: 'container config already exists', config: appConfig_existing }; }
	
	
	let newAppConfig = {
		appRef: appRef,
		containerType: 'build',
		container: './docker/_default',
		ports: '80,443',
	};
	
	let termInput = new this._DataInput({ defaults: newAppConfig });
	
	newAppConfig.containerType = await termInput.capture('containerType', { question: 'Type [image|build]' });
	newAppConfig.container = await termInput.capture('container', { question: 'Container name/path' });
	newAppConfig.ports = await termInput.capture('ports', { question: 'Ports' });
	
	
	let output = {};
	
	// TODO convert to appConfig
	
	// TODO assign port
	
	// TODO add to composeAll
	
	console.log('TODO newAppConfig', newAppConfig);
	
	return output;
	
};




/**
 * Check that the configs are valid.
 *  - Ensure there's no apps enabled that aren't in 'all'
 */
ComposeManager.prototype.validate = function() {
	// TODO
};

/**
 * Fix config validation errors.
 *  - Move missing apps from active to all.
 */
ComposeManager.prototype.fix = function() {
	// TODO
};




//region --- Data Lookup ---

ComposeManager.prototype._findApp = function(appRef, _opt) {
	
	let opt = {
		filename: this._FILE_ALL,	// Default to find the site in all data.
		..._opt,
	};
	
	let composeData = this._readComposeData(opt.filename);
	
	if (typeof(composeData[appRef]) === 'undefined') {
		return null;	// Site not found
	}
	
	return composeData[appRef];
	
};

ComposeManager.prototype._findAppUsingPort = function(portNo, _opt) {
	
	let opt = {
		filename: this._FILE_ALL,	// Default to find the site in all data.
		..._opt,
	};
	
	let composeData = this._readComposeData(opt.filename);
	
	// TODO search apps for the portNo
	
	return;
	
};

ComposeManager.prototype._getNextAvailablePort = function(_opt) {
	
	let opt = {
		filename: this._FILE_ALL,	// Default to find the site in all data.
		..._opt,
	};
	
	let composeData = this._readComposeData(opt.filename);
	
	// TODO get ports in use
	
	// TODO Increment by 10 from startPort to find the next available port.
	
	return;
	
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