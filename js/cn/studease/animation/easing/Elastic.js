Elastic = function(amplitudeFraction, period){
	//Params
	this.amplitudeFraction = amplitudeFraction;
	this.period = period;
	this.velocity = 0;
	
	//Available settings
	this.playBehavior = PlayBehavior.AUTO;
	
	this.done = false;
	this.complete = null;
	
	//Runtime args
	this.easingType = 'elastic';
	this.currentVelocity = 0;
	
	this.duration = 0;
};

Elastic.prototype.ease = function(fraction){
	if(this.velocity == 0){
		return 0;
	}
	
	if(this.hasOwnProperty('t') == false){
		this.t = this.amplitudeFraction * 2 / this.velocity;
	}
	
	var vo = this.velocity;
	var 
	for(var i=0; i<this.period; i++){
		var amp = this.getAmplitude(i);
		var v = this.getVelocity(i+1);
	}
};

function easeOut(param1, param2 = 0, param3 = 1, param4 = 1, param5 = 0, param6 = 0){
    var _loc_7 = NaN;
    if (param1 == 0)
    {
        return param2;
    }
    var _loc_8:* = param1 / param4;
    param1 = param1 / param4;
    if (_loc_8 == 1)
    {
        return param2 + param3;
    }
    if (!param6)
    {
        param6 = param4 * 0.3;
    }
    if (!param5 || param5 < Math.abs(param3))
    {
        param5 = param3;
        _loc_7 = param6 / 4;
    }
    else
    {
        _loc_7 = param6 / (2 * Math.PI) * Math.asin(param3 / param5);
    }
    
    //     1                          param1                       1        0                         0.3       1        0
    return param5 * Math.pow(2, -10 * param1) * Math.sin((param1 * param4 - _loc_7) * (2 * Math.PI) / param6) + param3 + param2;
}// end function

Elastic.prototype.getAmplitude = function(period){
	var k = -1;
	var p = -this.amplitudeFraction / k;
	var a = k * p * period/this.period + this.amplitudeFraction;
	a = a>this.amplitudeFraction ? this.amplitudeFraction : a;
	a = a<0 ? 0 : a;
	a *= (period%2 == 1) ? 1 : -1;
	
	if(this.playBehavior == PlayBehavior.ABSOLUTE){
		a = Math.abs(a);
	}
	else if(this.playBehavior == PlayBehavior.NEGATIVE){
		a = -Math.abs(a);
	}
	
	return a;
};
Elastic.prototype.getVelocity = function(period){
	var k = -1;
	var p = -this.velocity / k;
	var v = k * p * period/(this.period+1) + this.velocity;
	v = v>this.velocity ? this.velocity : v;
	v = v<0 ? 0 : v;
	v *= (period%2 == 1) ? -1 : 1;
	
	if(this.playBehavior == PlayBehavior.ABSOLUTE){
		v = Math.abs(v);
	}
	else if(this.playBehavior == PlayBehavior.NEGATIVE){
		v = -Math.abs(v);
	}
	
	return v;
};
