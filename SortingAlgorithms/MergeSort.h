#include "Sort.h"

#ifndef _MERGESORT_H
#define _MERGESORT_H

class MergeSort : public Sort {
public:
	MergeSort(int arr[], int N);
	~MergeSort();
	int* sort();

private: 
	int* aux;
	void mergeSort(int st, int en);
	void merge(int st,int mid, int en);
};

#endif