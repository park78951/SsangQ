---
title: "React 최적화, useMemo, useCallback, React.memo"
date: '2019-10-03T21:12:22.000Z'
template: "post"
draft: false
slug: 'react-memo-useMemo-useCallback'
category: 'JAVASCRIPT'
tags:
  - 'ES6'
  - 'React'
  - 'Hooks'
  - 'Javascript'
  - 'Front-end'
  - 'React Optimization'
  - 'Hooks Optimization'

description: React Todo Web Application을 만들면서 시도해봤던 최적화 중 useMemo와 useCallback, 그리고 그와 비슷한 React.memo에 대한 정리를 하고자한다.
---

React 최적화를 공부하면서 `useMemo, useCallback, React.memo`를 접했다. `useMemo`와 `useCallback`은 실제로 Todo Application에 적용해 봤지만, 일단 최적화 시도를 위한 API 사용을 해본 것일 뿐 정확하게 어떻게 최적화가 되는지에 대해서는 알지 못했다. 이번 기회에 `useMemo`와 `useCallback, React.memo`가 어떻게 최적화가 되는지 학습하여 정리하려고 한다.

## 최적화에 사용되는 Memoization

Memoization이란 ***이전 값을 메모리에 저장해 동일한 계산의 반복을 제거해 빠른 처리를 가능하게 하는 기술*** 이라고 한다. useMemo, useCallback, React.memo는 모두 이 `Memoization`을 기반으로 작동한다. 그럼 이 `Memoization`이 어떻게 사용되는지 확인해보자.

## React.memo

### React.memo의 특징과 사용

```
const Welcome = ({ name }) => {
  return <h1>Hello { name }</h1>;
};

export default React.memo(Welcome);
```

React.memo는 일반적으로 위와 같이 사용되며 직접 함수를 감싸서 사용하기도 한다. React.memo는 Welcome의 결과를 Memoization해서 이후 props가 변경될때까지 현재 memoized된 내용을 그대로 사용하여 리렌더링을 막는다. 이렇게 Memoized된 내용을 재사용하여 렌더링시 가상 DOM에서 달라진 부분을 확인하지 않아 성능상의 이점이 생기게 된다.

React.memo가 props를 비교할 때 얕은 비교를 진행하는데, 얕은 비교란 원시 값의 경우는 같은 값을 갖는지 확인하고 객체나 배열과 같은 참조 값은 같은 주소 값을 갖고 있는지 확인한다.

React.memo 메서드는 `React.memo(component, compFunc)`와 같은 형태가 기본 형태인데, `compFunc` 부분에는 내가 수동으로 비교방식을 수정할 수 있다. 하지만 사용해보지는 않았다.

### React.memo를 언제 써야 할까?
이러한 React 최적화 방식들을 공부하면서 접했던 내용은 React.memo의 내부 동작 원리보다는 무조건 적인 사용을 지양하라는 것이었다. 그 이유는 최적화를 위한 연산이 불필요한 경우엔 비용만 발생시키기 때문이다. React.memo는 다음과 같은 상황에서 사용을 권장한다.

1. Pure Functional Component에서
2. Rendering이 자주일어날 경우
3. re-rendering이 되는 동안에도 계속 같은 props값이 전달될 경우
4. UI element의 양이 많은 컴포넌트의 경우

일반적으로 불필요한 Render가 많이 발생하는 곳에서 사용하라는 말이라고 생각한다. 개인적으로 Todo Web application을 진행하면서 부모 컴포넌트가 rendering될 때마다 변화가 없었던 자식 컴포넌트가 함께 렌더링 되는 경우를 겪은 적이 있는데, 이 때 React.memo를 사용해 rendering을 막은 것을 React dev tool로 확인했던 것이 기억에 남는다.

### React.memo를 사용하지 말아야 할 경우는?

위의 경우를 제외하면 사용하지 않는 것을 권장하지만, 일반적으로 class 기반의 컴포넌트를 래핑하는 것도 적절하지 않은 사용으로 설명된다. 이 경우 memoization을 해야겠다면, PureComponent를 확장하여 사용하거나 `shouldComponentUpdate()`를 사용하길 권장하고있다.

### React.memo의 주의 사항 - 부모가 전달하는 callback 함수

```
function MyApp({ store, cookies }) {
  return (
    <div className="main">
      <header>
        <MemoizedLogout
          username={store.username}
          onLogout={() => cookies.clear()}
        />
      </header>
      {store.content}
    </div>
  );
}
```

위와 같은 MyApp component의 경우 `<MemoizedLogout />`컴포넌트는 onLogout과 username이란 두개의 props를 전달받게 된다. MemoizedLogout이 React.memo로 래핑된 함수 컴포넌트라고 할 때, MyApp이 re-rendering 되더라도 MemoizedLogout에 전달되는 props값이 동일하다면 MemoizedLogout component는 re-rendering을 피할 수 있을까? 정답은 아니라고 한다.

onLogout의 callback 함수는 MyApp이 re-rendring이 될 때마다 새로운 참조값을 갖게 될 것이다. 함수의 내용은 같더라도 참조값이 다르다면 MemoizedLogout은 re-rendering이 발생할 것이고, React.memo는 오히려 memoization에 쓸데없는 메모리만 낭비하는 것이다.
이를 위해 useCallback을 통해 callback 함수를 동일한 callback 인스턴스로 설정한다.
```
const MemoizedLogout = React.memo(Logout);

function MyApp({ store, cookies }) {
  const onLogout = useCallback(() => {
    cookies.clear();
  }, []);
// ...
```
항상 같은 함수 인스턴스를 반환하기 때문에 MemoizedLogout의 React.memo가 정상 기능을 수행한다.

## useMemo & useCallback

**useMemo**는? 사용방법을 제외하고는 React.memo와 매우 흡사하다. React.memo가 component의 결과 값을 memoized하여 불필요한 re-rendering을 관리한다면, useMemo는 함수의 결과 값을 memoized하여 불필요한 연산을 관리한다. 아래 코드를 보자.

```
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedValue = useCallback(computeExpensiveValue(a, b), [a, b]); // 위와 동일
```

useMemo의 특징은 일단 함수 호출 이후의 return 값이 memoized되며, 두 번째 파라미터인 배열의 요소가 변경될 때마다 첫 번째 파라미터의 callback 함수를 다시 생성하는 방식이다. useCallback을 사용해도 useMemo의 대체형태로 사용 할 수 있다고 하는데, useCallback은 아래에서 정리하겠다.

**useCallback**은 useMemo와 흡사하지만, 일반적으로 함수를 memoized하며, 아래와 같이 사용된다.
```
const handleChange = useCallback(e => {
    setNum(e.target.value);
  }, []);
```
useCallback을 통해 memoized된 함수는 예를 들어 event handler로 사용되며, 마찬가지로 2번째 인자인 배열의 요소가 변경될 때마다 새로운 함수가 다시 생성된다.

### useCallback의 예시

*useCallback 사용 전*
```
function CountButton({ onClick, count }) {
  return <button onClick={onClick}>{count}</button>;
}
function DualCounter() {
  const [count1, setCount1] = React.useState(0);
  const increment1 = () => setCount1(c => c + 1);
  const [count2, setCount2] = React.useState(0);
  const increment2 = () => setCount2(c => c + 1);
  return (
    <>
      <CountButton count={count1} onClick={increment1} />
      <CountButton count={count2} onClick={increment2} />
    </>
  );
}
```

*useCallback 사용 후*
```
const CountButton = React.memo(function CountButton({ onClick, count }) {
  return <button onClick={onClick}>{count}</button>;
});
function DualCounter() {
  const [count1, setCount1] = React.useState(0);
  const increment1 = React.useCallback(() => setCount1(c => c + 1), []);
  const [count2, setCount2] = React.useState(0);
  const increment2 = React.useCallback(() => setCount2(c => c + 1), []);
  return (
    <>
      <CountButton count={count1} onClick={increment1} /> // React.memo로 래핑되었다는 가정
      <CountButton count={count2} onClick={increment2} /> // React.memo로 래핑되었다는 가정
    </>
  );
}
```
state count1이 변경되었을 때, state 변경이 없었던 count2를 참조하는 CountButton 컴포넌트는 리렌더리 되지 않아야 한다. *만약 increment2 함수에 useCallback이 없었다면*, DualCounter 컴포넌트는 state의 변경으로 인해 re-rendering 될 것이고, increment1과 increment2 함수 모두 새로 생성되어 2개의 CountButton 컴포넌트는 모두 re-rendering 될 것이다. 하지만 increment1, increment2 함수에 useCallback을 사용함으로써 두개의 함수는 재 생성이 되지 않고 (2번째 파라미터인 배열에 아무것도 없을 경우 재 생성되지 않음) 변경된 count1을 참조하는 CountButton만 re-rendering 되게 된다.

## 최적화에 대한 생각
실제로 React Dev Tools를 통해 불필요한 re-rendering을 막는 것을 보니 굉장히 유용한 API라는 생각과 함께 적극적으로 사용해야겠다고 생각한다. 하지만, 아직 React에 대한 숙련도가 높지 않은 만큼 높은 레벨의 기술일 수록 더욱 신중하고 조심히 써야한다고 생각한다. 위에 정리했던 대로 최적화를 위한 코드가 잘못 사용되면 부담을 가중시키는 코드로 변질될 수 있으니, 앞으로 원리를 더 이해하고 경험을 쌓아가며 좋은 코드를 작성하기 위한 고민을 해야겠다.

## 도움받은 블로그

[TOAST UI](https://ui.toast.com/weekly-pick/ko_20190731/)  
[Kent C. Dodds](https://kentcdodds.com/blog/usememo-and-usecallback)  

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
