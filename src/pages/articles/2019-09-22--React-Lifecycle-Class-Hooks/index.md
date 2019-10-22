---
title: React, Class 기반과 Hoooks의 Lifecycle
date: '2019-09-22T16:12:22.000Z'
layout: post
draft: false
path: '/posts/react-lifecycle/'
category: 'JAVASCRIPT'
tags:
  - 'ES6'
  - 'React'
  - 'Hooks'
  - 'Javascript'
  - 'Front-end'
  - 'React Lifecycle'
  - 'Hooks Lifecylcle'

description: React로 프로젝트를 끝낸 시점에, 아직도 Class와 Hooks의 Lifecycle과 그 관리에 사용되는 메서드에 대해 명확하게 알지 못한다. 다시 한 번 정리하면서 Lifecycle이 어떻게 이뤄지고 그 순서가 어떻게 되는지에 대해 공부하고자 한다.
---

리액트를 공부하면서, 웹을 막 접했던 시절 진입장벽이 거의 만리장성 수준이라고 느끼게 해준 용어가 바로 Lifecycle 이었다. 물론 React 의 구조나 작동에 대해 이해도하지 못한채 Lifecycle 이란 벽을 만나 끝내 오르지 못하고 다음을 기약했지만, 이제는 그 벽을 조금은 오를 수 있는 준비가 되었다. 하나씩 정리하면서 부족한 부분을 조금 더 채우고자 한다.

# Class based React.

![React-Lifecycle2](https://user-images.githubusercontent.com/37759759/65383863-16be3180-dd56-11e9-9771-46a40ba34569.png)

위의 그림과 같이 모든 Component 는 크게 `Mounting(생성) - Updating(업데이트) - Unmounting(제거)` 단계를 거친다고 한다. 각가의 단계에서는 또 세분한 cycle 이 존재하는데, 이를 하나씩 짚어보면

## Mounting (componentWillMount 까지의 단계는 생략 - deprecated)

처음 `Mounting`된 시점에서 `render()`를 통해 컴포넌트가 DOM 에 붙게 된다. `render()` 함수는 `Pure functions`이기 때문에 어떤 사이드 작업이 이뤄져선 안되며, `setState()`와 같은 state 변경 작업을 render 함수 안에서 해서는 안된다.

`render()`함수가 실행되면 `componentDidMount()`가 실행되며 `Mouting` 작업이 종료되는데, `componentDidMount()`는 `setstate()`의 사용이 가능하며 dom 에 부착과 동시에 실행되기 때문에 state 변경작업이 이뤄질 경우 rendering 이 다시 일어나지만 UI 의 변화가 사용자에게 보이진 않는다. **다시 말하자면, render 가 두 번 일어나지만 화면에는 한 번의 출력만 나타난다는 것이다.** 하지만 rendering 작업이 두 번 이뤄지면 성능상의 문제가 나타나기 때문에, 일반적으로 특별한 케이스인 API 호출이나 component 의 render 작업에 영향이 없어 re-rendring 이 이뤄지지 않는 작업에 사용이 권장된다고 한다.

일반적으로 state 가 변경되는 작업을 할 경우엔 애초에 `constructor`에 선언하는 것이 권장된다고 한다.

## Updating

Props 나 state 의 변화는 `Updating` 작업을 발생시킨다. `updating` 주기에서의 `render()` 작업이 발생하기 직전 `shouldComponentUpdate()`가 실행된다. `shouldComponentUpdate()`또한 특별한 상황에서만 주로 사용되는데, 그 상황이 바로 **불필요한 render 작업의 취소**이다. redner 를 하기 전이기 때문에 불필요한 render 를 사전에 막을 수 있고 `return false`를 통해 취소할 수 있다. 그렇기 때문에 `shouldComponentUpdate()` 내부에서 state 를 변경하는 일을 해선 안된다고 한다.

이후 `render()`가 실행되 업데이트 작업이 완료되면 마지막으로 `componentDidUpdate()`가 실행된다. 이 작업에서는 `setState()`를 사용해 state 를 변경할 수 있지만, 부적절한 사용은 무한 루프를 야기하기 때문에 필요한 경우에 사용해야한다.

`shouldComponentUpdate()`는 첫번째 인자로 바뀔 state 를 받지만, `componentDidUpdate()`는 첫번째 인자로 바뀌기 전 state 를 받고 있다. 이는 서로 호출 단계가 render 이전과 이후이기 때문이다.

## Unmounting

component 제거에서 사용되는 메서드는 `componenetWillUnmount()`이다. 일반적으로 연결했던 이벤트 리스너를 제거하거나 clear timers or caches, cancelling API 등의 정리 활동을 한다고 한다. 아직 사용해보지는 않았다.

# React Hooks

기존 `Functional Component`에서는 Lifecylcle API 를 사용할 수 없었지만, Hook 이 추가되면서 그 일이 가능하게 되었다. Hooks 를 사용한 뒤 class component 의 Lifecycle 을 보고 느꼈지만, `componentDidMount()`처럼 (비록 componentDidMount 는 1 회성이지만) `render()`실행 뒤에 state 의 변경을 감지하여 어떤 작업이 이뤄지는 그런 lifecycle 작업이 없어 이상하다는 생각을 했었다. Hooks API 인 `useEffect()`는 그 부분을 채워주었다.

## useEffect

`useEffect(()=>{funcs},[state])`는 paint 작업까지 완료된 DOM update 이후 callback 함수안에 실행할 함수를 기억했다가 state 변경시마다 기억하는 함수를 호출하는 방식으로 작동한다. useEffect 는 Browser 의 작업을 방해하지 않는 방식으로 이뤄졌기 때문에 훨씬 부드럽게 작동하는 느낌을 받을 수 있다고 한다. 아직까지 크게 느낀적은 없지만...

useEffect 의 두번째인자 `[state]` 부분에는 `복수의 state => [state1, state2..]`를 쓸수도 있고 아무것도 안쓸 수도 있고 state 없이 `[]`만 쓸 수도 있다. 아무것도 안 쓸 경우엔 모든 render 이후 내부에 작성한 함수가 실행되지만, `[]` 빈 배열만 넣은 경우엔 최초 render 이후 한 번만 실행된다고 한다. (`componentDidMount()`와 비슷) 복수의 state 를 넣은 경우엔 기존과 같이 해당 state 변경시마다 render 이후 함수가 호출된다.

## useEffect with Cleanup

class component 의 설명에서 clean up 기능을 했던 `componenetWillUnmount()`와 비슷하게 unmount 시 작동하는 방식이 있다. 바로 useEffect 내부 콜백함수에 `return () => {funcs}`처럼 제거할 함수를 쓴 callback 함수를 return 하는 것이다.

![Hooks-cleanup](https://user-images.githubusercontent.com/37759759/65386733-67e01c80-dd7a-11e9-83a8-90f16eb16515.JPG)
![Hooks-cleanup(2)](https://user-images.githubusercontent.com/37759759/65386757-7e867380-dd7a-11e9-90c9-4a5a85f83e3d.JPG)
[출처](https://ko.reactjs.org/docs/hooks-effect.html)

위의 채팅 관련 서비스에서 subscribe 과 unsubscribe 을 통해 clean-up 으로 커넥션을 지웠다가 다시 생성하는 과정을 useEffect 의 return 을 통해 통해 이루는 것을 볼 수 있다. 언젠가는 쓸 일이 있을 것라고 생각한다.

## useEffect 의 좋은점

lifecycle 에 대한 learning curve 를 크게 줄여준 것 같다. `componentDidMount()`와 render 이후 state 관리에 따른 re-render 작업을 한번에 해결해주고, 코드의 복잡도나 가독성 면에서도 크게 좋아진 것 같아서 좋다. 사실 clean-up 기능을 사용해본적도 없고 아직은 더 시간이 필요하겠지만, 그럼에도 useEffect 가 state 변경을 감시할 수 있는 효율적인 수단이라고 생각한다.

# 도움받은 블로그

[ProgrammingWithMosh](https://programmingwithmosh.com/javascript/react-lifecycle-methods/)  
[React 공식문서](https://ko.reactjs.org/docs/hooks-effect.html)
___

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
