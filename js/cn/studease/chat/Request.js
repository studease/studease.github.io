CxChat.Request = function(config){
	this.socket = null;
	this.ssid = null;
	
	//Runtime params
	this.chl = 0;
	
	this.setup = new Func(CxChat.setup, this);
	this.setup.doit(config);
	this.init();
};
CxChat.Request.extends(Event);

CxChat.Request.prototype.init = function(){
	
};

CxChat.Request.prototype.send = function(cmd, params){
	if(this.socket == null || cmd != 'CONNECT' && this.ssid == null){
		return false;
	}
	
	var raws = [];
	var raw = new Object();
	raw.cmd = cmd;
	raw.chl = this.chl++;
	if(params != null && typeof params == 'object'){
		raw.params = params;
	}
	if(cmd != 'CONNECT'){
		raw.ssid = this.ssid;
	}
	raws.push(raw);
	
	try{console.log('==> ' + raws.toSource());}catch(e){};
	this.socket.emit(cmd, raws);
};
