#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include <string.h>

#ifndef _SORT_H
#define _SORT_H

class Sort {
protected:
	char name[64];
	int* resArr;
	int* origArr;
	int size;
	void cloneOver();

public:
	Sort(int arr[], int N);
	virtual ~Sort();
	virtual int* sort() = 0;
	int getSize();
	char* getName();
};

void swap(int* a, int* b);
#endif