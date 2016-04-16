#include "MergeSort.h"

MergeSort::MergeSort(int arr[], int N) : Sort(arr, N) {
	this->aux = new int[N];
	sprintf(this->name, "MergeSort");
};

MergeSort::~MergeSort() {
	delete[] aux;
}

////////////////////////////////////////////////////////////////////
// Runs the merge sort algorithm on the selected range
////////////////////////////////////////////////////////////////////
void MergeSort::mergeSort(int st, int en){
	if (en - st <= 0) return;

	int mid = (st + en) / 2;

	mergeSort(st, mid);
	mergeSort(mid + 1, en);

	merge(st, mid, en);
}

////////////////////////////////////////////////////////////////////
// Merging algorithm
////////////////////////////////////////////////////////////////////
void MergeSort::merge(int st, int mid, int en) {
	if (st == en) return;

	int pA = st; // pointers
	int pB = mid + 1;
	int pRes = 0;

	while (pA <= mid && pB <= en) { // while the two halves are not "empty"
		if (resArr[pA] > resArr[pB]) aux[pRes++] = resArr[pB++];
		else if (resArr[pA] < resArr[pB]) aux[pRes++] = resArr[pA++];
		else {
			// equal elements - copy both in
			aux[pRes++] = resArr[pA++];
			aux[pRes++] = resArr[pB++];
		}
	}

	// reaching here, one of the list is empty
	// so, one of these loops will run
	for (; pA <= mid; pA++)
		aux[pRes++] = resArr[pA];
	for (; pB <= en; pB++)
		aux[pRes++] = resArr[pB];

	// copy over results
	memcpy(resArr+st, aux, sizeof(int) * (en - st + 1));
}

int* MergeSort::sort() {
	cloneOver(); // reset resArr

	mergeSort(0, size - 1);
	return resArr;
}