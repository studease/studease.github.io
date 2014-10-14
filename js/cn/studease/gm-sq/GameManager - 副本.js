GameManager = function(size, config){
	this.size = size || 4;//Size of the grid
	
	//Available settings
	this.startTiles = 2;
	
	//Runtime params
	this.grid = null;
	this.score = 0;
	
	this.setup(config);
};
GameManager.prototype.setup = function(config){
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
};

GameManager.prototype.init = function(){
	if(this.grid == null){
		this.grid = new Grid(this.size);
	}
	
	for(var i=0; i<this.startTiles; i++){
		var tile = this.addRandomTile();
		if(tile != null){
			this.addTile(tile);
		}
	}
};

GameManager.prototype.addRandomTile = function(){
	var avaiCells = this.grid.getAvailableCells();
	if(avaiCells == null || avaiCells.length == 0){
		return null;
	}
	
	var index = Math.floor(Math.random() * avaiCells.length);
	var value = Math.random() < 0.9 ? 2 : 4;
	var tile = new Tile(avaiCells[index], value);
	
	this.grid.insertTile(tile);
	return tile;
};

GameManager.prototype.listen = function(){
	var _on_keydown = new Func(this.onKeyDown, this);
	document.addEventListener("keydown", function(event){
    	_on_keydown.doit(event);
	});
};
GameManager.prototype.onKeyDown = function(event){
	var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
	if(modifiers){
		return;
	}
	
	if(event.which === 82){//R
		this.restart();
		return;
	}
	
	var map = {
		38: 0, //Up
		39: 1, //Right
		40: 2, //Down
		37: 3, //Left
		87: 0, //W
		68: 1, //D
		83: 2, //S
		65: 3  //A
	};
    var mapped = map[event.which];
	
	if(mapped !== undefined){
		event.preventDefault();
		this.move(mapped);
	}
};
GameManager.prototype.move = function(direction){
	var self = this;
	
	var vector = this.getVector(direction);
	var traversals = this.buildTraversals(vector);
	var moved = false;
	
	traversals.x.forEach(function(x){
		traversals.y.forEach(function(y){
			var cell = P(x, y);
			var tile = self.grid.getContent(cell);
			if(tile == null){
				continue;
			}
			
			var positions = self.findFarthestPosition(cell, vector);
			var next = self.grid.cellContent(positions.next);
			
			// Only one merger per row traversal?
			if(next && next.value === tile.value && !next.mergedFrom){
				var merged = new Tile(positions.next, tile.value*2);
				merged.mergedFrom = [tile, next];
				
				self.grid.insertTile(merged);
				self.grid.removeTile(tile);
				
				// Converge the two tiles' positions
				tile.updatePosition(positions.next);
				
				// Update the score
				self.score += merged.value;
				
				// The mighty 2048 tile
				if(merged.value === 1024) self.won = true;
			}
			else{
				self.moveTile(tile, positions.farthest);
			}
			
			if(!self.positionsEqual(cell, tile)){
				moved = true;
			}
		});
	});
	
	if(moved){
		this.addRandomTile();
	}
};
GameManager.prototype.getVector = function(direction){
	var map = {
		0: P(0, -1), //Up
		1: P(1, 0),  //Right
		2: P(0, 1),  //Down
		3: P(-1, 0)  //Left
	};
	
	return map[direction];
};
GameManager.prototype.buildTraversals = function(vector){
	var traversals = {x: [], y: []};
	
	for(var pos=0; pos<this.size; pos++){
		traversals.x.push(pos);
		traversals.y.push(pos);
	}
	
	if(vector.x === 1) traversals.x = traversals.x.reverse();
	if(vector.y === 1) traversals.y = traversals.y.reverse();
	
	return traversals;
};
GameManager.prototype.getFarthestPosition(cell, vector){
	do{
		previous = cell;
		cell = {x: previous.x+vector.x, y: previous.y+vector.y};
	}
	while(this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));
	
	return {
		farthest: previous,
		next: cell
	};
};
GameManager.prototype.moveTile = function(tile, cell){
	this.grid.cells[tile.x][tile.y] = null;
	this.grid.cells[cell.x][cell.y] = tile;
	tile.update(cell);
};
GameManager.prototype.positionsEqual = function(first, second){
	return first.x === second.x && first.y === second.y;
};

GameManager.prototype.restart = function(){
	this.grid = null;
	this.init();
};


GameManager.prototype.clearContainer = function(container){
	while(container.firstChild){
		container.removeChild(container.firstChild);
	}
};

GameManager.prototype.addTile = function(tile){
	
};




