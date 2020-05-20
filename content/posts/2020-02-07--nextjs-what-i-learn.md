---
title: 'Next.js를 사용하면서 알게된 점, TIL'
date: '2020-02-07T18:47:32.000Z'
template: 'post'
draft: false
slug: 'nextjs-what-i-learn'
category: 'JAVASCRIPT'
tags:
  - 'React'
  - 'Hooks'
  - 'javascript'
  - 'frontend'
  - 'Next'
  - 'Next.js'
  - 'SSR'


description: 프로젝트를 진행하면서 가장 거슬렸던 부분은 바로 페이지 새로고침 및 페이지 URL로의 직접 방문시 동작하지 않았던 CSR의 한계였다. SSR로 Refactoring해야 할 시기인지 계속 고민했지만, 거슬리는 부분은 바로잡고 가는 것이 좋다고 생각했고 무엇보다 추후 SEO와 관련하여 SSR을 도입하려고 했기에 Next.js를 도입하면서 배운 점을 정리하려 한다.
---

## Next.js란 무엇이고 왜 나왔을까?
Next.js는 간단하게 말하면 React의 Server Side Rendering(이하 SSR)을 쉽게 하기 위한 React Framework이다. 일반적으로 React에서 SSR을 적용하기 위해서는 서버에 `ReactDOMServer` API와 그 내부 API를 사용한 Rendering 설정뿐만 아니라, Webpack 및 Babel 설정, 그에 수반되는 여러가지 설정들을 해줘야 하지만, Next.js는 모든 것을 Framework에서 처리해주고 설정해주기 때문에 편리하게 사용할 수 있다고 한다. (물론 사용법을 익히면 편하겠지만, 다른 사람이 만든 Framework 내부의 API를 익히는 것, 그리고 API의 의도 및 원리를 이해하는 것이 쉽지는 않기 때문에 무조건 Next.js를 사용하는 것이 쉽다라고 대답하기는 힘들다. 물론 내가 원하는대로 Customizing 하기 위해서는 Next.js를 사용하기 보다는 `ReactDOMServer`를 사용하는 것이 더욱 좋다고 생각한다.)

[Next.js](https://nextjs.org/)에서는 Next.js의 특징을 아래와 같이 설명하고 있다.

1. SSR 지원
2. 손쉬운 정적 사이트 제작
3. Styled-jsx를 내장하여 JS를 사용해 style 조작
4. Code splitting, routing, hot code reloading, universal rendering의 자동화
5. Webpack, Babel 설정이나 서버를 customizing하여 확장이 가능
6. Build 작업시 최적화작업을 진행하여 빠르고 더 작은 build size 확인 가능
  
이 포스트에는 사용법이 아닌, 사용하면서 새롭게 알게된 점이나 정리하고 싶은 것을 위주로 정리하려고 한다.

## Next.js Active Link 구현하기

`React-router-dom`에는 있었던 `<NavLink>` 컴포넌트가 Next.js에는 없었다. 구글링을 통해 해결방안을 찾아보면서 직접 Custom Link 컴포넌트를 만드는 방법이 가장 많았다. 그리고 그 검색 내용들을 참고해서 Custom Link 컴포넌트를 만들었다. 코드는 아래와 같다.

```javascript
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({ href, children, ...otherProps }) => {
  const router = useRouter();
  let className = children.props.className || '';
  if(router.pathname === href) {
    className = `${className} selected`
  }
  return <Link href={href} {...otherProps}>{React.cloneElement(children, { className })}</Link>
};

export default ActiveLink;
```

여기에서 내가 잘 몰랐던 부분은 `Reat.cloneElement()` 이다. `props.children`과 굉장히 비슷한데, 둘의 차이는 `props.children`은 단순히 읽어 오는 것이고, `React.cloneElement()`는 `children`으로 들어오는 컴포넌트를 복사하고 그 컴포넌트에 props를 넣거나 클래스명 등의 수정작업을 할 수 있다는 것이다. 이에 대한 설명은 [React 공식문서](https://ko.reactjs.org/docs/react-api.html)나 [StackOverFlow](https://stackoverflow.com/questions/37521798/when-should-i-be-using-react-cloneelement-vs-this-props-children/50441271#50441271)에 잘 설명되어 있다.

컴포넌트에 해당 라우팅 주소, children 컴포넌트 (대부분 a tag로 감싸진 element일 것이다.), 그리고 Link 컴포넌트의 props로 전달할 props들이다. 여기서 만약 route가 변경이 되면, Link 안의 `a` tag 클래스명이 selected로 변경되게 하였고, css를 활용하여 해당 클래스 명의 style만 변경하도록 하였다.

## replace in next/link

별 것 아니지만, API를 검색하면서 의도치 않게 조금 헤맸던 것이 있다. 바로 `Link` 컴포넌트의 `replace={true}`로 설정하는 부분이었다. 처음 API를 찾아보면서, 사실 Link보다는 `useRouter`를 통해서 추가된 것을 지워야 하나? 라는 생각을 했었고, `replace`라는 이름 자체도 다른 route로 변경한다는 의미로 이해하고 넘겨서 검색하는데 시간이 조금 걸렸던 것 같다.

조금 말이 많았지만, 여하튼 `replace` props는 내가 Link를 눌렀을 때 browser history에 추가되게 할 것인지, 아닌지를 설정하는 것이다. `default`값은 `false`이며 `true`일 때 history에 추가되지 않게 된다.

## useRouter

useRouter는 간단하게 말해서, router 정보를 확인하고 변경할 수 있도록 해주는 hook이다. `useRouter()`를 실행하면 `router Object`가 생성되는데, 이를 통해 현재 route 정보 확인 및 history에 push하는 등의 작업을 수행할 수 있다. 자세한 내용은 [Next.js](https://nextjs.org/docs/api-reference/next/router#router-object)에 잘 나와있다.

## Dotenv 사용하기

Next.js에서 environment variable을 사용하기 위해서는 약간의 설정이 필요했다. 다른 방법도 있겠지만, 나는 `dotenv-webpack` plugin을 사용했다.

먼저 위의 두 패키지를 설치하고 `next.config.js`에 다음과 같이 작성한다.

```javascript
const withImages = require('next-images');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = withImages({
  webpack: (config, options) => {
    config.plugins.push(
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      })
    )
    return config;
  },
});
```

next.js는 기본적인 webpack 설정이 되어있기 때문에 내가 customizing 하기 위해서는 next.config.js 파일을 사용해서 위와 같이 해 주어야한다. 특히, `withImages`와 같은 `with~~`라이브러리는 next.js에서 특정 기능을 수행할 수 있도록 도와주는 웹팩 라이브러리이기 때문에 목적에 맞게 찾아서 설정해주면 된다. 그리고 그 안에 webpack property를 위와 같이 설정해주면, 해당 라이브러리가 webpack 설정을 추가, 변경해주게 된다. defaul로 config안에 선언되어있는 plugins **배열**에 Dotenv plugin을 추가하기 위해 위와 같이 `.push`를 사용해 추가해주고, 환경변수가 선언되어 있는 경로와 `systemvars`를 `true`로 설정해주면 끝이다. 추가 webpack 설정의 경우는 원하는 내용을 검색하면 굉장히 좋은 글들이 많다.


## 도움받은 문서

[Next.js](https://nextjs.org/)<br>
[Stack Overflow](https://stackoverflow.com/)

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
