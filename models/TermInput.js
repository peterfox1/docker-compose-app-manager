
const stdin = process.stdin.setEncoding('utf-8');


let TermInput = function(_opt) {
	
	let opt = {
		defaults: null,	// { inputRef: value }
		stdout: process.stdout,	// set to null to disable.
	};
	opt = { ...opt, ..._opt };
	
	this._defaults = opt.defaults || {};
	this._stdout = opt.stdout;
	
};


TermInput.prototype.capture = function(inputRef, _opt) {
	
	let opt = {
		question: null,
	};
	opt = { ...opt, ..._opt };
	
	let defaultValue = (typeof(this._defaults[inputRef]) !== 'undefined') ? this._defaults[inputRef] : null ;
	
	// Print question/defult value
	if (this._stdout) {
		let questionLine = [];
		if (opt.question) { questionLine.push(opt.question); }	// question text
		if (defaultValue) { questionLine.push(`(${defaultValue})`); }	// default value
		
		if (questionLine.length > 0) {
			this._stdout.write(questionLine.join(' ') + ': ');
		}
	}
	
	// Return input promise
	return new Promise(function (resolve, reject) {
		stdin.resume();
		stdin.on('data', function (input) {
			input = input.trim();
			
			if (!input && defaultValue) {	// no input, return default value.
				input = defaultValue;
			}
			
			stdin.pause();
			resolve(input);
		});
	});
	
};



module.exports = TermInput;


