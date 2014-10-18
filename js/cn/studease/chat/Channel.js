CxChat.Channel = function(config){
	this.id = null;
	this.req = null;
	
	//Runtime params
	this.users = {};
	
	this.setup = new Func(CxChat.setup, this);
	this.setup.doit(config);
	this.init();
};
CxChat.Channel.extends(Event);

CxChat.Channel.prototype.init = function(){
	
};

CxChat.Channel.prototype.send = function(msg, pubid){
	if(this.id == null || this.req == null){
		return false;
	}
	
	this.req.send('DATA', {msg:msg, pubid:pubid||this.id});
};

CxChat.Channel.prototype.getUserlist = function(page){
	if(this.id == null || this.req == null){
		return false;
	}
	
	this.req.send('GET_USERS', {id:this.id, page:page||-1});
};
