#include "Sort.h"

Sort::Sort(int arr[], int N) {
	this->size = N;
	this->origArr = arr;
	this->resArr = new int[N];
}

Sort::~Sort() {
	delete[] resArr;
	resArr = NULL;
}

int Sort::getSize() {
	return size;
}

void Sort::cloneOver() {
	memcpy(resArr, origArr, sizeof(int) * size);
}

void swap(int* a, int* b) {
	int temp = a[0];
	*a = *b;
	*b = temp;
}

char* Sort::getName() {
	return this->name;
}