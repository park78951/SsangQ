---
title: "Redux를 파헤쳐보자 (삽으로...) 첫 번째"
date: '2019-11-18T13:14:21.000Z'
template: "post"
draft: false
slug: 'react-redux'
category: 'JAVASCRIPT'
tags:
  - 'React'
  - 'Redux'
  - 'Javascript'
  - 'state management'

description: Redux에 대해 배운점을 정리하려한다. Redux를 프로젝트에 적용하려고 하지만 아직 적용 전이다. 일단 학습한 내용을 정리하고 이를 토대로 프로젝트에 대입하며 현재 포스트를 수정해 나갈 계획이다.
---
React Hooks를 사용하면서 state 관리는 useReducer와 ContextAPI를 사용했다. **Redux**, **MobX** 가 가장 뜨거운 state 관리 library라고 하지만, hooks에 내장되어 있는 API를 사용함에 있어 크게 불편하거나 다른 상태관리 library를 사용해야겠다는 필요성을 크게 느끼지는 못했다. 그래도 가장 많이 사용하는 library기도 하고 학습차원에서 어떤 편리함이 있는지, 어떤 차이가 있는지를 학습하고 싶어 가장 사용량이 많은 Redux를 학습했다. 
>> 단순히 '사람들이 많이 쓰니까'라는 이유라기 보다는 사람들이 많이 사용하는데는 그만큼 장점이 많다는 것을 입증하는 것이고 그와 함께 사용할 수 있는 라이브러리가 많고 계속 발전해 나간다는 것을 예상할 수 있다고 생각한다.

## Redux의 특징?
Redux는 Event Sourcing 패턴과 Functional Programming을 결합한 라이브러리 형태라고한다. 
- 간단하게 **Event Sourcing 패턴이 무엇**인지 찾아본 것을 정리하자면 이벤트가 발생할 때마다 결과 값을 통해 지속적으로 상태를 변경하거나 어떤 조작을 하는 것이 아닌, 최종 이벤트 이후 행동이 이뤄지도록 이벤트를 모두 저장한 후 마지막에 한번에 실행함으로써 최종 결과 값만을 얻어내는 방식이다. 예를 들어, 쇼핑 장바구니에서 물건을 추가, 삭제, 새로운 물건을 구매 하는 행위들을 이벤트 발생 시점마다 처리해주는 것이 아니라 이벤트를 저장해 뒀다가 나중에 한번에 처리해서 마지막으로 구매할 물품에 대한 값만 얻어내는 방식이다.

Redux는 3가지의 기본 원칙이 있다고 한다.
1. Single Source of Truth (SSOT) 
   - 모든 state가 단 하나의 store를 통해서 관리된다.
2. Read-only state
   - state를 직접 수정할 수 없다. (Reducer를 사용해서 수정)
3. Changes from pure functions
   - 순수 함수를 통해 수정된다. 기존 값을 변경하는 것이 아닌 새로운 값을 return해야 하는 형식과도 연결성이 있다고 생각.

## Redux의 구조?
Redux는 가장 main이 되는 3가지와 redux의 상태관리를 도와주는 1가지, 총 4가지의 구조로 이뤄져있다고 생각한다.
1. Action: state를 어떻게 변경시킬지 추상화한 표현. 단순 객체로 type 프로퍼티를 꼭 갖고 있어야한다.
2. Reducer: 액션에서 추상화된 로직과 그 type에 따라 이전 state와 action을 parameter로 받은 후 실제 다음 state를 반환하는 함수이다.
3. Store: state를 저장하고 읽을 수 있게 하며 액션을 보내거나 상태의 변화를 감지할 수 있도록 API를 제공.
4. Middleware: Redux의 상태 변화 과정 사이에서 서드파티 확장을 사용할 수 있는 지점을 제공.

![Redux_Process](https://cdn-media-1.freecodecamp.org/images/1*VLQNO9Apn9qfm6BPYXG8TA.png)

## Redux의 사용법 (기본)
Udemy 강좌를 보면서 학습했던 학습 코드를 예시로 간단히 정리해보겠다. 아래 학습 내용은 React Class Component를 사용해 Redux를 사용한 예시이다.

### Action
Action을 예시코드로 확인해보려한다.
```
// Action Creator
export const selectSong = (song) => {
  //.. any logic
  // Return an action
  return {
    type: 'SONG_SELECTED',
    payload: song
  };
};
```

일반적으로 action에서 받는 인자를 payload에 저장하면, payload는 reducer로 전달되어 상태 변경에 영향을 끼친다. payload는 변경된 상태를 저장하는 property 명으로 사용된다. 물론 인자를 받지 않도록 설계될 수도 있고, 직접 payload 값을 설정해 줄 수도 있다. (boolean) 같은 경우.

### Reducer
```
import { combineReducers } from 'redux';

const songsReducer = () => {
  return [
    { title: 'No Scrubs', duration: '4:05' },
    { title: 'Macarena', duration: '2:30' },
    { title: 'All Star', duration: '3:15' },
    { title: 'I Want it That Way', duration: '1:45' },
  ];
};

const selectedSongReducer = (selectedSong=null, action) => {
  switch(action.type) {
    case 'SONG_SELECTED':
      return action.payload;
    default:
      return selectedSong;
  };
};

export default combineReducers({
  songs: songsReducer,
  selectedSong: selectedSongReducer
});
```

첫 번째로 봐야할 점은 Reducer는 두개가 될 수도있고 3개가 될 수도 있지만, 결국 combineReducers를 통해 각각의 객체의 프로퍼티로 저장해 하나로 합친 모습을 볼 수 있다. 이를 통해 Redux 특징인 SSOT 성격을 지키려는 노력을 볼 수 있다. 물론 combineReducer를 사용하지 않고 custom function으로 작성하는 방법도 있겠지만, 편하게 combineReducer 유틸리티를 사용하는 것이 좋을 것으로 생각한다.

두 번째로, 첫번째 `songsReducer`는 단순히 배열 값을 return하는 함수이지만, `selectedSongReducer`는 action의 type에 따른 상태를 변화해 주는 함수이다. 이상하겠지만, `songsReducer`는 단순히 state를 제공해주기만 할 뿐, 변화가 없기 때문에 위와 같이 사용했다고 봐도 무방할 것 같다.

세 번째로, `selectedSongReducer`의 첫 번째 인자인 selectedSong의 경우는 해당 reducer의 state로, 초기 값이 있는 경우 외부에 명확하게 작성 후 변수를 참조하여 사용하기도 한다. 만약 없는 경우 undefeined라고 두면 되지 않을까? 굳이 `default parameter`를 사용할 필요가 있을까 생각하기도 할텐데, 이는 Redux에서 초기 state가 undefined일 경우 오류가 설계된 것 같았고 (직접 사용해본 결과), 값이 없는 경우 반드시 null값으로 설정하도록 권장했다.

### Store
이제 만든 Reducer를 바탕으로 Store를 만들어야한다.

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; 
import { createStore } from 'redux';

import App from './components/App';
import reducers from './reducers';

ReactDOM.render(
  <Provider store={ createStore(reducers) }>
    <App />
  </Provider>, 
  document.querySelector('#root')
);
```

React와 관련된 코드가 많이 섞여있지만, redux와 react-redux와 관련된 두개의 코드를 함께 보면 좋을 것 같다.

먼저, Provider Component의 경우는 react-redux에서 제공하는 API로 context API와 같은 역할을 한다. Component를 감싸 그 Component 포함 하위 Component에게 Store에 접근 할 수 있도록 제공하는 것이다. 이를 통해 하위 Component에서 store라는 props 명으로 접근할 수 있도록 설정했고, 실제로 Store를 만드는 것은 redux에서 제공하는 createStore라는 API에서 제공한다.

createStore는 아래와 같이 이뤄져있다.
```
createStore(reducer, [preloadedState], [enhancer])
```

첫번째 인자로 우리가 combineReducer로 합친 reducer를 import해서 넣어주고, 두 번째 인자부터는 Optional이며 두 번째 인자로 초기 값을 설정해 줄 수가 있다. 만약 없다면 Reducer에서 설정한 기본값이 초기 상태가 된다. 만약 설정 한다면 Reducer와 맞물리도록 같은 Key값을 가져야한다. 세번째 인자로는 Store Enhancer로 말 그대로 스토어에 어떠한 기능을 추가할 때 이를 argument로 넣어주면 된다. 일반적으로 `applyMiddelware()`를 사용해 `redux-thunk`를 사용할 수 있겠다.

### Component에 적용

```
import React from 'react';
import { connect } from 'react-redux';

const SongDetail = ({ song }) => {
  if(!song) {
    return <div>Select a song</div>
  }

  return (
    <div>
      <h3>Details for:</h3>
      <p>
        Title: { song.title }
        <br />
        Duration: { song.duration }
      </p>
    </div>
  );
};

const mapStateToProps = state => {
  return { song: state.selectedSong }
};

export default connect(mapStateToProps)(SongDetail);
```

위의 코드로 Component에 적용한 모습을 확인할 수 있다. 먼저 `connect()()` 함수의 역할과 구조가 굉장히 중요하다고 생각한다. 사용하는 문법은 아래와 같다.

```
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)(component?)
```

위와 같이 커링을 통해 connect 내부에서는 외부함수에서 4가지 parameter를 넘겨주고 내부 함수에 component를 받아 앞의 4가지 인자를 component로 전달해 주는 역할을 한다. 4개의 인자는 모두 optional이며, 아래와 같은 컨벤션을 갖는다.
1. `mapStateToProps?: Function`
2. `mapDispatchToProps?: Function | Object`
3. `mergeProps?: Function`
4. `options?: Object`

#### mapStateToProps
1. 문법
```
mapStateToProps?: (state, ownProps?) => Object

// state: Object
// ownProps?: Object
```

먼저 state는 store에서 받은 state를 의미하고 ownProps는 상위 컴포넌트에서 받은 props를 의미한다. 이를 하나의 props로 전달한다. 아래 사용 예시를 확인하면 이해가 쉽다.

- state를 store에서만 받을 때
```
const mapStateToProps = state => ({ todos: state.todos });
```

- state를 store와 상위 컴포넌트에서 props로 받을 때
```
const mapStateToProps = (state, ownProps) => ({
  todo: state.todos[ownProps.id]
});
```

이런 식으로 조합해서 사용할 수 있다.

#### mapDispatchToProps

이 함수는 특정 이벤트나 어떤 상황에 따라 state를 바꿔주기 위한 함수이다.
자세히 확인하자면, 먼저 문법은 아래와 같다.
```
mapDispatchToProps?: Object | (dispatch, ownProps?) => Object
// dispatch: Function
// ownProps?: Object
```

이 또한 mapStateToProps 처럼 두개의 인자를 받는다. 첫 번째는 store에서 전달 받는 dispatch, 두 번째는 ownProps이다. 일반적으로 dispatch의 인자로 action 함수를 호출해 type과 새로운 state로 전달할 값을 넣어준다. 이를 기억하고 상황에 따라 connect에 전달 방법을 확인해보자.

1. 아무것도 전달하지 않았을 때
```
// do not pass `mapDispatchToProps`
connect()(MyComponent)
connect(mapState)(MyComponent)
connect(
  mapState,
  null,
  mergeProps,
  options
)(MyComponent)
```
단순히 null을 전달하면 default 값으로 dispatch를 전달 받는다. 그러면 아래와 같이 컴포넌트 내에서 dispatch를 사용해 직접 type과 payload를 전달하는 방법이 있다.

[React Redux 예시](https://react-redux.js.org/6.x/using-react-redux/connect-mapdispatch#connect-dispatching-actions-with-mapdispatchtoprops)
```
function Counter({ count, dispatch }) {
  return (
    <div>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>reset</button>
    </div>
  )
}
```

2. connect의 두 번째 인자에 mapDispatchToProps를 전달
일반적으로 action함수를 선언하고 이를 dispatch와 함께 사용한다고 앞서 언급한 바 있다. action 함수와 함께 사용하기 위해서는 mapDispatchToProps에서 dispatch를 받아 action과 결합해야 한다.

```
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' })
  }
}
```

이러면 component에서 직접 props.increment, props.decrement로 접근 할 수 있으며 이를 사용해서 상태를 변경하도록 설정할 수 있다.
만약 ownProps도 인자로 받는다면 아래와 같이 설정할 수 있다.

```
// binds on component re-rendering
<button onClick={() => this.props.toggleTodo(this.props.todoId)} />

// binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => {
  toggleTodo: () => dispatch(toggleTodo(ownProps.todoId))
}
```
코드를 간단히 분석해 보자면, ownProps로 상위 컴포넌트에서 todo ID값을 받아 todo 상태를 변경하는 `toggleTodo` action 함수에 전달해 dispatch에 다시 전달하여 todo 상태를 변경하는 것이라고 볼 수 있겠다.

3. action과 dispatch를 합쳐주는 `bindActionCreators`

위와 같이 일일히 설정해주기가 힘들고, 어차피 action 함수의 함수명을 그대로 사용할 것이라면, bindActionCreators API로 간단하게 mapDispatchToProps를 대체할 수 있다.

```
import { bindActionCreators } from 'redux'

const increment = () => ({ type: 'INCREMENT' })
const decrement = () => ({ type: 'DECREMENT' })
const reset = () => ({ type: 'RESET' })

// binding an action creator
// returns (...args) => dispatch(increment(...args))
const boundIncrement = bindActionCreators(increment, dispatch);

// binding an object full of action creators
const boundActionCreators = bindActionCreators(
  { increment, decrement, reset },
  dispatch
);
// returns
// {
//   increment: (...args) => dispatch(increment(...args)),
//   decrement: (...args) => dispatch(decrement(...args)),
//   reset: (...args) => dispatch(reset(...args)),
// }
```

action이 하나라면 `bindActionCreators` 함수의 인자로 action 함수를 직접 넣으면 되지만, 만약 action 함수가 2개 이상이라면 반드시 객체의 property로 전달해야한다. (`{ increment, decrement, reset }`) 
이렇게 전달하면 가장 마지막에서 볼 수 있 듯 dispatch를 binding하여 객체로 return해준다.

#### mergeProps
세 번째 parameter로 최종 props를 어떻게 정희할 것인지에 대한 부분이다.
만약 아무것도 넣지 않는다면 default로 `{ ...ownProps, ...stateProps, ...dispatchProps }`와 같이 정의한다.
사용 문법은 아래와 같다.
```
mergeProps?: (stateProps, dispatchProps, ownProps) => Object
```

connect 함수를 설명하면서 굉장히 길어졌지만, connect 함수의 설명과 함께 컴포넌트에서 어떻게 사용하는지에 대한 설명이 같이 진행 되었기 때문에 추가적인 컴포넌트 사용설명은 생략하겠다.

이 외에 Middle Ware 사용법이나 Hooks에 적용하는 방법은 추가 포스팅으로 설명하도록 하겠다. 앞서 언급했지만, 아직 React-Redux를 Propject에 적용하면서 다방면으로 사용해 본 것이 아니기에, 잘못된 정보나 오류를 포함한 내용이 있을 수 있다. 앞으로 학습하면서 이를 수정해 나가도록 하겠다.

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
