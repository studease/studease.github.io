GameManager = function(req, config){
	this.req = req;
	
	//Available settings
	this.size = 4;//Size of the grid
	
	//Runtime params
	this.puppet = null;
	this.grid = null;
	this.score = 0;
	this.lastScore = 0;
	
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
	this.scoreAddtion = document.querySelector(".score-addition");
	this.scoreContainer = document.querySelector(".score-container");
	this.tileContainer = document.querySelector(".tile-container");
	
	this.puppetScoreAddition = document.getElementById('puppet-score-addition');
	this.puppetScoreContainer = document.getElementById('puppet-score-container');
	this.puppetTileContainer = document.getElementById('puppet-tile-container');
	
	this.grid = new Grid(this.size);
};

GameManager.prototype.getReady = function(){
	if(!this.req){
		return;
	}
	
	this.send('READY');
};

GameManager.prototype.send = function(cmd, params){
	if(!this.req){
		return;
	}
	
	var raws = [];
	var raw = new Object();
	raw.cmd = cmd;
	raw.chl = this.req.chl++;
	if(params != null && typeof params == 'object'){
		raw.params = params;
	}
	raw.ssid = this.req.ssid;
	raws.push(raw);
	
	try{console.log('==> ' + raws.toSource());}catch(e){};
	this.req.socket.emit('2048', raws);
};

GameManager.prototype.onRaw = function(raws){
	var data = raws[0].data;
	
	switch(raws[0].raw){
		case 'INIT':
			this.size = data.size;
			this.puppet = data.puppet;
			this.reset();
			
			for(var i=0; i<data.tiles.length; i++){
				this.addRandomTile(this.clone(data.tiles[i]));
				this.addTile(this.clone(data.tiles[i]));
			}
			this.listen();
		break;
		case 'RANDOM':
			this.addRandomTile(this.clone(data.tile));
			this.addTile(this.clone(data.tile));
			this.listen();
		break;
		case 'PUPPET':
			this.actuate(data);
		break;
		case 'RES':
			
		break;
		case 'ERR':
			
		break;
	}
};
GameManager.prototype.clone = function(tile){
	var _tile = new Tile(P(tile.x,tile.y), tile.value);
	_tile.previousPosition = tile.previousPosition;
	_tile.merged = tile.merged;
	return _tile;
};

GameManager.prototype.addRandomTile = function(tile){
	this.grid.insertTile(tile);
};

var _on_keydown;
GameManager.prototype.listen = function(){
	if(!_on_keydown){
		_on_keydown = new Func(this.onKeyDown, this);
	}
	
	document.addEventListener("keydown", this.keyDownHandler);
};
GameManager.prototype.keyDownHandler = function(event){
	var el = document.activeElement;
	if(el.type == "textarea" || el.type == "input"){
		return;
	}
	
	_on_keydown.doit(event);
};
GameManager.prototype.removeListener = function(){
	document.removeEventListener("keydown", this.keyDownHandler);
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
	var vector = this.getVector(direction);
	var traversals = this.buildTraversals(vector);
	var moved = false;
	this.lastScore = this.score;
	
	var self = this;
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
					
					self.score += farthest.value;
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
		this.send('MOVE', {
			direction: direction,
			score: this.score
		});
		
		this.removeListener();
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

GameManager.prototype.reset = function(){
	this.score = this.lastScore = 0;
	this.clearContainer(this.tileContainer);
	this.init();
};
GameManager.prototype.restart = function(){
	this.reset();
	this.getReady();
};


GameManager.prototype.actuate = function(puppetData){
	var self = this;
	
	var _rq_animation = new Func(this.requestAnimationFrame, this);
	window.requestAnimationFrame(function(){
		_rq_animation.doit(puppetData);
	});
};
GameManager.prototype.requestAnimationFrame = function(puppetData){
	if(!puppetData){
		this.clearContainer(this.tileContainer);
	}
	else{
		this.clearContainer(this.puppetTileContainer);
	}
	
	var self = this;
	var isPuppet = !!puppetData;
	var grid = isPuppet ? puppetData.grid : this.grid;
	grid.cells.forEach(function(column){
		column.forEach(function(cell){
			if(cell){
				self.addTile(cell, isPuppet);
			}
		});
	});
	
	var score = isPuppet ? puppetData.score : null;
	var lastScore = isPuppet ? puppetData.lastScore : null;
	this.updateScore(score, lastScore);
};

GameManager.prototype.clearContainer = function(container){
	while(container.firstChild){
		container.removeChild(container.firstChild);
	}
};

GameManager.prototype.addTile = function(tile, isPuppet){
	if(!tile.value){
		return;
	}
	
	var self = this;
	
	var wrapper = document.createElement("div");
	var inner = document.createElement("div");
	var position = tile.previousPosition || P(tile.x, tile.y);
	var positionClass = this.positionClass(position, isPuppet);
	
	var classes = ["tile", "tile-" + tile.value, positionClass];
	if(tile.value > 2048) classes.push("tile-super");
	this.applyClasses(wrapper, classes);
	
	inner.classList.add("tile-inner");
	inner.innerHTML = '<img src="../images/gm-sq/'+tile.value+'.jpg" />';
	
	if(tile.previousPosition){
		window.requestAnimationFrame(function(){
			classes[2] = self.positionClass(P(tile.x, tile.y), isPuppet);
			self.applyClasses(wrapper, classes);
		});
	}
	else if(tile.merged){
		classes.push("tile-merged");
		this.applyClasses(wrapper, classes);
		
		tile.merged.forEach(function(merged){
			self.addTile(merged, isPuppet);
    	});
	}
	else{
		classes.push("tile-new");
		this.applyClasses(wrapper, classes);
	}
	
	wrapper.appendChild(inner);
	
	var tileContainer = isPuppet ? this.puppetTileContainer : this.tileContainer;
	tileContainer.appendChild(wrapper);
};
GameManager.prototype.positionClass = function(position, isPuppet){
	position = this.normalizePosition(position);
	return (isPuppet?"p-":"") + "tile-position-" + position.x + "-" + position.y;
};
GameManager.prototype.normalizePosition = function(position){
	return P(position.x+1, position.y+1);
};
GameManager.prototype.applyClasses = function(element, classes){
	element.setAttribute("class", classes.join(" "));
};

GameManager.prototype.updateScore = function(puppetScore, puppetLastScore){
	if(puppetScore != null){
		this.puppetScoreContainer.textContent = puppetScore;
		
		var difference = puppetScore - puppetLastScore;
		this.puppetScoreAddition.textContent = difference>0 ? ("+"+difference) : '';
		return;
	}
	
	this.scoreContainer.textContent = this.score;
	
	var difference = this.score - this.lastScore;
	this.scoreAddtion.textContent = difference>0 ? ("+"+difference) : '';
};




