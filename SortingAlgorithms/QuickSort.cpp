#include "QuickSort.h"

QuickSort::QuickSort(int arr[], int N) : Sort(arr, N) {
	sprintf(this->name, "QuickSort");
}

////////////////////////////////////////////////////////////////////
// Performs the sorting via quick sort
////////////////////////////////////////////////////////////////////
int* QuickSort::sort() {
	cloneOver(); // reset resArr

	quickSort(0, size - 1);
	return resArr;
}

////////////////////////////////////////////////////////////////////
// QuickSort algorithm
////////////////////////////////////////////////////////////////////
void QuickSort::quickSort(int st, int en)
{
	if (en - st <= 0) return; // 1 element or less, do nothing

	int pivot = (st + en) / 2; // find pivot
	int i, lastSmall;

	// swap starting element with first element
	swap(&resArr[st], &resArr[pivot]);
	lastSmall = st;

	// partition
	for (i = st + 1; i <= en; i++) 
		if (resArr[i] < resArr[st])	swap(&resArr[i], &resArr[++lastSmall]);

	// swap lastSmall element with pivot
	swap(&resArr[lastSmall], &resArr[st]);

	// quick sort the smaller subsets
	quickSort(st, lastSmall - 1);
	quickSort(lastSmall + 1, en);
}