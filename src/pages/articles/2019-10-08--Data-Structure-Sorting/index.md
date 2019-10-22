---
title: 자료구조 - Sort
date: '2019-10-08T12:44:22.000Z'
layout: post
draft: false
path: '/posts/data-structure-sorting/'
category: 'CS'
tags:
  - 'Data-Structure'
  - 'Sort'
  - 'Quick-Sort'
  - 'Javascript'
  - 'Front-end'

description: Data Structure와 알고리즘을 공부하면서 Sort와 그 알고리즘에 대해 학습한 내용을 정리하고자한다.
---
React의 Memoization, Tree 구조 등, 공부를 하면 할 수록 Data Structure에 대한 용어와 개념을 접하면서 공부의 필요성을 더욱 체감하게 됐다. 절대적으로 공부벌레는 아니지만, 개발을 하면서 사용하는 기술의 원리나 효율적인 사용 방법에 대해 계속 관심이 가게 되다보니 자연스럽게 자료구조 공부의 필요성을 느끼게 되었다. (하지만 생각보다 열심히 하지 않는게 함정...)  

일단 몇 가지 중요하다고 여겨지는 정렬에 대해 정리하고자한다.

# Sort (정렬)
정렬은 *컴퓨터에서 데이터를 빠르게 찾아낼 수 있는 방법*으로 굉장히 중요한 주제 중 하나이다. 정렬된 배열이 당연히 정렬되지 않은 배열보다 검색이 빠를 수 밖에 없다. 이러한 개념을 바탕으로 속도와 공간면에서 장단점을 갖고 있는 다양한 정렬 방식이 있다.

# Quicksort (빠른 정렬)

**Quicksort**란 기준점을 기준으로 배열을 나누고 한 쪽에는 기준점보다 큰 항목들이, 다른 쪽에는 작은 항목을 위치시키면서 모든 항목이 정렬될 때까지 이 과정을 반복한다. 가장 이상적인 기준점은 배열의 중간 값이겠지만, 현실적으로 정렬되지 않는 배열의 중간 값을 구하기 위해서는 추가적인 비용이 들기 때문에 첫 번째 항목과 중간 항목, 마지막 항목의 중간 값을 취해 기준점을 얻는 방식으로 진행한다고 한다.  
아래 예를 확인해 보자.

![011019_1052_QuickSortAl2](https://user-images.githubusercontent.com/37759759/66368185-3a2de100-e9d2-11e9-937c-e4137c48684a.png)

위의 사진 처럼, 5, 6, 9의 중간 값은 6이기 때문에 6을 기준점으로 잡고, 양쪽 끝에서부터 하나씩 중간 값으로 전진하며 비교한다. 5는 6보다 작기 때문에 다음 3으로 넘어가고, 3도 작기 때문에 7로, 7은 6보다 크기 때문에 이제 오른쪽에서 비교를 시작한다. 6과 9를 비교하고 9가 크기 때문에 다음 2로 넘어가고 2는 6보다 작기 때문에 앞서 왼쪽에서 6보다 컸던 7과 Switch 한다. 그리고 나서 중간 값 6을 기준으로 양쪽 데이터를 둘로 나눠 다시 기준점을 잡고 정렬을 하는 방식이다.

알고리즘은 아래와 같다.

```
const partition = (array, left, right) => {
  const pivot = array[Math.floor((right + left) / 2)];

  while(left <= right) {
    while(pivot > array[left] ) {
      left++;
    }

    while(pivot < array[right]) {
      right--;
    }

    if(left <= right) {
      const temp = array[left];
      array[left] = array[right];
      array[right] = temp;
      left++;
      right--;
    }
  }
  return left;
}

const quickSortHelper(items, left, right) {
  let idx;
  if(items.length > 1) {
    idx = partition(items, left, right);

    if(left < idx - 1) {
      quickSortHelper(items, left, idx - 1);
    }

    if(idx < right) {
      quickSortHelper(item, idx, right);
    }
  }
  return items;
}

const quickSort = () => {
  return quickSortHelper(items, 0, items.length-1)
}

quickSort([6, 1, 23, 4, 2, 3]);
```


# 도움받은 블로그

[TOAST UI](https://ui.toast.com/weekly-pick/ko_20190731/)  
[Kent C. Dodds](https://kentcdodds.com/blog/usememo-and-usecallback)  

___

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
