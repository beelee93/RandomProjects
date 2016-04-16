#include "includes.h"

using namespace std;

void printArray(int arr[], int N)
{
	for (int i = 0; i < N; i++)
	{
		cout << arr[i] << " ";
		if (i % 10 + 1 == 10) cout << endl;
	}
}

int main()
{
	int arr[] = { 1, 5, 3, 6, 2, 5, 1, 3, 9, 7 };
	
	Sort* sorters[5] = {
		new InsertionSort(arr, 10),
		new MergeSort(arr, 10),
		new HeapSort(arr, 10),
		new QuickSort(arr, 10),
		new BubbleSort(arr, 10)
	};

	int* res;
	for (int i = 0; i < 5; i++)
	{
		res = sorters[i]->sort();
		cout << sorters[i]->getName() << "\t\t:";
		printArray(res, 10);
		delete sorters[i];
	}
}