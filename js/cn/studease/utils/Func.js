Func = function(func, thisArg, args){
	this.func = null;
	this.thisArg = null;
	this.args = null;
	
	this.setup(func, thisArg, args);
};
	
Func.prototype.setup = function(func, thisArg, args){
	if(func == null || typeof func != 'function'){
		return -1;
	}
	
	this.func = func;
	this.thisArg = thisArg;
	this.args = args;
	
	return 0;
};

Func.prototype.doit = function(){
	if(this.func == null || typeof this.func != 'function'){
		return -1;
	}
	
	this.func.apply(this.thisArg, this.args==null?arguments:this.args.concat(arguments));
};

Func.prototype.doit2 = function(){
	if(this.func == null || typeof this.func != 'function'){
		return -1;
	}
	
	this.func.apply(this.thisArg, this.args==null?arguments[0]:this.args.concat(arguments[0]));
};
