---
title: "Map과 Set의 차이를 다시 한 번 정리하다."
date: "2019-09-18T14:05:14.000Z"
template: "post"
draft: false
slug: "map-and-set"
category: "JAVASCRIPT"
tags:
  - "ES6"
  - "Map"
  - "Set"
  - "Javascript"
  - "Front-end"
  - "Array"
  - "Object"

description: 완전 초창기에 개념 없이 배웠던 Map과 Set을 다시 한 번 복습하려고 한다. Map과 Set을 처음 공부했을 때 도저히 이해가 안갔던 부분이 이제는 조금씩 이해되다보니 다시 문서화하고 싶다는 생각이 들었다.
---
**"왜 Map과 Set을 쓸까? Object와 Array가 있는데.. 도대체 뭐가 효율적인거야?"** 

내가 기억하는 처음 Map과 Set을 이론으로만 공부했을 때의 느낀점이다. 자료구조가 뭔지도 몰랐을 (사실 지금도 너무 몰라서 공부중이지만) 시절에 Map과 Set의 특징만 보면서 '이런게 있구나' 라는 정도만 알고 넘어갔던 ES6의 기능이였다.

사실 코딩을 하면서 Map과 Set을 사용했던 적은 최근검색 UI를 만들때 중복된 배열의 요소를 없애기 위해 사용해본 적 외엔 제대로 사용해 본 적이 없다. 하지만 공부를 할 수록 '활용도가 꽤나 크겠다'라는 생각을 갖게 되어서 이를 문서화 시켜 머릿속에서 잊어버릴 때쯤 상기하자는 마음으로 이렇게 정리하기로 했다. 겸사겸사 면접 연습도 될 것 같다는 1+1의 이점도 있겠다..

## Map

Map의 특징을 일단 정리하자면,
1. Map은 Object와 상당히 유사한 순회 가능한 객체이다.
2. [key, value]의 형태로 이뤄져있으며, 선언하거나 추가시 이러한 형태로 값을 넣어주어야한다.
3. [key, value] 형태에서 key 부분이 어떠한 타입이어도 상관 없다. Object는 string과 symbol만 가능하다.
4. length가 아닌 size로 Map 값의 크기를 알 수 있다.
5. 여러 메소드가 있는데 `map.get('a')`과 같은 방식으로 값을 가져올 수 있으며, 전체 key값이나 value값을 가져오는 방식 또한 메소드로 갖고 있다. `map.keys()` , `map.values()`
6. Map의 요소를 배열로 받을 수 있는 방법으로 `[...Map] // return [['a', 1], ['b', 2]]` 스프레드 연산자를 사용할 수 있으며, `for (let [key, value] of map` 또는 `for (let keyvalue of map)`의 형태로 key값과 value값을 순회하며 접근할 수 있다. (전자는 key와 value를 destructuring으로 각각 접근 할 수 있는 것)
7. for in을 사용한 순회방식은 undefined만 리턴한다.
8. Object와 마찬가지로 동일한 Key값을 가진 값은 맨 마지막 요소만 값으로 갖는다. `new Map([['a', 1], ['a', 2]]) // return {"a" => 1}`
9. Object는 key값이 숫자로 된 string인 경우, 그 key값이 숫자인 다른 property와 자동적으로 정렬이 일어나지만, Map은 내가 설정한 순서 그대로를 유지한다.
10. 배열과 다르게 숫자와 숫자로 된 string이 key값일 경우 엄격하게 검사한다. `Map([1, 'b']) // map.has('1') return false`

사실 객체를 사용한다면 굳이 사용할 일이 많지 않겠구나 라는 생각은 변함이 없지만, Map이 **key값을 사용해 property를 delete하는 경우**, **key값에 대한 정렬**, **굉장히 큰 양의 데이터를 저장한 경우**에서 더 좋은 performance를 낸다고 한다. 앞으로 프로젝트를 진행하면서, 또는 현업에서 일하면서 그 사용 사례나 필요성을 고민해봐야겠다.

## Set

Set의 특징을 정리해보자면,
1. 배열과 유사한 순회 가능한 객체이다.
2. 배열처럼 value로만 이뤄져있지만, 값이 키와 동일하게 설정되어있다.
```javascript
cosnt set = new Set(['a', 'b', 'c'])
set.keys() // return {'a', 'b', 'c'}
set.values() //return {'a', 'b', 'c'}
```
3. 값은 중복될 수 없으며, 중복될 경우 가장 앞의 값을 제외하고 삭제된다. `new Set([1, 2, 1]) // return {1, 2}`
4. 배열처럼 `set[1]`이나 `set.value(1) // 메서드 자체가 없음`로 중간 값을 확인할 수 없으며, 전체를 순회하는 방식으로만 사용 가능하다. 
5. 이 또한 size 메소드로 length대신 크기를 확인할 수 있다.
6. splice를 사용하지 않고 `delete(value)` 메소드를 사용해 손쉽게 배열의 중간 값을 잘라낼 수 있다. `delete`메소드는 `true` or `false` 값을 리턴한다.
7. 배열의 값이 있는지 확인하려는 경우, 배열의 indexOf나 includes를 통해 확인하는 것 보다 `set.has(value)`로 확인하는 것이 더욱 빠르다. 리턴 값은 `true` or `false`이다.

Set은 확실히 Map보다는 활용도가 높다고 생각했다. 최근 검색 UI를 만들 때, 최근검색 기록에 있는 기존 검색어를 재 입력했을 경우 Set을 사용해 처리한 적이 있다. 이 때, 복잡한 코드 및 알고리즘을 쓰지 않고 단 한 줄만으로 해결해 굉장히 유용했던 적이 있는데, 현업에서도 많이 쓰인다하니 항상 머릿속에 두고 활용할 곳을 찾아봐야겠다.

## WeakMap, WeackSet

대부분 사용하지 않거나 활용된 곳을 찾기 힘들다고 한다. 각각 Map과 Set의 기능과 공통된 부분이 많으나 다른 부분을 정리하자면,
1. Map의 key에 해당하는 값과 Set의 값은 오로지 객체만 받을 수 있다.
2. 자동적으로 Garbage Collection을 하여 사용하지 않는 참조는 모두 삭제된다.

```javascript
const weakSet = new WeakSet([{a: 'a'}]);
weakSet // return WeakSet {} : 참조가 없어 Garbage Collection 됨.
```

## Advanced Utilization

위에 언급하지는 않았지만, Map과 Set 모두 entries라는 메소드로 모든 iterator 객체를 차례대로 순회할 수 있다.
Set을 예로 들자면, 

```javascript
const set = new Set(['a', 'b']); // return {"a", "b"}
const setEnt = set.entries(); // return SetIterator 
setEnt.next() // {value: ["a", "a"], done: false}
setEnt.next() // {value: ["b", "b"], done: false}
setEnt.next() // {value: undefined, done: true}
```

모든 객체를 한 번에 순회하는 것이 아닌, 필요한 부분까지 순회하고 끝낼 수 있어 이러한 방식으로 활용도가 있다고 생각한다.

또는 spread연산자로 배열화하여 배열 메서드를 활용해 Set함수간의 교집합, 차집합 등을 계산 할 수 있어 이러한 방식도 공부해보고 사용하면 좋을 것 같다.

## 도움받은 블로그
[코드버스트](https://codeburst.io/array-vs-set-vs-map-vs-object-real-time-use-cases-in-javascript-es6-47ee3295329b)  
[Kevin Seaokyou Hong](https://medium.com/@hongkevin/js-5-es6-map-set-2a9ebf40f96b)  
[Maya shavin](https://medium.com/front-end-weekly/es6-map-vs-object-what-and-when-b80621932373)  
[MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map#%EC%84%A4%EB%AA%85)

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.


---
