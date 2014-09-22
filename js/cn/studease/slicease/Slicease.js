Slicease = function(params){
	//Necessary seetings
	this.canvas_id = '';
	this.images = [];
	
	//Available settings
	this.padding = [50, 0, 70, 0];
	this.pieces = [];
	this.delays = [];
	
	this.easing_load = [];
	this.easing_r = null;
	this.easing_z = null
	
	this.fps = 30;
	this.screen_z = 700;
	this.object_z = 800;
	
	this.strokeStyle = 'rgb(250,0,0)';
	this.sideColor = '#666666';
	
	//Runtime params
	this.canvas = null;
	this.context = null;
	this.offcan = null;
	this.offctx = null;
	this.tcan = null;
	this.tctx = null;
	
	this.width = 0;
	this.height = 0;
	this.radius = 0;
	
	this.points = [];
	this.img_c = -1;
	this.img_p = -1;
	this.img_n = 0;
	
	this.ready = false;
	this.running = false;
	this.playing = false;
	this.heading = 0;// scroll down: 0, scroll up: 1
	this.timer = null;
	this.timer_draw = null;
	
	this.setup(params);
};

Slicease.prototype.setup = function(params){
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

Slicease.prototype.init = function(){
	if(this.ready == true || this.canvas_id == '' || this.images.length == 0){
		return -1;
	}
	
	this.canvas = document.getElementById(this.canvas_id);
	if(this.canvas == null){
		return -1;
	}
	this.context = canvas.getContext('2d');
	this.context.strokeStyle = this.strokeStyle;
	
	this.offcan = document.createElement('canvas');
	this.offcan.width = this.canvas.width;
	this.offcan.height = this.canvas.height;
	this.offctx = this.offcan.getContext('2d');
	
	this.tcan = document.createElement('canvas');
	this.tctx = this.tcan.getContext('2d');
	
	if(this.padding.length < 4){
		var padding = [50, 0, 70, 0];
		for(var i=this.padding.length-1; i<4; i++){
			this.padding[i] = padding[i];
		}
	}
	this.width = this.canvas.width - this.padding[1] - this.padding[3];
	this.height = this.canvas.height - this.padding[0] - this.padding[2];
	this.radius = this.height * Math.SQRT1_2;
	
	if(this.pieces.length == 0){
		this.pieces[0] = 5;
	}
	var last_p = this.pieces[this.pieces.length-1];
	for(var p=this.pieces.length; p<this.images.length; p++){
		this.pieces.push(last_p);
	}
	
	for(var d=this.delays.length; d<this.images.length; d++){
		if(this.pieces[d] == 1){
			this.delays.push(0);
			continue;
		}
		var delay = Math.ceil(this.fps * 0.8 / (this.pieces[d]-1));
		this.delays.push(delay);
	}
	
	if(this.easing_load == null){
		var eload = new Easing();
		this.easing_load = eload;
	}
	if(this.easing_r == null){
		var rp1 = new Phy('vts', {vo:0, t:this.fps*1*0.5, s:30});
		var rp2 = new Phy('vts', {vo:rp1.v, t:this.fps*1-rp1_t, s:60});
		var rp3 = new Phy('vtv', {vo:rp2.v, t:this.fps*1*0.2, v:0});
		var rp4 = new Phy('vtv', {vo:rp3.v, t:rp3.t, v:-rp3.vo});
		var rp5 = new Phy('vav', {vo:rp4.v, a:rp4.a*(-2), v:0});
		var rp6 = new Phy('vas', {vo:rp5.v, a:rp5.a, s:90+rp3.s-rp4.s-rp5.s});
		var rps = [rp1, rp2, rp3, rp4, rp5, rp6];
		var easing_r = new Easing({phys:rps});
		this.easing_r = easing_r;
	}
	
	this.ready = true;
};

Slicease.prototype.run = function(index){
	
};

