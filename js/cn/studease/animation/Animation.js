Animation = function(duration, startValue, endValue, params){
	//Params
	this.duration = duration || 60;
	this.startValue = startValue || 0;
	this.endValue = endValue || 1;
	
	//Available settings
	this.easers = [];
	this.fractions = [];
	
	this.playBehavior = PlayBehavior.AUTO;
	this.repeatBehavior = RepeatBehavior.LOOP;
	
	this.repeatCount = 1; //repeat <= 0: No time limit
	this.complete = null;
	
	this.repeatDelay = 0;
	this.startDelay = 0;
	
	//Runtime args
	this.currentCount = 0;
	
	this.setup(params);
};

Animation.prototype.setup = function(params){
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

Animation.prototype.add = function(easer, fraction){
	if(easer == null){
		return -1;
	}
	
	this.easers.push(easer);
	this.fractions.push(fraction || 1);
	
	return this.easers.length;
};

Animation.prototype.ease = function(time){
	var t = time - this.startDelay;
	var n = Math.floor(t / (this.duration+this.repeatDelay));
	t %= this.duration + this.repeatDelay;
	t = t>this.duration ? this.duration : t;
	var f = t / this.duration;
	
	if(f == 1){
		return this.endValue;
	}
	
	var eased = 0;
	for(var i=0; i<this.fractions.length; i++){
		var easer = this.easers[i];
		
		if(f > eased + this.fractions[i]){
			eased += this.fractions[i];
			continue;
		}
		
		if(easer.easingType == 'elastic'){
			if(i > 0){
				var last = this.easers[i-1];
				easer.velocity = last.currentVelocity;
			}
		}
		eased += easer.ease((f-eased)/this.fractions[i]);
		break;
	}
	
	var value = this.startValue + (this.endValue-this.startValue) * eased;
	
	return value;
};


var PlayBehavior = {
	AUTO: 0,
	ABSOLUTE: 1,
	NEGATIVE: -1
};

var RepeatBehavior = {
	LOOP: 0,
	REVERSE: -1
};
