---
title: 3개 숫자의 합이 소수인가?!
date: '2019-11-19T19:23:48.000Z'
layout: post
draft: false
path: '/posts/prime-number-of-sum-of-three-numbers'
category: 'THE OTHERS'
tags:
  - 'Programmers'
  - 'Algorithm'
  - 'Javascript'

description: 배열 안의 숫자 중 3개를 무작위로 더한 값이 소수인지 판별하는 알고리즘 문제이다. 해당 문제는 프로그래머스에서 제공하는 문제다.
---

# 문제
주어진 숫자 중 3개의 수를 더했을 때 소수가 되는 경우의 개수를 구하려고 합니다. 숫자들이 들어있는 배열 nums가 매개변수로 주어질 때, nums에 있는 숫자들 중 서로 다른 3개를 골라 더했을 때 소수가 되는 경우의 개수를 return 하도록 solution 함수를 완성해주세요.

# 제한조건
- nums에 들어있는 숫자의 개수는 3개 이상 50개 이하입니다.
- nums의 각 원소는 1 이상 1,000 이하의 자연수이며, 중복된 숫자가 들어있지 않습니다.
- 가능한 경우의 수를 return 합니다.

# 생각한 풀이 방법
먼저 배열의 값을 3개 뽑기 위해 for문을 3중첩으로 해야겠다고 생각했다. 더 좋은 방법이 있을 것으로 생각되지만, 시작 Index가 첫 번째 요소의 +1인 총 3개의 숫자가 필요했고, 총 회전 수가 length보다 -2, -1, 0 차이나도록 설정하는데 가장 적합한 방법이 for문으로 생각되었다. 
이 후, 배열의 요소는 중복되지 않기 때문에 세 개 숫자의 합 최소는 6이므로 소수 중에는 짝수가 2밖에 없고, 2를 제외한 소수는 짝수가 아니기 때문에 2로 나눠질 경우 바로 다음 경우의 수를 검사하도록 설정했다.
마지막으로 세개의 숫자 합이 소수인지 판단하는 함수를 생성했다. 함수의 로직은 소수는 1과 자기 자신 외에 나눠지는 숫자가 없으므로, for문을 통해 2부터 세개의 숫자 합을 나눠서 본인외에 나눠지는 수가 없으면 true를 반환하도록 설정했다.

```
function solution(nums) {
    let answer = 0;
    const numsLen = nums.length;

    for(let i = 0; i < numsLen - 2; i++){
        for(let j = i + 1; j < numsLen - 1; j++) {
            for (let k = j + 1; k < numsLen; k++) {
                const numSum = nums[i] + nums[j] + nums[k];
                if(numSum % 2 === 0) continue;
                else if(isPrime(numSum)) answer++;
            }
        }
    }

    return answer;
}

function isPrime(num) {
    let isPrime = false;
    const dividedNums = [];

    for(let i = 2; i <= num; i++) {
        const restOfDivision = num % i;
        if(restOfDivision === 0) dividedNums.push(i);
    }
    return dividedNums.length === 1;
}
```


___

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
