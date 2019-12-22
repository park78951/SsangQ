---
title: 'Redux Saga에 대한 간단한 생각과 API 정리'
date: '2019-12-19T23:10:33.000Z'
template: 'post'
draft: false
slug: 'redux-saga'
category: 'JAVASCRIPT'
tags:
  - 'React'
  - 'javascript'
  - 'frontend'
  - 'Redux'
  - 'Redux-Saga'
  - 'generator'

description: Redux Saga를 사용하면서 궁금했던 점, 사용하면서 정리할 필요성을 느꼈던 기능 등을 찾아보며 여기에 정리하려고 한다.
---

## Redux Saga 입문
드디어 Redux Saga를 사용해봤다. 여전히 조금이나마 내가 사용하는 라이브러리가 어떻게 작동하는지, 어떤 원리를 사용하는지 등을 알아보고 싶지만, 이제는 먼저 사용법을 익히고 실제로 사용해보면서 점차 깊이있게 들어가는 것이 나에게 더 맞는 방법이라고 생각해 바꿔보기로 했다. Saga를 사용하면서 느꼈던 점은 처음 사용해본 Generator가 어떤 방식으로 사용되는지를 알 수 있었고, Saga를 통한 비동기 처리가 Thunk를 사용했던 것 보다 훨씩 직관적이고 가독성이 좋다고 느꼈다. Thunk는 dispatch에 thunk 함수를 사용해 함수 내부에 비동기 처리 및 그 이후 또는 함께 실행되어야 할 action들을 dispatch하며 조금은 장황하게 (개인적인 의견) 작성해야 했다면, saga는 `effect`의 함수들을 통해 비동기 처리나 또 다른 action들의 작업을 동기적 순서로 가독성 좋게 작성할 수 있다고 생각한다. 뭔가 지켜보고 있다가 어떤 action 작업 명령이 떨어지면 그와 관련된 다른 action들이 일사분란하게 dispatch 되는 느낌이랄까?

## Redux Saga?
![Saga_Working_Flow](https://image.toast.com/aaaadh/real/2017/techblog/3%282%29.png)
출처: [Toast Meetup 블로그](https://meetup.toast.com/posts/136)

Redux Saga에 대해 이리저리 찾아보면서 Redux-Saga의 목적을 명확하게 알 수 있었다.
> **redux-saga is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage**, more efficient to execute, simple to test, and better at handling failures.
> redux-saga는 어플리케이션의 **사이드 이펙트**인 데이터 Fetch와 같은 비동기 처리나 브라우저 캐시에 접근하는 순수하지 않은 작업 등을 더욱 쉽게 관리하게 해준다. ...

Redux-saga의 목적을 정확하게 느꼈던 것은 아니지만, 사용하면서 이런 점이 편리하다라고 느낀 부분과 상당히 일치한다고 느꼈다. 사이드 이펙트란 무엇인가에 대한 내용 또한 [Toast Meetup 블로그](https://meetup.toast.com/posts/136) 여기를 통해 어느 정도 개념을 잡을 수 있었다. 궁금하다면 확인해 보면 이해에 큰 도움이 될 것이다.

## Redux Saga를 통해 알게된 Generator의 사용 방식
Redux Saga를 공부하면서 Generator 함수가 어떻게 사용되는지 알게 된 부분이 있는데, 이 것을 꼭 정리해 두고 싶었다.

```javascript
function* loginFlow() {
  while (true) {
    yield take('LOGIN')
    // ... perform the login logic
    yield take('LOGOUT')
    // ... perform the logout logic
  }
}
```
일단 take에 대해서는 이후에 알아보기로 하겠다. 실제로 `takeEvery`라는 API에서 사용되는 방식이다. 해당 함수를 보면 while의 무한루프에 빠질 것만 같이 생겼다. 하지만 Generator 함수의 특성으로 무한루프에 빠지지 않는다. while을 씀으로써 fetch 요청이 한 번 이뤄진 후 함수가 종료될 것을 반복적으로 사용할 수 있다는 것이다. Generator 함수의 비동기 처리 사용 방식을 얕게나마 이렇게 접하게 된 것도 굉장히 도움이 되었다.

## Redux Saga에서 사용하는 다양한 effects API
Redux-Saga에서 사용하는 다양한 API를 간단하게 한 번 정리해보려고 한다. 일반적으로 특정 action을 감시하다가 호출 된 이후 추가 작업이 이뤄지는 경우가 많아 saga의 함수명 중 watch로 시작하는 함수가 많다. 또한 Generator 함수의 특성으로 다음 작업으로 넘어가기 위해서는 yield를 만난 이후 `next()`를 호출해줘야하므로 node의 미들웨어처럼 이 작업 또한 처리해주는 것 같다.

### take
실제로 take는 사용해 본 적은 없지만, **감시**의 역할을 한다고 한다. 아래 코드를 보면,
```javascript
function* watchOrderRequest() {
    const action = yield take('REQUEST_ORDER');
    const result = yield call(Api.requestOrder, action.orderId);
    // ... process ...
}
```
`REQUEST_ORDER`라는 action이 호출 되면, `take`가 이를 캐치하여 다음 API인 `call` 함수까지 호출되도록 `next()` 작업을 진행해 준다. 

### put
`put`은 dispatch와 같다고 봐도 될 것 같다. 특정 작업 이후에 `put({ type: SOMETHING, payload: SOMETHING })`과 같은 구조로 reducer로 전달해준다. 일반적으로 특정 작업 또는 비동기 처리 이후 결과 값을 넣어준다.
```javascript
const result = yield call(loadCommentsAPI, action.data);
yield put({
  type: LOAD_COMMENTS_SUCCESS,
  data: {
    postId: action.data,
    comments: result.data,
  },
});
```

### call
위의 `call`은 사가 함수 안의 로직이 동기적으로 처리되도록 도와주는 API이다. 위의 함수를 그대로 다시 보자. `await`와 같은 역할을 해준다. 그리고 첫 번째 인자로 특정 작업이 수행되는 함수가 들어가고 두 번째 인자 부터는 첫 번째 인자의 함수에 넣어 줄 인자들이 사용되게 된다. 아래 예시 코드를 보기 전에 먼저 정리하자면, `call(fn, ...args)` 와 같은 문법을 갖고 있고 내부적으로는 `fn(...args)` 로 실행된다.
```javascript
const result = yield call(loadCommentsAPI, action.data);
yield put({
  type: LOAD_COMMENTS_SUCCESS,
  data: {
    postId: action.data,
    comments: result.data,
  },
});
```

`call` 함수의 결과값이(성공이던 실패던) result에 저장되어야 다음 `put` 함수를 호출할 수 있다. 굉장히 비슷한 함수이지만 완전히 다른 역할을 수행하는 `fork` 함수도 있다.

### fork
`fork`는 call과 반대로 비동기적으로 처리될 수 있도록 도와준다. 다수의 `eventListener`를 실행한다고 해도 실행 순서대로 동작하는 것이 아닌, 특정 이벤트가 발생했을 때만 실행된다. `fork`도 마찬가지로 차례대로 처리되는 것이 아니고 함수의 인자로 전달한 특정 함수가 특정 조건을 만족했을 때 실행되게 된다. 아래 예시 코드를 보면
```javascript
export default function* sagaFunc() {
  yield all([
    fork(watchSometing),
    fork(watchSomeWork),
    // ..
  ]);
}

function* watchSometing() {
  yield takeLatest(DO_TASK, taskFunc); 
  // DO_TASK는 action type, taskFunc는 특정 로직을 포함한 함수이다.
}
```
실제 `fork`가 2개보다 많게 실행되었다고 가정해도 watchSomething watchSomeWork 함수의 특정 조건이 만족해야 실행되게 되어있다. 이제 위의 코드를 보면 `all`과 `takeLatest` 또한 궁금하게 되는데 차근차근 정리해보겠다.

### takeLatest
`takeLatest`는 위와 같이 첫 번째 인자로 action type, 두 번째로는 실제 실행될 함수를 넣어준다. `takeLatest`는 action type이 dispatch되기까지 감시하다가 action type이 dispatch되면 캐치하여 두 번째 인자로 넣어준 함수를 실행한다. 코드 예시를 보면
```javascript
function* watchSometing() {
  yield takeLatest(DO_TASK, taskFunc); 
  // DO_TASK는 action type, taskFunc는 특정 로직을 포함한 함수이다.
}
```
위의 함수에서 `DO_TASK`가 실행되면 `taskFunc`을 실행하는 순서다.

`takeLatest`의 가장 중요한 특징이 있는데, 그건 바로 debounce 역할이다. 특정 action이 여러번 실행된다 해도 마지막 한 번의 작업만 이뤄지도록 설계되어있다. 비동기 처리 또한 마지막 한 번의 작업만 이뤄진다. takeLatest가 비동기 요청 후 비동기 처리가 끝나기 전에 action이 다시 일어나면 pending 상태의 작업을 취소하는 방식으로 동작한다. 이와 비슷하게 `throttle` API로 throttle 작업을 수행할 수도 있다.

### takeEvery
사용법은 위의 takeLatest와 같다. 하지만, `takeEvery`는 debounce를 지원하지 않는다는 차이만 있다.

### all
`all`은 위의 fork에서 볼 수 있듯, 많은 함수를 한 번에 호출할 수 있도록 도와주는 API이다.

## 일반적인 사용 예제
아래 코드는 강의 내용 중 saga 작업에 활용되는 모든 함수를 모아 놓은 것이다.

```javascript
function postsAPI(id) {
  return axios.get(`/user/${id}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(postsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

export default function* postSaga() {
  yield all([
    // ..
    fork(watchLoadUserPosts),
    // ..
  ]);
}

// sgag/index.js
export default function* rootSaga() {
  yield all([
    // ..
    fork(post),
    // ..
  ]);
}

// store 부분
const sagaMiddleware = createSagaMiddelware();
```
가장 밑에서 부터 sagaMiddleware를 create하고, rootSaga를 통해 나뉘어진 사가를 fork 함수로 실행하고, post Saga에서 all 함수를 통해 실행된 모든 fork 함수를 지켜보면서 특정 action이 dispatch 되면 특정 로직이 수행되는 방식이다. 처음에는 조금 어렵고 익숙하지 않아 생소하지만, 가장 밑에서부터 위로 올라가며 로직을 그려보면 이해가 쉽다.


## 도움받은 문서

블로그: [Toast Meetup](https://meetup.toast.com/posts/136) </br>
공식 Document: [Redux Saga Docs](https://redux-saga.js.org/docs/api/)

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
