#include "HeapSort.h"

HeapSort::HeapSort(int arr[], int N) : Sort(arr, N) {
	sprintf(this->name, "HeapSort");
};
HeapSort::~HeapSort() { }

////////////////////////////////////////////////////////////////////
// Performs the heapsort
////////////////////////////////////////////////////////////////////
int* HeapSort::sort() {
	cloneOver(); // reset resArr

	// construct a heap
	heapify();

	// perform the sort
	int i, temp;
	for (i = size - 1; i > 0; i--) {

		// swap node 0 (root) with the node (i)
		swap(&resArr[0], &resArr[i]);
		
		// fix the heap up until immediately before node (i)
		fixHeap(0, i-1);
	}

	return resArr;
}

////////////////////////////////////////////////////////////////////
// Fixes the heap starting from index node until lastIndex node
////////////////////////////////////////////////////////////////////
void HeapSort::fixHeap(int index, int lastIndex) {
	int swapVictim, leftChild, rightChild, temp;

	// iterate through the tree
	while (index <= lastIndex) {
		// compare root (which is index) with its children
		swapVictim = index;
		leftChild = 2 * index + 1;
		rightChild = leftChild + 1;

		if (leftChild > lastIndex) return; // no children left to check

		// get the largest child
		if (resArr[swapVictim] < resArr[leftChild]) swapVictim = leftChild;
		if (rightChild <= lastIndex && resArr[swapVictim] < resArr[rightChild]) swapVictim = rightChild;

		if (swapVictim == index) {
			// nothing needs to be swapped
			return;
		}
		else {
			// perform the swap
			swap(&resArr[index], &resArr[swapVictim]);
			
			index = swapVictim; // fix this sub tree
		}
	}
}

////////////////////////////////////////////////////////////////////
// Iteratively fixes the heap from bottom-up, starting with the 
// parent of the last leaf node
////////////////////////////////////////////////////////////////////
void HeapSort::heapify() {
	if (size <= 1) return;

	// start from the parent of the last leaf and 
	// fix all the way up
	int i = size / 2 - 1;
	for (; i >= 0; i--) {
		fixHeap(i, size - 1);
	}
}