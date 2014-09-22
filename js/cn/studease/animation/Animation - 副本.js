Easing = function(params){
	//Necessary seetings
	this.nodes = [];
	
	//Available settings
	this.type = 'uniform acceleration';
	this.complete = null;
	this.repeat = 0;// repeat < 0: No time limit
	
	//Runtime params
	this.duration = 0;
	this.distance = 0;
	
	this.ready = false;
	
	this.setup(params);
};
Easing.prototype.setup = function(params){
	if(params == null || typeof params != 'object'){
		return -1;
	}
	
	for(var k in params){
		if(this.hasOwnProperty(k) == false){
			continue;
		}
		
		this[k] = params[k];
	}
	
	return 0;
};

Easing.prototype.init = function(){
	this.duration = 0;
	this.distance = 0;
	
	for(var i=0; i<this.nodes.length; i++){
		var node = this.nodes[i];
		this.duration += node.t;
		this.distance += node.s;
	}
	
	this.ready = true;
};

Easing.prototype.getOffset = function(time){
	if(this.ready == false){
		return 0;
	}
	
	if(time >= this.duration){
		return this.distance;
	}
	
	var t = 0, s = 0;
	for(var i=0; i<this.nodes.length; i++){
		var node = this.nodes[i];
		
		if(time < t+node.t){
			s += node.getOffset(time - t);
			break;
		}
		else{
			t += node.t;
			s += node.s;
			
			if(i == this.nodes.length-1){
				if(this.complete != null){
					this.complete.doit();
				}
			}
		}
	}
	
	return s;
};

Easing.prototype.add = function(node){
	this.nodes.push(node);
	this.duration += node.t;
	this.distance += node.s;
	
	return this.nodes.length;
};
Easing.prototype.clean = function(){
	this.nodes = [];
	this.duration = 0;
	this.distance = 0;
	
	this.ready = false;
	
	return 0;
};


Node = function(params, type, complete){
	this.vo = 0;
	this.a = 0;
	this.t = 0;
	this.v = 0;
	this.s = 0;
	
	this.type = '';
	this.complete = null;
	this.ready = false;
	
	this.setup(params, type, complete);
};

Node.prototype.setup = function(params, type, complete){
	if(params == null || typeof params != 'object'){
		return -1;
	}
	
	this.type = type || 'vts';
	this.complete = complete;
	this.ready = true;
	
	switch(this.type){
		case 'vat':
			this.vo = params.vo;
			this.a = params.a;
			this.t = params.t;
			this.v = this.vo + this.a * this.t;
			this.s = this.vo * this.t + 0.5 * this.a * Math.pow(this.t,2);
		break;
		case 'vav':
			this.vo = params.vo;
			this.a = params.a;
			this.v = params.v;
			this.t = (this.v - this.vo) / this.a;
			this.s = 0.5 * (Math.pow(this.v,2) - Math.pow(this.vo,2)) / this.a;
		break;
		case 'vas':
			this.vo = params.vo;
			this.a = params.a;
			this.s = params.s;
			this.t = (this.v - this.vo) / this.a;
			this.v = Math.sqrt(2*this.a*this.s + Math.pow(this.vo,2));
		break;
		case 'vtv':
			this.vo = params.vo;
			this.t = params.t;
			this.v = params.v;
			this.a = (this.v - this.vo) / this.t;
			this.s = 0.5 * (this.vo + this.v) * this.t;
		break;
		case 'vts':
			this.vo = params.vo;
			this.t = params.t;
			this.s = params.s;
			this.a = 2 * (this.s - this.vo*this.t) / Math.pow(this.t,2);
			this.v = 2 * this.s / this.t - this.vo;
		break;
		case 'vvs':
			this.vo = params.vo;
			this.v = params.v;
			this.s = params.s;
			this.a = 0.5 * (Math.pow(this.v,2) - Math.pow(this.vo,2)) / this.s;
			this.t = 2 * this.s / (this.vo + this.v);
		break;
		default:
			this.ready = false;
	}
	
	return 0;
};

Node.prototype.getOffset = function(time){
	if(time == this.t || time < 1){
		if(this.complete != null){
			this.complete.doit();
		}
	}
	
	var s = this.vo*time + 0.5 * this.a * Math.pow(time,2);
	return s;
};

