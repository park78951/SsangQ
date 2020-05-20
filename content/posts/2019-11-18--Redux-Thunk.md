---
title: "Redux를 파헤쳐보자 (삽으로...) 두 번째"
date: '2019-11-18T16:24:21.000Z'
template: "post"
draft: false
slug: 'react-redux-thunk'
category: 'JAVASCRIPT'
tags:
  - 'React'
  - 'Redux'
  - 'redux-thunk'
  - 'redux asynchronous'
  - 'Javascript'
  - 'state management'

description: Redux에 대해 배운점을 정리하려한다. Redux를 프로젝트에 적용하려고 하지만 아직 적용 전이다. 일단 학습한 내용을 정리하고 이를 토대로 프로젝트에 대입하며 현재 포스트를 수정해 나갈 계획이다. 이번에는 앞의 내용에 추가하여 redux-thunk를 정리하겠다.
---



Redux Thunk `redux-thunk`는 Redux의 미들웨어이며, 비동기를 처리하기 위해 사용한다고 한다. redux-thunk를 사용하기 전에 action 함수를 통해 비동기 처리를 하는 것이 어떤 문제가 발생하는지 확인하도록 하겠다.

## 문제상황 - state가 data를 읽지 못한다.

아래와 같이 action함수에서 비동기 처리를 하면 어떤 일이 발생할까?

```javascript
export const fetchPosts = async () => {
  // Bad approach!!!
  const response = await jsonPlaceholder.get('/posts');

  return {
    type: 'FETCH_POSTS',
    payload: response
  };
};
```

일반적으로는 `async` 안에서 `await` 를 통해 제대로 값을 전달 받아 payload의 value로 전달해 완벽한 객체를 전달 할 것이라고 생각한다. 하지만 해당 action으로 dispatch를 진행했을 때 화면은 아래와 같다.

![redux 캡쳐](https://user-images.githubusercontent.com/37759759/69032591-3e610b80-0a20-11ea-9b28-4c71543e800a.JPG)

처음에는 내가 return하는 것이 object인데... 대체 뭐지? 라고 생각했다. 아무리 봐도 제대로 준 것이 맞다. 특히 `await` 는 비동기에서 다음 작업이 진행될 동안 기다려주는 함수가 아닌가? Udemy에서 학습하면서 이에 대한 원인을 알 수 있었다. 아래 코드는 [babelio](https://babeljs.io/)을 통해 찾아낸 위의 fetchPosts 함수의 polyfill을 이해하기 쉽게 재 해석한 것이다.

```javascript
// 아래 처럼 async await는 본래 fetch로 가져온 데이터를 먼저 리턴하고 
//이후 본래 우리가 리턴하려던 값을 주기때문에 원하는 작동이 안된다.
export const fetchPosts = async () => {
  switch(somthing) {
    case 0:
      return jsonPlaceholder.get('/posts');

    case 1:
        return {
          type: 'FETCH_POSTS',
          payload: response
        };
  };
};
```
위에서 볼 수 있 듯 `await` 부분인 jsonPlaceholder.get('/posts)를 먼저 return한다. return한 내용은 object가 아닌 특정 값이 먼저 return 될 것이다. 그리고 나서 `async` 함수는 의도했던 객체를 return 하려 하지만, 이미 처음 return한 내용으로 인해 오류가 발생하게 된다. 그렇기 때문에 `redux-thunk`를 사용해 dispatch를 action의 내부에서 받아 사용하도록 한다.

- Action (Thunk 함수)
```javascript
import jsonPlaceholder from '../apis/jsonPlaceholder';
// import action 으로 action 함수를 바다왔을 때

export const fetchPosts = () => async dispatch => {
  const response = await jsonPlaceholder.get('/posts');

  dispatch({ type: 'FETCH_POSTS', payload: response })
  // dispatch(action()) 이렇게도 사용하지만, 그냥 dispatch의 인자에 객체를 넣어 줘도 괜찮다.
};
```

- Action을 사용하는 Component
```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions';

class PostList extends Component {
  componentDidMount() {
    this.props.fetchPosts();
  };

  render() {
    console.log(this.props.posts);
    return (
      <div>
        Post List
      </div>
    );
  };
};

const mapStateToProps = (state) => {
  return { posts: state.posts };
}

export default connect(
  mapStateToProps, 
  { fetchPosts }
  )(PostList);
```

- Root
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.querySelector('#root')
);
```

먼저 `Root`의 코드를 보면 createStore로 store를 만들 때 두번째 인자(여기서는 preloadedState 부분이 아닌 **enhancer**부분)에 `applyMiddleware()`를 넣어주고 적용할 미들웨어인 react-thunk를 인자로 넣어 주었다. Action 부분은 type과 payload 값을 담은 객체를 return 하는 것이 아닌, dispatch를 실행해 직접 상태 변경을 진행 하고 있다. 이후 component에서는 단순히 기존 사용하던 방식과 같이 호출하여 사용한다.

Redux Middleware와 관련된 API 및 library의 내부 동작 원리를 설명하려면 공부가 더욱 필요한 것 같다. 함수형 프로그래밍 기반의 코드이기 때문에 아직은 이해가 부족하기 때문에 더 학습 한 뒤에 따로 포스팅해야겠다.

그리고 위의 코드 또한 하나의 사용 예시일 뿐 다양한 방법으로 사용할 수 있는 것 같다. 앞으로 경험해보지 못한 부분에 대해서는 다양한 코드를 리뷰해보며 사용법을 익히도록 해야겠다.

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
