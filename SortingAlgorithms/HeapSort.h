#include "Sort.h"

#ifndef _HEAPSORT_H
#define _HEAPSORT_H

class HeapSort : public Sort {
public:
	HeapSort(int arr[], int N);
	~HeapSort();
	int* sort();

private:
	void heapify();
	void fixHeap(int index, int lastIndex);
};

#endif