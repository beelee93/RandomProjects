var Directions = [ [-1,-1],
                  [ 0,-1],
                  [ 1,-1],
                  [-1, 0],
                  [ 1, 0],
                  [-1, 1],
                  [ 0, 1],
                  [ 1, 1]
                 ];

/**
 * A graph node
 */
function Node(x,y) {
	this.x = x;
	this.y = y;
}

Node.prototype.parentNode = null;
Node.prototype.distance = -1;
Node.prototype.marked = false;
Node.prototype.inPath = false;
Node.prototype.inQueue = false;
Node.prototype.penalty = 1;

Node.prototype.reset = function(){
	this.parentNode = null;
	this.distance = -1;
	this.marked = false;
	this.inPath = false;
	this.inQueue = false;
	this.penalty = 1;
};


/** 
 * A collection of nodes
 */
function Grid(N) {
	this.size = N;
	this.nodes = [];
	this.source = [0,0];
	this.dest = [N-1, N-1];

	this.createGrid();
	this.resetGrid();
}

Grid.prototype.createGrid = function() {
	var x,y;
	for(y=0;y<this.size;y++){
		for(x=0;x<this.size;x++){
			this.nodes.push( new Node (x,y) );
		}
	}
};

Grid.prototype.resetGrid = function(gridPenalty) {
	var i, index;
	for(i=0;i<this.nodes.length;i++){
		this.nodes[i].reset();
		if(gridPenalty) {
			index = fromIndex(i, this.size);
			this.nodes[i].penalty = gridPenalty[index[0]][index[1]];
		}
	}
	this.initial = true;
	this.queue = [];
	this.neighbours = [];
	this.currentNode = null;
	this.processedNode = null;
	this.processingDir = 0;
	this.found = false;
};

Grid.prototype.pathFoundCallback = function(caller) { 
	console.log("Path found!");
	var node = caller.getNode(caller.dest[0], caller.dest[1]);
	
	var arr = [];
	while(node)
	{
		arr.push([node.x, node.y]);
		node = node.parentNode;
	}
	console.log(arr);
};

Grid.prototype.tick = function() {
	if(this.found)
		return true;
	
	var node;
	var i,nx,ny;
	
	if(this.initial){
		// starting tick
		node = this.getNode(this.source[0], this.source[1]);
		node.marked = true;
		node.distance = 0;
		
		// queue node
		this.queue.push(node);
		node.inQueue = true;
		
		this.initial = false;
	}
	else{
		// are we processing any node?
		if(this.currentNode) {
			console.log("Processing node " + this.currentNode.x + "," + this.currentNode.y);
			
			// is this the destination node?
			if(this.currentNode == this.getNode(this.dest[0], this.dest[1]))
			{
				node = this.getNode(this.dest[0], this.dest[1]);
				
				while(node)
				{
					node.inPath = true;
					node = node.parentNode;
				}
				
				this.pathFoundCallback(this);
				this.found = true;
				this.currentNode = null;
				return true;
			}
			else {
				// look for neighbours
				while(this.processingDir<8)
				{
					console.log("Checking direction " + this.processingDir);
					i = this.processingDir;
					this.processingDir++;
					nx = this.currentNode.x + Directions[i][0];
					ny = this.currentNode.y + Directions[i][1];
					
					// boundary checking
					if(nx<0 || nx>=this.size) continue;
					if(ny<0 || ny>=this.size) continue; 
					node = this.getNode(nx,ny);
					
					// don't backtrack to parent
					if(this.currentNode == node.parentNode) continue; 
					
					// reaching here, we found a neighbour
					
					// == distance computation ==
					i = this.computeDistance(this.currentNode, node);
					
					this.processedNode = node;
					
					if(!node.marked) {
						node.marked = true;
						node.distance = i;
						node.parentNode = this.currentNode;
						this.queue.push(node);
						node.inQueue = true;
					}
					else {
						if(i < node.distance) {
							node.distance = i;
							node.parentNode = this.currentNode;					
						}
					}
					break;
				}
				
				// check if we are done searching all neighbours
				if(this.processingDir == 8)
				{
					// stop processing current node
					this.currentNode = null;
					this.processingDir = 0;
					this.processedNode = null;
				}
			}
		}
		else if(this.queue.length>0) { // is the queue not empty?
			// dequeue a node
			console.log("Not processing anything. Dequeuing a node...");
			this.currentNode = this.queue.shift();
			this.currentNode.inQueue = false;
			this.processingDir = 0;
		}
	}
	return false;
};

Grid.prototype.getNode = function(x,y) {
	return this.nodes[getIndex(x,y,this.size)];
};

Grid.prototype.computeDistance = function(curNode, neighbour) {
	return curNode.distance + neighbour.penalty;
};

/**
 * Helper functions
 */
function getIndex(x,y,N) {
	return y*N + x;
}

function fromIndex(i,N) {
	var x,y;
	y = Math.floor(i/N);
	x = i % N;
	return [x,y];
}

/**
 * Canvas drawing
 */

var PHASE_RESET = 0;
var PHASE_WAIT_SOURCE = 1;
var PHASE_WAIT_DEST = 2;
var PHASE_PATH = 3;
var PHASE_IDLE = 4;

var GridCanvas = {};
GridCanvas.init = function(canvasId, size) {
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.firstUpdate = true;
	this.prevTime = 0;
	window.requestAnimationFrame(this.render);
	
	this.grid = new Grid(size);
	this.size = size;
	this.phase = PHASE_RESET;
	
	this.countDown = 0;
	this.origCountDown = 0.3; // set this higher to slow tick rate
	this.arrow = null;
	
	this.gridPenalty = new Array(size);
	for(var i=0;i<size;i++) {
		var arr = [];
		for(var j=0;j<size;j++) arr.push(1);
		this.gridPenalty[i] = arr;
	}

};

GridCanvas.render = function(elapsed){
	var ctx = GridCanvas.context;
	var o = GridCanvas;
	
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,o.width, o.height);

	if(o.firstUpdate) {
		o.prevTime = elapsed;
		o.firstUpdate = false;
	}
	else {
		var diffTime = elapsed - o.prevTime;
		o.prevTime = elapsed;
		diffTime /= 1000.0;
		
		switch(o.phase)
		{
			case PHASE_RESET:
				o.grid.resetGrid(o.gridPenalty);
				o.phase=PHASE_WAIT_SOURCE;
				break;
			case PHASE_PATH:
				o.countDown -= diffTime;
				if(o.countDown < 0) {
					if(o.grid.tick()){
						o.phase=PHASE_IDLE;
					}
					o.countDown = o.origCountDown;
				}
				
				break;
		}
		
		// rendering
		var rw,rh,angle, nx,ny;
		var start, end;
		start = o.grid.getNode(o.grid.source[0], o.grid.source[1]);
		end = o.grid.getNode(o.grid.dest[0], o.grid.dest[1]);
		
		rw = o.width/o.size;
		rh = o.height/o.size;
		
		var x,y,node;
		for(y=0;y<o.size;y++){
			for(x=0;x<o.size;x++){
				node = o.grid.getNode(x,y);
				
				
				if(node == start || node == end)
					ctx.fillStyle = '#6495ED'
				else if(node.penalty>=1000)
					ctx.fillStyle= node.marked ? '#AA0000' : '#FF0000';
				else
					ctx.fillStyle= node.marked ? '#00AA00' : 'white';
				ctx.fillStyle= node.inPath ? '#6495ED' : ctx.fillStyle;
				ctx.fillStyle= (node == o.grid.currentNode ? '#F4A460' : ctx.fillStyle);
				ctx.fillRect(x*rw, y*rh, rw,rh);
				
				ctx.strokeStyle= 'black';
				ctx.lineWidth = 1;
				ctx.strokeRect(x*rw, y*rh, rw,rh);
				
				if(node.inQueue){
					ctx.font="8px serif";
					ctx.strokeText("Q", x*rw+3, y*rh+10);
				}
				
				if(node.distance>=0) {
					ctx.font="12px serif";
					ctx.strokeText(node.distance.toString(), x*rw+3, y*rh+23);
				}
				
				if(o.arrow && node.parentNode) {
					ctx.save();
					 // move to the center of the canvas
				    ctx.translate(x*rw+rw/2,y*rh+rh/2);

				    // rotate the canvas to the specified degrees
				    nx = node.parentNode.x - node.x;
				    ny = node.parentNode.y - node.y;
				    angle = Math.atan2(ny,nx);
				    ctx.rotate(angle);

				    // draw the image
				    // since the context is rotated, the image will be rotated also
				    ctx.drawImage(o.arrow,-10,-10);
				    
					ctx.restore();
				}
			}
		}
		for(y=0;y<o.size;y++){
			for(x=0;x<o.size;x++){
				node = o.grid.getNode(x,y);
				if(node == o.grid.processedNode)
				{
					ctx.strokeStyle= 'yellow';
					ctx.lineWidth = 3;
					ctx.strokeRect(x*rw, y*rh, rw,rh);
				}
			}
		}
	}
	window.requestAnimationFrame(o.render);
};

GridCanvas.setSource = function(x,y){
	if(this.phase == PHASE_WAIT_SOURCE && x<this.size && y < this.size &&
			x>=0 && y>=0) {
		this.grid.source = [x,y];
		this.phase = PHASE_WAIT_DEST;
		return true;
	}
	return false;
};


GridCanvas.setDestination = function(x,y){
	if(this.phase == PHASE_WAIT_DEST && x<this.size && y < this.size &&
			x>=0 && y>=0) {
		
		if(x == this.grid.source[0] && y == this.grid.source[1]) return false;
		this.grid.dest = [x,y];
		this.phase = PHASE_PATH;
		return true;
	}
	return false;
};

GridCanvas.setArrowImg = function(arrow) {
	this.arrow = document.getElementById(arrow);
};