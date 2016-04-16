#include "Sort.h"

#ifndef _BUBBLESORT_H
#define _BUBBLESORT_H
class BubbleSort : public Sort {
public:
	BubbleSort(int arr[], int N);
	int* sort();
};

#endif