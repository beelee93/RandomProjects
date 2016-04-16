#include "Sort.h"
#ifndef __QUICKSORT_H
#define __QUICKSORT_H

class QuickSort : public Sort{
public:
	QuickSort(int arr[], int N);
	int* sort();

private:
	void quickSort(int st, int en);
};

#endif