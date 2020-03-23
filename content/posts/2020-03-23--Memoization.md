---
title: 'Memoization과 React'
date: '2020-03-24T14:06:23.000Z'
template: 'post'
draft: false
slug: 'memoization-and-react'
category: 'Javascript'
tags:
  - 'frontend'
  - 'memoization'
  - 'javascript'
  - 'react'
  - 'optimization'
  - 'data structure'

description: React 앱의 최적화를 위해 사용하는 memo, useMemo, useCallback. 제대로 알고 사용하기 위해 Memoization에 대해 들여다 보기로 했다.
---

## 들어가기에 앞서
React에서 Re-rendering 최적화를 위한 API인 ***memo***, ***useMemo***, ***useCallback***을 사용하면서 내가 올바르게 사용하고 있는지, 가끔은 사용하면서도 왜 Re-rendering이 발생하는지에 대한 궁금증을 해소하고 싶었다. 이를 위한 첫 걸음으로 Memoization에 대해 학습한 내용을 정리해 보고 공유하고자한다.

이 글은 [better-programming](https://medium.com/better-programming/react-memo-vs-memoize-71f85eb4e1a)에서 학습한 내용을 바탕으로 작성하여 예시 코드 및 내용을 참조하고 있다.

## Memoization의 의미
사전적 의미, 또는 이론상의 의미로 Memoization은 다음과 같이 정의되어 있다.

> **메모이제이션**(Memoization)은 컴퓨터 프로그램이 동일한 계산을 반복해야 할 때, 이전에 계산한 값을 메모리에 저장함으로써 동일한 계산의 반복 수행을 제거하여 프로그램 실행 속도를 빠르게 하는 기술이다. 동적 계획법의 핵심이 되는 기술이다. **메모아이제이션**이라고도 한다.

Memoization을 처음 접했을 때는 단순히 Caching의 한 방법이구나 라고 생각하고 넘어간 적이 있었다. 사실 당시에는 지금보다 CS 부분 이해도가 현재보다는 높지 않았고, Frontend 학습을 넓게 하던 시기여서 깊이 있게 학습하지 못해 전에 결과 값을 cache하는 용도이구나 라고 생각하고 넘어갔다. 하지만 React를 사용하면서 Memoization은 단순히 결과 값만을 cache하는 것이 아니라 기존의 function 또한 같은 방법으로 cache하는 것을 보며 새로운 호기심이 생기게 되었다. 그렇다면 어떤식으로 Memoization이 사용될까?

## 일반적으로 Memoization이 활용되는 경우
[better-programming](https://medium.com/better-programming/react-memo-vs-memoize-71f85eb4e1a)에서는 Memoization이 어떻게 활용되는지 설명하기 위해 [memoize-one](https://github.com/alexreardon/memoize-one) 라이브러리를 사용했다.

먼저 [memoize-one](https://github.com/alexreardon/memoize-one)라이브러리는 ***함수를 인자로 받아 동일한 arguments를 가진 함수를 연속해서 호출할 경우 최초의 호출시에만 함수를 실행하고 memoize한 뒤 나머지 호출은 memoize한 결과 값을 출력하는 형태의 라이브러리라고 한다.***

이 [memoize-one](https://github.com/alexreardon/memoize-one)라이브러리를 통해 Memoization이 어떻게 이뤄지는지 확인해보자.

```javascript
import memoize from 'memoize-one';

function add(a, b) {
 console.log('add');
 return a + b;
}

const memAdd = memoize(add);

console.log(memAdd(1, 2))
console.log(memAdd(1, 2))
```

위의 코드를 실행하면 결과값은 어떻게 나올까? 아래와 같이 나온다.
```
add // 1
3 // 2
3 // 3
```

먼저 add함수를 **memoize(memoize-one API)**에 넣어 새로운 함수 **memAdd**를 반환하고, 새로운 함수에 인자를 넣어 처음 실행할 때 함수 안의 `console.log('add')`가 실행되어 **1**이 출력된다. 이후 리턴 값인 3이 출력되고 첫 번째 함수 호출이 종료된다. 두 번째 호출에서는 **memAdd**에 입력된 arguments가 동일하므로 함수가 다시 호출되는 것이 아닌, memoize된 기존 값을 출력하여 `console.log('add')`는 제외한 **3**만 출력되게 된다.

여기서 확인할 수 있는 것은 **Memoization은 Side Effects가 없는 순수 함수에서만 사용하는 것이 좋다**는 것이다. 만약 순수함수가 아닌 함수에서 사용한다면 어떻게 될까? 아래 예시와 같은 상황이 발생한다.

``` javascript
let c = 1;
function sideEffectAdd(a, b) {
 console.log('seAdd')
 return a + b + c;
}
const memAdd = memoize(sideEffectAdd);
console.log(memAdd(1, 2))
console.log(memAdd(1, 2))
c++
console.log(memAdd(1, 2))
```
```
seAdd
4
4
4
```

중간에 c에 대한 값을 변경했음에도 동일한 arguments를 전달 받기 때문에 Memoization 값을 실행하게 된다.

그렇다면 Memoization이 React에서는 어떻게 사용되고 있을까?

## React.memo에서의 Memoization
React에서 Memoization을 활용하는 대표적인 API로는 ***React.memo***, ***React.useMemo***, ***React.useCallback***이 있다. 그렇다면 이 API들은 어떤 방식으로 동작하는지 확인할까?

먼저 ***React.memo***가 사용된 예시를 확인해보자.

```javascript
import React, { memo } from "react";
import "./App.css";

const Add = memo(props => {
 const result = props.number * 2;
 console.log('component rendered')
 return <div>Component - {result}</div>;
});

function App() {
 return (
  <div className="App">
    <Add number={2} />
    <Add number={2} />
    <Add number={2} />
  </div>
 );
}
export default App;
```

[better-programming](https://medium.com/better-programming/react-memo-vs-memoize-71f85eb4e1a)는 이 예시에서 ***React.memo***가 컴포넌트의 instance, 즉 각각의 동일한 컴포넌트들이 props의 변화 없이 re-rendering될 경우 지난 결과와 동일한 값을 출력할 것이라는 것을 설명하였다. 이 과정은  이미 대부분이 알고 있는 내용이라서 간단히 설명하자면, `<Add number={2} />`는 함수가 아닌 컴포넌트이기 때문에 각각의 호출에 대해 서로의 Memoization 값을 공유하지는 않는다는 것이다. 

아래의 코드에서는 ***React.memo***를 통해 `Add`컴포넌트가 동일한 props를 전달받기 때문에 Memoization을 활용해 리렌더링 하지 않는 것을 보여주고 있다.

``` javascript
import React, { memo, useState } from "react";
import "./App.css";

const Add = memo(props => {
 const result = props.number * 2;
 console.log('component rendered');

 return <div>Component - {result}</div>;
});

function App() {
 const [value, setValue] = useState(0);
 console.log('outter component rendered');

 return (
  <div className="App">
    <Add number={2} />
    <button onClick={() => setValue(value + 1)}>
      Click me
    </button>
  </div>
 );
}

export default App;
```
![memoize-example](https://miro.medium.com/max/971/1*UrkKxuMn-CmsudYoPhFOcQ.gif)

## React.useMemo, React.useCallback에서의 Memoization

***React.useMemo***나 ***React.useCallback***도 동일한 원리로 동작한다고 한다. 여러가지 공식 문서나 블로그를 통해 어떤식으로 memoization이 되는지 학습하기 어려웠지만, ***useMemo***와 ***useCallback***과 동일한 동작을 하는 [use-memo-one](https://github.com/alexreardon/use-memo-one/blob/master/src/index.js#L33)라이브러리의 소스코드를 확인해보니 useCallback과 useMemo는 두 번째 인자로 들어온 배열의 요소 변화유무를 체크하여 기존 값과 비교해 변경되지 않으면 기존 momoize한 첫 번째 인자인 callback function을 다시 출력하는 원리로 동작한다. 만약 바뀐다면 callback function을 새로 생성하고 그 callback function에서 참조하는 값 또한 변경된 새로운 값을 참조한다. 그렇게 ***useCallback***과 ***useMemo***의 변화를 확인해 rendering 최적화를 이뤄낼 수 있다.



## Memoization을 정리하며
Programming의 다양한 분야에서 Memoization 기법이 활용되는 것으로 알고 있다. 가장 가깝게 접했던 것은 **Cache**나 **DP 알고리즘**이고, 머신러닝이나 게임 등에서 주로 사용된다고 한다. 현재는 리액트에서 이를 직접 사용해보고 있는데, 사실 이해하는 것이 쉽지는 않지만, 항상 원리를 조금 더 이해하게 되면 실제로 사용하는 라이브러리에 대한 이해가 편해지는 것을 실제로 느끼게 된다.

아직 최적화를 내가 원하는 대로 구현하기는 힘들지만, 더 정확한 사용을 위해 한 발씩 다가가고 있음을 느끼고 있기에, 현재 프로젝트가 어느정도 완성되면 최적화를 집중적으로 진행해봐야겠다.

## 도움받은 문서

[better-programming](https://medium.com/better-programming/react-memo-vs-memoize-71f85eb4e1a)<br>
[memoize-one](https://miro.medium.com/max/971/1*UrkKxuMn-CmsudYoPhFOcQ.gif)<br>


> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
