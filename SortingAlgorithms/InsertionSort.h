#include "Sort.h"

#ifndef _INSERTIONSORT_H
#define _INSERTIONSORT_H

class InsertionSort : public Sort {
public:
	InsertionSort(int arr[], int N);
	int* sort();
};

#endif