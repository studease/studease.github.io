CxChat.Client = function(config){
	this.url = '';
	
	//Runtime params
	this.channels = {};
	this.ssid = null;
	
	this.setup = new Func(CxChat.setup, this);
	this.setup.doit(config);
	this.init();
};
CxChat.Client.extends(Event);

CxChat.Client.prototype.init = function(){
	
};

CxChat.Client.prototype.connect = function(url, params){
	if(this.hasOwnProperty('socket') == false || this.socket == null){
		this.socket = io(url||this.url);
		this.socket.client = this;
		this.socket.on('connect', function(){
			console.log('connected');
			
			if(this.client.hasOwnProperty('req') == false || this.client.req == null){
				this.client.req = new CxChat.Request({socket:this});
			}
			this.client.req.send('CONNECT', params);
		});
		this.socket.on('IDENT', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.ssid = this.client.req.ssid = raws[0].data.ssid;
			this.client.fireEvent('IDENT', raws);
		});
		this.socket.on('CHANNEL', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			var channelId = raws[0].data.pipe.properties.name;
			if(this.client.channels.hasOwnProperty(channelId) == false){
				this.client.channels[channelId] = new CxChat.Channel({id:channelId, req:this.client.req});
			}
			var channel = this.client.channels[channelId];
			var user = raws[0].data.user;
			channel.users[user.properties.id] = user;
			
			this.client.fireEvent('CHANNEL', raws);
		});
		this.socket.on('JOIN', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			var channelId = raws[0].data.pipe.properties.name;
			if(this.client.channels.hasOwnProperty(channelId) == false){
				this.client.channels[channelId] = new CxChat.Channel({id:channelId, req:this.client.req});
			}
			var channel = this.client.channels[channelId];
			var user = raws[0].data.user;
			channel.users[user.properties.id] = user;
			
			this.client.fireEvent('JOIN', raws);
		});
		this.socket.on('LEFT', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			var channelId = raws[0].data.pipe.properties.name;
			if(this.client.channels.hasOwnProperty(channelId) == true){
				var channel = this.client.channels[channelId];
				var user = raws[0].data.user;
				delete channel.users[user.properties.id];
			}
			
			this.client.fireEvent('LEFT', raws);
		});
		this.socket.on('USERLIST', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			var channelId = raws[0].data.id;
			if(this.client.channels.hasOwnProperty(channelId) == false){
				this.client.channels[channelId] = new CxChat.Channel({id:channelId, req:this.client.req});
			}
			var channel = this.client.channels[channelId];
			var users = raws[0].data.users;
			for(var i=0; i<users.length; i++){
				var user = users[i];
				channel.users[user.properties.id] = user;//override
			}
			
			this.client.fireEvent('USERLIST', raws);
		});
		this.socket.on('SENT', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.fireEvent('SENT', raws);
		});
		this.socket.on('DATA', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.fireEvent('DATA', raws);
		});
		this.socket.on('CLEAR', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.fireEvent('CLEAR', raws);
		});
		this.socket.on('QUIT', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.fireEvent('QUIT', raws);
		});
		this.socket.on('SET_SS', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.fireEvent('SET_SS', raws);
		});
		this.socket.on('GOT_SS', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.fireEvent('GOT_SS', raws);
		});
		this.socket.on('ERR', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.fireEvent('ERR', raws);
		});
		this.socket.on('2048', function(raws){
			try{console.log(raws.toSource());}catch(e){};
			
			this.client.fireEvent('2048', raws);
		});
		this.socket.on('disconnect', function(){
			console.log('disconnected');
			
			this.client.fireEvent('DISCONNECT');
		});
	}
};

CxChat.Client.prototype.onRaw = function(type, handler){
	//this.socket.on(type, handler);
	return this.addEvent(type, handler);
};

CxChat.Client.prototype.join = function(channels){
	if(this.hasOwnProperty('req') == false || this.req == null){
		return false;
	}
	
	this.req.send('JOIN', {channels: channels});
};

CxChat.Client.prototype.leave = function(channels){
	if(this.hasOwnProperty('req') == false || this.req == null){
		return false;
	}
	
	this.req.send('LEAVE', {channels: channels});
};

CxChat.Client.prototype.clear = function(){
	if(this.hasOwnProperty('req') == false || this.req == null){
		return false;
	}
	
	this.req.send('CLEAR');
};

CxChat.Client.prototype.quit = function(){
	if(this.hasOwnProperty('req') == false || this.req == null){
		return false;
	}
	
	this.req.send('QUIT');
	this.socket.disconnect();
	this.socket.close();
};

CxChat.Client.prototype.setSession = function(key, value){
	//
};

CxChat.Client.prototype.getSession = function(key ,fn){
	//
};

CxChat.Client.prototype.check = function(){
	//
};
