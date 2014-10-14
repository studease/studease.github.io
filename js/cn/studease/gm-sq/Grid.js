Grid = function(size, state){
	this.size = size || 4;
	this.cells = this.init(state);
};

Grid.prototype.init = function(state){
	var cells = [];
	
	for(var x=0; x<this.size; x++){
		var row = cells[x] = [];
		
		for(var y=0; y<this.size; y++){
			var tile = state ? state[x][y] : null;
			row.push(tile ? new Tile(tile.p, tile.value) : null);
		}
	}
	
	return cells;
};

Grid.prototype.getAvailableCells = function(){
	var cells = [];
	for(var x=0; x<this.size; x++){
		for(var y=0; y<this.size; y++){
			if(this.cells[x][y] == null){
				cells.push(P(x, y));
			}
		}
	}
	
	return cells;
};

Grid.prototype.isEmpty = function(cell){
	return !this.getContent(cell);
};
Grid.prototype.getContent = function(cell){
	if(this.within(cell)){
		return this.cells[cell.x][cell.y];
	}
	
	return null;
};

Grid.prototype.within = function(cell){
	return cell.x >= 0 && cell.x < this.size 
		&& cell.y >= 0 && cell.y < this.size;
};

Grid.prototype.insertTile = function(tile){
	this.cells[tile.x][tile.y] = tile;
};
Grid.prototype.removeTile = function(tile){
	this.cells[tile.x][tile.y] = null;
};
