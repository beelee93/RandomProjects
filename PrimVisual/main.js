/**
 * Graph Node
 */
function Node(x,y,id) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.reset();
}

// resets the node
Node.prototype.reset = function() {
	this.currentWeight = Number.POSITIVE_INFINITY;
	this.pred = null; // predecessor
	this.isTree = false;
};

/**
 * Adjacency Info
 */
function AdjacencyInfo(neighbourId, weight) {
	this.neighbourId = neighbourId;
	this.weight = weight;
}

/**
 * Graph
 */
function Graph() {
	this.nodes = []; // list of nodes in the graph
	this.adjacencyList = [];
	this.counter = 0;
	this.ready = 0; // only when adjacency list is created
	this.pq = new PriorityQueue("currentWeight");
	this.phase = 0;
	this.solved = false;
	
	// for solving
	this.currentNode = null;
	this.processedNode = null;
	this.iterator = 0;
	this.requestAnother = false;
}

// Adds a node into the graph
Graph.prototype.addNode = function(x,y) {
	if(!this.ready)	{
		var node = new Node(x,y,this.counter++);
		this.nodes.push(node);
	}
};

// Sets the weight of the edge between node id0 and node id1
Graph.prototype.setWeight = function(id0, id1, weight) {
	var i, list, success;
	if(this.ready) {
		// search list if id0 is existent
		list = this.adjacencyList[id0];
		success = false;
		for(i=0;i<list.length;i++) {
			if(list[i].neighbourId == id1) {
				list[i].weight = weight;
				success = true;
				break;
			}
		}
		if(!success) {
			list.push(new AdjacencyInfo(id1, weight));
		}
		
		list = this.adjacencyList[id1];
		success = false;
		for(i=0;i<list.length;i++) {
			if(list[i].neighbourId == id0) {
				list[i].weight = weight;
				success = true;
				break;
			}
		}
		if(!success) {
			list.push(new AdjacencyInfo(id0, weight));
		}
	}
};

Graph.prototype.createAdjacencyList  = function() {
	for(var i=0;i<this.nodes.length;i++) {
		this.adjacencyList.push([]);
	}
	this.ready = 1;
};

// generate a graph based on a NxN adjacency matrix 
//     only upper triangle is taken
// nodePositions is a Nx2 matrix
Graph.generateGraph = function(nodePositions, adjMatrix) {
	if(nodePositions.length != adjMatrix.length) {
		throw new Error("Dimension mismatch between nodePositions and adjMatrix");
	}
	
	var o = new Graph();
	var i,j;
	for(i=0;i<nodePositions.length;i++) {
		o.addNode(nodePositions[i][0], nodePositions[i][1]);
	}
	
	o.createAdjacencyList();
	for(i=0;i<nodePositions.length-1;i++) {
		for(j=i+1; j<nodePositions.length;j++) {
			if(adjMatrix[i][j]>0)
				o.setWeight(i,j,adjMatrix[i][j]);
		}
	}
	return o;
};

//////////////////////////////////////////////////////
// PRIM's ALGORITHM
//////////////////////////////////////////////////////

// slowly advance the prim's algorithm
Graph.prototype.tick = function() {
	if(!this.ready || this.solved) return 1;
	
	var i,nodeId, adj, temp;
	
	if(this.phase == 0) { // initialization 
		for(i=0;i<this.nodes.length;i++) {
			// queue all nodes into V - S queue
			this.pq.enqueue(this.nodes[i], this.nodes[i].id);
		}
		this.phase = 1;
		this.requestAnother = true;
	}
	else if(this.phase == 1) {// processing
		if(this.currentNode && !this.requestAnother) {
			// process this node
			console.log("--Node " + this.currentNode.id);
			
			// iterate through all neighbours
			adj = this.adjacencyList[this.currentNode.id];
			
			while(this.iterator < adj.length) {
				nodeId = adj[this.iterator].neighbourId;
				console.log("Processing neighbour node " + nodeId);
				
				// move on if this node is in tree
				this.processedNode = this.nodes[nodeId];
				if(this.processedNode.isTree) {
					console.log("*Node is in tree...");
					this.iterator++;
					continue;
				}
				
				// update weight if this edge's weight is smaller
				if(adj[this.iterator].weight < this.processedNode.currentWeight) {
					this.pq.adjustKey(this.processedNode.id, adj[this.iterator].weight);
					this.processedNode.pred = this.currentNode;
				}
				this.iterator++;
				break;
			}
			
			if(this.iterator >= adj.length) {
				// no more neighbours
				this.requestAnother = true;
			}
		} 
		else {
			// check if there are still nodes left
			this.currentNode = this.pq.dequeue();
			this.requestAnother = false;
			this.iterator = 0;
			this.processedNode = null;
			
			if(!this.currentNode) {
				// no more nodes. end
				this.phase = 2;
				this.solved = true;
			}
			else
			{			
				console.log("Dequeued min node " + this.currentNode.id);
				this.currentNode = this.currentNode.item;
				this.currentNode.isTree = true;
			}
		}
	}
	return 0;
}



var GridCanvas = {};
GridCanvas.init = function(canvasId, graph) {
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.firstUpdate = true;
	this.prevTime = 0;
	window.requestAnimationFrame(this.render);
	
	this.origCountDown = 0.3;
	this.countDown = 0;
	this.graph = graph;
	this.animate = false;
};

GridCanvas.FULLCIRCLE = 2*Math.PI;

GridCanvas.render = function(elapsed){
	var ctx = GridCanvas.context;
	var o = GridCanvas;
	var graph = o.graph;
	
	ctx.fillStyle = "#659CEF";
	ctx.fillRect(0,0,o.width, o.height);

	if(o.firstUpdate) {
		o.prevTime = elapsed;
		o.firstUpdate = false;
	}
	else {
		var diffTime = elapsed - o.prevTime;
		o.prevTime = elapsed;
		diffTime /= 1000.0;
		
		o.countDown -= diffTime;
		if(o.countDown<0) {
			o.countDown = o.origCountDown;
			if(o.animate) graph.tick();
		}
		
		// rendering
		
		// draw edges based on adjacency list
		var i,j,adj, neigh, node;
		ctx.font = "24px Arial bold";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		for(i=0;i<graph.nodes.length;i++) {
			adj = graph.adjacencyList[i];
			for(j=0;j<adj.length;j++) {
				
				if(adj[j].neighbourId <= i)
					continue;
				
				node = graph.nodes[i];
				neigh = graph.nodes[adj[j].neighbourId];
				
				ctx.lineWidth = 2;
				ctx.strokeStyle="black";
				
				// check if this edge is being processed
				if((node == graph.processedNode && neigh == graph.currentNode) ||
					(neigh == graph.processedNode && node == graph.currentNode)) {
					ctx.strokeStyle="#FF00DD";
				}
				
				// check if the endpoints are in tree
				if(node.isTree && neigh.isTree && 
					(neigh.pred == node || node.pred == neigh) ) {
					ctx.lineWidth=4;
					ctx.strokeStyle="#00FF00";
				} else if(graph.solved) {
					continue;
				}
				
				ctx.beginPath();
				ctx.moveTo(node.x, node.y);
				ctx.lineTo(neigh.x, neigh.y);
				ctx.stroke();
				
				ctx.fillStyle="#00FFFF";
				ctx.fillText(adj[j].weight, (node.x + neigh.x)/2, (node.y + neigh.y)/2);
			}
		}
		
		// draw the nodes	
		ctx.font = "18px Arial bold";
		for(i=0;i<graph.nodes.length;i++) {
			node = graph.nodes[i];
			ctx.beginPath();
			ctx.arc(node.x,node.y,16,0,o.FULLCIRCLE);
			
			ctx.lineWidth = 2;
			ctx.fillStyle="white";
			ctx.strokeStyle = "black";
			if(node.isTree) ctx.fillStyle = "#00AA00";
			if(node == graph.currentNode) ctx.fillStyle = "#AA0000";
			else if(node == graph.processedNode) {
				ctx.strokeStyle = "#FF00DD";
				ctx.lineWidth = 4;
			}
			
			ctx.fill();
			ctx.stroke();
			
			ctx.fillStyle="black";
			ctx.fillText(node.id+1, node.x, node.y);
		}
	}
	window.requestAnimationFrame(o.render);
};
