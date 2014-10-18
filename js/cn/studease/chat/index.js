var CxChat = {
	version: '0.0.1',
	
	setup: function(config){
		if(config == null || typeof config != 'object'){
			return -1;
		}
		
		for(var k in config){
			if(this.hasOwnProperty(k) == false){
				continue;
			}
			
			this[k] = config[k];
		}
		
		return 0;
	}
};
