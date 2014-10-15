Tile = function(p, value){
	this.x = p.x;
	this.y = p.y
	this.value = value || 2;
	
	this.previousPosition = null;
	this.merged = null;
};

Tile.prototype.save = function () {
  this.previousPosition = P(this.x, this.y);
};

Tile.prototype.update = function(p){
	this.x = p.x;
	this.y = p.y
};

