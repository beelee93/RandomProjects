/**
 * Priority Queue, with minimising heap structure
 */
 function QueueNode(timeStamp,item,id) {
		this.timeStamp = timeStamp;
		this.item = item;
		this.id = id;
 }
 
 // returns -1 if this node is smaller than specified node
 // uses keyName as the associative array key
 QueueNode.prototype.compare = function(node, keyName) {
	 var key1, key2;
	 key1 = this.item[keyName];
	 key2 = node.item[keyName];
	 
	 if(key1 < key2) return -1;
	 else if(key1 > key2) return 1;
	 else {
		 key1 = this.timeStamp;
		 key2 = node.timeStamp;
		 if(key1 < key2) return -1;
		 else if(key1>key2) return 1;
		 else return 0;
	 }
 };
 
 function PriorityQueue(keyName) {
	 this.timeStamp = 0;
	 this.nodes = [];
	 this.keyName = keyName;
 }
 
 PriorityQueue.FixDirection = {
	'TopToBottom' : 0,
	'BottomToTop' : 1
 };
 
 PriorityQueue.prototype.enqueue = function(item, id) {
	 var a = new QueueNode(this.timeStamp++,item, id);
	 this.nodes.unshift(a);
	 this._fixHeap(0, 0);
 };
 
 PriorityQueue.prototype.dequeue = function() {
	 if(this.isEmpty()) return null;
	 
	 var res = this.nodes[0];
	 var swap = this.nodes[0];
	 this.nodes[0] = this.nodes[this.nodes.length-1];
	 this.nodes[this.nodes.length-1] = swap;
	 this.nodes.pop();
	 this._fixHeap(0, 0);
	 
	 return res;
 };
 
 PriorityQueue.prototype.isEmpty = function() {
	 return (this.nodes.length == 0);
 };
 
 // fixes heap from source
 // direction takes the FixDirection enum
 PriorityQueue.prototype._fixHeap = function(source, direction) {
	var root, leftChild, rightChild, last, temp, swap;
	root = source;
	last = this.nodes.length-1;
	
	if(direction == 0) {
		while(root<=last) {
			temp = root;
			leftChild = 2*root + 1;
			rightChild = leftChild + 1;
			if(leftChild>last) break; // leaf node
			
			if(this.nodes[temp].compare(this.nodes[leftChild], this.keyName) > 0)
					temp = leftChild;
			if(rightChild <= last && this.nodes[temp].compare(this.nodes[rightChild], this.keyName) > 0) 
					temp=rightChild;
			
			if(temp == root) break; // done
			
			swap = this.nodes[temp];
			this.nodes[temp] = this.nodes[root];
			this.nodes[root] = swap;

			root = temp;
		}
	}
	else if(direction == 1){
		var parent = Math.floor( (root-1) / 2);
		while(parent >= 0) {
			temp = root;
			if(this.nodes[temp].compare(this.nodes[parent], this.keyName) < 0)
				temp = parent;
			
			if(temp == root) break; // swap
			
			swap = this.nodes[temp];
			this.nodes[temp] = this.nodes[root];
			this.nodes[root] = swap;

			root = parent;
			parent = Math.floor( (root-1) / 2);
		}
	}
	else
		throw new Error("Wrong direction argument");
 };
 
 PriorityQueue.prototype.adjustKey = function(nodeId, newKey) {
	 for(var i=0;i<this.nodes.length;i++){
		 if(this.nodes[i].id == nodeId){
			 this.nodes[i].item[this.keyName] = newKey;
			 this._fixHeapAfterAdjust(i);
			 break;
		 }
	 }
 };
 
 // Invoke this if the key of the source node is adjusted
 PriorityQueue.prototype._fixHeapAfterAdjust = function(source) {
	 var last = this.nodes.length-1;
	 
	 if(source < 0 || source > last) return 0;
	 
	 var parent = Math.floor ( (source - 1) / 2);
	 
	 if(parent>=0 && this.nodes[parent].compare(this.nodes[source], this.keyName) > 0)
     {
		 this._fixHeap(source, 1); // BottomToTop
     }
	 else
	 {
		 this._fixHeap(source, 0); // TopToBottom
	 }
 };