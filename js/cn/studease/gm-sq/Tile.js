Tile = function(p, value){
	this.x = p.x;
	this.y = p.y
	this.value = value || 2;
};

Tile.prototype.update = function(p){
	this.x = p.x;
	this.y = p.y
};

