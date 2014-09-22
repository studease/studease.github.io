Linear = function(easeInFraction, easeOutFraction){
	//Params
	this.easeInFraction = easeIntFraction || 0;
	this.easeOutFraction = easeOutFraction || 0;
	
	//Available settings
	this.playBehavior = PlayBehavior.AUTO;
	
	this.done = false;
	this.complete = null;
	
	//Runtime args
	this.easingType = 'linear';
	this.currentVelocity = 0;
};

Linear.prototype.ease = function(fraction){
	if(this.easeInFraction < 0 || this.easeOutFraction < 0 
		|| (this.easeInFraction+this.easeOutFraction) > 1){
		return 0;
	}
	
	if(this.easeInFraction > 0){
		if(this.hasOwnProperty('a1') == false){
			this.a1 = 1 / (0.5*Math.pow(this.easeInFraction,2) 
							+ this.easeInFraction*(1-this.easeInFraction-this.easeOutFraction) 
							+ 0.5*this.easeInFraction*this.easeOutFraction);
		}
		if(this.hasOwnProperty('a2') == false){
			this.a2 = this.easeOutFraction==0 ? 0 : (-this.easeInFraction/this.easeOutFraction*this.a1);
		}
		if(this.hasOwnProperty('v') == false){
			this.v = this.a1 * this.easeInFraction;
		}
	}
	else if(this.easeInFraction == 0){
		if(this.hasOwnProperty('a1') == false){
			this.a1 = 0;
		}
		if(this.hasOwnProperty('v') == false){
			this.v = 1 / (1 - 0.5*this.easeOutFraction);
		}
		if(this.hasOwnProperty('a2') == false){
			this.a2 = this.easeOutFraction==0 ? 0 : (-this.v/this.easeOutFraction);
		}
	}
	
	var eased = 0;
	if(fraction <= this.easeInFraction){
		eased = 0.5*this.a1*Math.pow(fraction,2);
		this.currentVelocity = this.a1 * fraction;
	}
	else if(fraction > 1-this.easeOutFraction){
		eased = 0.5*this.a1*Math.pow(this.easeInFraction,2) 
					+ this.v*(1-this.easeInFraction-this.easeOutFraction) 
					+ 0.5*this.a2*Math.pow((fraction>1?1:fraction)-(1-this.easeOutFraction),2);
		this.currentVelocity = fraction>=1 ? 0 : (this.v + this.a2*(fraction-(1-this.easeOutFraction)));
		this.currentVelocity = this.currentVelocity<0 ? 0 : this.currentVelocity;
	}
	else{
		eased = 0.5*this.a1*Math.pow(this.easeInFraction,2) 
					+ this.v*(fraction-this.easeInFraction);
		this.currentVelocity = this.v;
	}
	
	if(fraction >= 1 && this.complete != null && this.done == false){
		this.complete.doit();
		this.done = true;
	}
	
	return eased;
};
