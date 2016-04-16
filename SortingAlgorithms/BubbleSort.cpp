#include "BubbleSort.h"

BubbleSort::BubbleSort(int arr[], int N) : Sort(arr, N) {
	sprintf(this->name, "BubbleSort");
}

////////////////////////////////////////////////////////////////////
// Performs sorting via BubbleSort
////////////////////////////////////////////////////////////////////
int* BubbleSort::sort() {
	cloneOver(); //reset resArr
	int N, i;
	for (N = size - 1; N > 0; N--)
	{
		for (i = 0; i < N; i++)
		{
			if (resArr[i] > resArr[i + 1])
				swap(&resArr[i], &resArr[i + 1]);
		}
	}
	return resArr;
}