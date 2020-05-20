---
title: 'Next.js의 getInitialProps lifecycle, TIL'
date: '2020-02-18T15:47:32.000Z'
template: 'post'
draft: false
slug: 'nextjs-getinitialprops'
category: 'JAVASCRIPT'
tags:
  - 'React'
  - 'Hooks'
  - 'javascript'
  - 'frontend'
  - 'Next'
  - 'Next.js'
  - 'SSR'
  - 'getInitialProps'

description: Next.js를 사용하면서 어려웠던 부분 중 하나인 getInitialProps에 대해 정리하고자 한다. 
---

## Server Side Rendering을 가능하게 하는 getInitialProps

일반적으로 Frontend단의 Sever Side Rendering(이하 SSR)에서 중요한 것 중 하나는 초기 state를 가진 완성된 view를 rendering하는 것이라고 생각한다. 하지만 완성된 view를 만들기 위해서는 redux나 mobx, 또는 cotnext API 등을 사용한 store에서 해당 state를 받아와야 하고, 해당 state를 업데이트하기 위해 rendering 이후 `componentDidMount` 또는 `useEffect`를 통한 re-rendering 작업 이후 초기 값을 setting해 줬다. 하지만 SSR은 re-rendering이 아닌, 완성된 html을 한 번 rendering하는 것이 목적이다. 이 것을 가능하게 해주는 것이 getIntitialProps이다.

## getInitialProps의 LifeCycle

getInitialProps는 서버(Nodejs환경)와 클라이언트(Browser)에서 모두 호출되지만, 한 번에 호출되지는 않는다. 다시말해, route로 접근할 때 새로고침이나 직접 URL을 입력하는 방식의 Server Side Rendering으로 접근하면 서버에서, Next.js에서 제공하는 `Link` 컴포넌트를 통해 접근한다면 클라이언트에서 호출된다.

이러한 특징 때문에 getInitialProps는 page directory 안에 선언한 컴포넌트에서 호출해야한다. 해당 컴포넌트들의 자식 컴포넌트에서는 사용할 수 없다.

## getInitialProps의 Work Flow
getInitialProps의 Work Flow는 아래와 같다. 아래의 설명에는 redux를 사용한 상태관리나 초기 data fetching을 함께 정리하고자 한다.

1. 초기 웹 앱 또는 새로고침이나 URL을 직접 입력하여 웹 앱에 접근한다.
2. page directory의 _app.js 컴포넌트의 getInitialProps가 실행된다. 모든 page에서 공통적으루 우선 실행되는 것이 _app.js이므로 _app.js의 getInitialProps 또한 먼저 실행된다.
```javascript
_app.getInitialProps = async context => { // _app은 _app.js에 선언한 compnent 명
  const { ctx, Component} = context;
  let pageProps = {};
  if(Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx) || {};
  }
  return { pageProps };
};
```
   1. 위의 context의 Coponent property에서 앞으로 rendering할 page component의 getIntialProps를 실행한다.
   2. 해당 getInitialProps가 실행되고 return 값을 pageProps에 할당한다.
   3. 값을 return하지 않아도 withRedux나 withReduxSaga를 통해 page component에서 store의 dispatch에 접근이 가능하다. 이를 통해 axios 등의 data fetch library / API를 사용해 초기 데이터를 받아와 store에 저장이 가능하다. <br>
   (일반적으로 서버와 broswer 모두에서 실행되므로 양쪽에서 호환이 되는 `axios`나 `isomorphic-unfetch`를 많이 사용한다.)
   4. return 값이 있으면 초기 props 값으로 전달한다.
3. getInitialProps의 실행이 완료되면 서버에서 state를 포함한 markup 정보를 클라이언트로 전달한다.
4. Browser에서 html을 파싱하여 rendering한다.

여기서 중요한 것은 Redux의 동작이다. Server Side에서 생성한 store가 그대로 Client로 전달되는 것이 아니다. Client Side에서는 Redux Store가 새롭게 생성되고 서버로 부터 받은 state를 바탕으로 초기화가 이뤄지는 것이다. 이를 next-redux-wrapper의 withRedux가 가능하게 해주는 것이다.

Redux 공식 Document에 따르면 아래와 같이 설명되어 있다.
>> On the client side, a new Redux store will be created and initialized with the state provided from the server. Redux's only job on the server side is to provide the initial state of our app.
>> 클라이언트단에서 새로운 Redux Store가 생성되고 서버로부터 전달 받은 state를 통해 초기화 될 것이다. 서버단에서의 Redux 역할은 단순히 우리 App의 초기 state를 제공하는 것이다.

이 부분은 나 또한 아직도 공부가 더 필요한 부분이기 때문에 부족한 부분은 아래의 페이지에서 확인이 가능하다.

[Redux On the Server](https://redux.js.org/recipes/server-rendering/#redux-on-the-server)<br>
[Dev](https://dev.to/waqasabbasi/server-side-rendered-app-with-next-js-react-and-redux-38gf)

## 삽질로 얻은 getInitialProps에 대한 이해
사실 getInitialProps를 공부하고 사용하면서 정확한 내부 동작 및 원리를 습득하지는 못했지만, 사용하는데 필요한 최소한의 work flow를 익히고자 노력했고 실제로 다양한 삽질과 여러번의 구글링으로 어느정도 개념을 익힐 수 있었다. 실제로 getInitialProps의 work flow를 이해하기 위해서는 SPA의 SSR 동작 원리도 이해해야 했었고, 이번 프로젝트로 처음 접하면서 연관된 다양한 부분을 이해하기 위해 시간을 투자할 수 밖에 없었다. 하지만 투자에 대한 return은 확실히 가치있다고 생각한다. 서버에 대한 이해도 더욱 잘 할 수 있었고, 전통적인 방식과 SPA 방식의 SSR의 차이도 함께 이해하며 내공이 다져진 느낌이다. 다음 포스트에서는 SPA 방식의 SSR도 간단하게 정리해보려고 한다.

## 도움받은 문서

[Next.js](https://nextjs.org/docs/api-reference/data-fetching/getInitialProps)<br>
[min9nim님 블로그](https://min9nim.github.io/2018/11/nextjs-getInitialProps/)<br>
[Redux On the Server](https://redux.js.org/recipes/server-rendering/#redux-on-the-server)<br>
[Dev](https://dev.to/waqasabbasi/server-side-rendered-app-with-next-js-react-and-redux-38gf)<br>


> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
