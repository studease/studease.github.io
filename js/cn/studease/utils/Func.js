Func = function(){
	this.func = null;
	this.thisArg = null;
	this.args = [];
};
	
Func.prototype.setup = function(func, thisArg, args){
	if(func == null || typeof func != 'function'){
		return -1;
	}
	
	this.func = func;
	this.thisArg = thisArg;
	this.args = args || this.args;
	
	return 0;
};

Func.prototype.doit = function(){
	if(this.func == null || typeof this.func != 'function'){
		return -1;
	}
	
	this.func.apply(this.thisArg, this.args.concat(arguments));
};
