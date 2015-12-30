Event = function(){
	
};

Event.prototype.addEvent = function(type, fn){
	if(type == null || typeof type != 'string'
		|| fn == null || typeof fn != 'function'){
		return false;
	}
	
	if(this.hasOwnProperty('listeners') == false){
		this.listeners = new Object();
	}
	
	var func = new Func();
	func.setup(fn, this, arguments.length<=2?null:Array(arguments).slice(2));
	this.listeners[type] = func;
	return true;
};

Event.prototype.delEvent = function(type){
	if(this.hasOwnProperty('listeners') == false
		|| this.listeners.hasOwnProperty(type) == false){
		return true;
	}
	
	delete this.listeners[type];
	return true;
};

Event.prototype.hasListener = function(type){
	if(this.hasOwnProperty('listeners') == false){
		return false;
	}
	
	return this.listeners.hasOwnProperty(type);
};

Event.prototype.fireEvent = function(type){
	if(this.hasListener(type) == false){
		return false;
	}
	
	var func = this.listeners[type];
	var args = null;
	if(arguments.length > 1){
		for(var i=1; i<arguments.length; i++){
			if(args == null){
				args = [];
			}
			
			args.push(arguments[i]);
		}
	}
	func.doit2(args);
	
	return true;
};

