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
	this.tileContainer = document.querySelector(".tile-container");
	
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
			if(tile){
				tile.save();
				tile.merged = null;
				var farthest = self.getFarthestPosition(cell, vector);
				if(!!farthest.merged){
					self.grid.insertTile(farthest);
					self.grid.removeTile(tile);
					
					tile.update(farthest);
				}
				else{
					self.moveTile(tile, farthest);
				}
				
				if(!self.positionsEqual(cell, tile)){
					moved = true;
				}
			}
		});
	});
	
	if(moved){
		this.addRandomTile();
		
		this.actuate();
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
GameManager.prototype.getFarthestPosition = function(cell, vector){
	var farthest = tile = this.grid.getContent(cell),
	next = P(cell.x+vector.x, cell.y+vector.y);
	
	while(this.grid.within(next)){
		if(this.grid.isEmpty(next)){
			farthest = new Tile(next, tile.value);
			next = P(next.x+vector.x, next.y+vector.y);
			continue;
		}
		
		var next = this.grid.getContent(next);
		if(!!next && next.value == tile.value && !next.merged){
			farthest = new Tile(next, tile.value*2);
			farthest.merged = [cell, next];
		}
		
		break;
	}
	
	return farthest;
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


GameManager.prototype.actuate = function(){
	var self = this;
	
	var _rq_animation = new Func(this.requestAnimationFrame, this);
	window.requestAnimationFrame(function(){
		_rq_animation.doit();
	});
};
GameManager.prototype.requestAnimationFrame = function(){
	this.clearContainer(this.tileContainer);
	
	var self = this;
	this.grid.cells.forEach(function(column){
		column.forEach(function(cell){
			if(cell){
				self.addTile(cell);
			}
		});
	});
};

GameManager.prototype.clearContainer = function(container){
	while(container.firstChild){
		container.removeChild(container.firstChild);
	}
};

GameManager.prototype.addTile = function(tile){
	if(!tile.value){
		return;
	}
	
	var self = this;
	
	var wrapper = document.createElement("div");
	var inner = document.createElement("div");
	var position = tile.previousPosition || P(tile.x, tile.y);
	var positionClass = this.positionClass(position);
	
	// We can't use classlist because it somehow glitches when replacing classes
	var classes = ["tile", "tile-" + tile.value, positionClass];
	
	if(tile.value > 2048) classes.push("tile-super");
	
	this.applyClasses(wrapper, classes);
	
	inner.classList.add("tile-inner");
	inner.innerHTML = '<img src="http://res.tx3.netease.com/qt/14/0325_2048/zuan2/'+tile.value+'.jpg" />';
	
	if(tile.previousPosition){
		// Make sure that the tile gets rendered in the previous position first
		window.requestAnimationFrame(function(){
			classes[2] = self.positionClass(P(tile.x, tile.y));
			self.applyClasses(wrapper, classes); // Update the position
		});
	}
	else if(tile.merged){
		classes.push("tile-merged");
		this.applyClasses(wrapper, classes);
		
		// Render the tiles that merged
		tile.merged.forEach(function(merged){
			self.addTile(merged);
    	});
	}
	else{
		classes.push("tile-new");
		this.applyClasses(wrapper, classes);
	}
	
	// Add the inner part of the tile to the wrapper
	wrapper.appendChild(inner);
	
	// Put the tile on the board
	this.tileContainer.appendChild(wrapper);
};
GameManager.prototype.positionClass = function(position){
	position = this.normalizePosition(position);
	return "tile-position-" + position.x + "-" + position.y;
};
GameManager.prototype.normalizePosition = function(position){
	return P(position.x+1, position.y+1);
};
GameManager.prototype.applyClasses = function(element, classes){
	element.setAttribute("class", classes.join(" "));
};




