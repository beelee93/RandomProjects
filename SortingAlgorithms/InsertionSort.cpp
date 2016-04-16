#include "InsertionSort.h"

InsertionSort::InsertionSort(int arr[], int N) : Sort(arr, N) {
	sprintf(this->name, "InsertionSort");
}

////////////////////////////////////////////////////////////////////
// Performs the sorting via Insertion Sort
////////////////////////////////////////////////////////////////////
int* InsertionSort::sort() {
	cloneOver(); // reset resArr

	int temp;
	int i,j;

	for (i = 1; i < size; i++) {
		for (j = i; j > 0; j--){
			if (resArr[j] < resArr[j - 1])
				swap(&resArr[j], &resArr[j - 1]);
			else
				break; 
		}
	}

	return resArr;
}