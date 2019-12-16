---
title: 'Router Api 뜯어보기'
date: '2019-10-22T11:38:22.000Z'
template: 'post'
draft: false
slug: 'custom-react-router'
category: 'JAVASCRIPT'
tags:
  - 'Router'
  - 'React'
  - 'react-router-dom'
  - 'customized router'

description: React Router를 학습하기 위해 React Router를 Customizing한 블로그를 뒤져가며 나도 같이 만들어보며 원리를 이해하고자 학습하고 이렇게 정리하고자 한다.
---

React Router를 학습하기 위해 React Router를 Customizing한 블로그를 뒤져가며 나도 같이 만들어보며 원리를 이해하고자 학습하고 이렇게 정리하고자 한다.

## React Router

React Router Dom Library를 사용하면서 React Router가 어떤식으로 동작하는지 궁금했다. 함께 공부하는 분이 이전에 학습하고 만들어봤던 custom router를 참고해서 일단 따라 만들어보며 이해하려고 노력했다. 사실 React Router와 완전히 같지는 않지만 사용이 상당히 비슷하기 때문에 몇몇 Api를 제외하고는 내부 동작 또한 비슷할 것으로 생각된다. 차근 차근 정리해보려한다.

### 필요한 libraries

먼저 Custom Router를 만들기 위해서는 [history](https://www.npmjs.com/package/history), [querystringify](https://www.npmjs.com/package/querystringify) libraries가 필요하다. **history** library는 브라우저의 history 즉, 페이지 이동의 정보를 관리하는 library이고, **querystringify**는 말 그대로 URL의 query string을 파싱해주는 작업을 도와준다.

### Router를 만들기에 앞서

일단 현재 경로와 같은 Routing 정보는 전역에서 접근이 가능해야 Link와 Route가 제 기능을 다 할 수 있을 것이다. 이를 위해 여기서는 Context Api를 사용해 routing 정보를 전역에서 접근할 수 있게 한다.

### Custom Router

#### 1. Location 정보 분석을 도와주는 함수

현재 브라우저 Location (URL 내부의) 정보를 쪼개는 util 함수를 먼저 만든다.

```
import qs from 'querystringify';

export function locationToRoute(location) {
  // location comes from the history package
  return {
    path: location.pathname,
    hash: location.hash,
    query: qs.parse(location.search),
  };
}
```
인자로 location 정보를 받으면, location의 프로퍼티인 pathname, hash, search 정보를 추후 사용하기 쉽게 객체로 저장하도록 한다.

#### 2. Router Context

이제 Router 정보를 전역에서 접근할 수 있도록 Context Api를 사용해 만든다.

```
import React from "react";
import { createBrowserHistory } from "history";
import { locationToRoute } from "./utils";

export const history = createBrowserHistory();

export const RouterContext = React.createContext({
  route: locationToRoute(history.location),
});
```
먼저 history library에서 createBrowserHistory Api를 사용해 새로운 browser history를 만든다. 그리고 새로운 Context를 만드는데, **route** 프로퍼티에 현재 location을 저장하는 객체를 Context 초기값으로 설정해준다. **route** 프로퍼티의 값은 util 함수로 만들었던 `locationToRoute`에 history.location을 인자로 넣어 결과 값을 저장한다.
이제 useContext로 context를 불러 현재 path, hash, query 값에 접근할 수 있다.

#### 3. Route와 Link Component

React Route의 주 기능을 담당하는 `Route`와 `Link` 컴포넌트를 만들 차례다. 

`Route` 컴포넌트는 url에 제공되는 path가 일치할 경우 컴포넌트를 띄우는 작업을 수행한다.
`Link` 컴포넌트는 전체 페이지를 Re-loading하지 않고 `history` api를 통해 URL의 path를 바꿔주는 작업을 수행한다.

이렇게 Link가 전체 페이지의 Re-loading 없이 path를 바꿔주고, Route 컴포넌트에서는 path에 따라 해당하는 컴포넌트만 render해주는 작업으로 이뤄진다. 
그러면 useContext를 사용해 위에서 만든 Context의 데이터를 사용해 `Route`와 `Link` 컴포넌트를 만들어보자.

##### Router
```
import React from "react";
import { RouterContext } from "./context";

export function Route({ path, children }) {
  // Extract route from RouterContext
  const { route } = React.useContext(RouterContext);

  // Return null if the supplied path doesn't match the current route path
  if (route.path !== path) {
    return null;
  }

  return children;
}
```

Router 컴포넌트는 2개의 props를 받는데, `path와` `children`이다. `children`은 `Route`의 자식요소로 전달된 컴포넌트를 그대로 가져와서 렌더링 하기위함이고, `path`는 위에서 보다시피 Context로 가져온 route 정보에서 현재 path와 비교 후 인자로 들어온 path와 Context에 있는 path가 일치하지 않으면 새로운 뷰 (children이 갖고 있는)를 출력해준다.

##### Link
```
import React from "react";
import { RouterContext, history } from "./context";

export function Link(props) {
  const { to, onClick, children } = props;

  // Extract route from RouterContext
  const { route } = React.useContext(RouterContext);
  const handleClick = (e) => {
    e.preventDefault();

    // Dont' navigate if current path
    if (route.path === to) {
      return;
    }

    // Trigger onClick prop manually
    if (onClick) {
      onClick(e);
    }

    // Use history API to navigate page
    history.push(to)
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
```

Link는 `to`, `onClick`, `children` props를 받는다. `to`는 URL을 변경할 path를 의미한다. 현재 Link 컴포넌트를 클릭하면 Context에 저장된 현재 `path(route.path)`와 비교해서 같지 않으면 인자로 받은 to를 `history.push(to)`와 같은 방법으로 history에 추가해 줌으로써 현재 path를 바꿔 Route에 알려주는 역할을 한다. 인자로 받은 onClick은 단순히 onClick 함수가 있다면 해당 event 객체를 전달하기 위함이고, children은 변경 없이 Link 기능만 갖도록 하여 출력하도록 return한다.

여기서 중요한 것은 `a` tag의 사용이라고 생각한다. 일반적으로 서버사이드 렌더링에서는 HTML에서 `a` Tag를 사용해 페이지 전환을 하는데, SPA에서도 마찬가지로 `a` Tag를 사용해 이 작업을 진행하고 있었다. 또한 page 전체 Re-loading을 막기 위해 `e.preventDefault()`를 사용했다는 점까지, 생각보다 상당히 간단하게 구현이 가능하구나 라는 느낌을 받았다.

### 4. Router Component

이렇게 각 컴포넌트에서 Context를 데이터를 사용하고 변경할 수 있으려면 `Provider` 컴포넌트가 필요하다. 이와 함께 추가적인 기능을 수행하는 `Router` 컴포넌트를 알아보자.

```
import React from "react";
import { locationToRoute } from "./utils";
import { history, RouterContext } from "./context";
import { Route } from "./route";
import { Link } from "./link";

class Router extends React.Component {
  constructor(props) {
    super(props);

    // Convert our routes into an array for easy 404 checking
    this.routes = Object.keys(props.routes).map((key) => props.routes[key].path);

    // Listen for path changes from the history API
    this.unlisten = history.listen(this.handleRouteChange);

    // Define the initial RouterContext value
    this.state = {
      route: locationToRoute(history.location),
    };
  }

  componentWillUnmount() {
    // Stop listening for changes if the Router component unmounts
    this.unlisten();
  }
  
  handleRouteChange = (location) => {
    const route = locationToRoute(location);
    this.setState({ route: route });
  }

  render() {
    // Define our variables
    const { children, NotFound } = this.props;
    const { route } = this.state;

    // Create our RouterContext value
    const routerContextValue = { route };

    // Check if 404 if no route matched
    const is404 = this.routes.indexOf(route.path) === -1;

    return (
      <RouterContext.Provider value={routerContextValue}>
        {is404 ? <NotFound/> : children}
      </RouterContext.Provider>
    );
  }
}

export { history, RouterContext, Router, Route, Link }
```

Router는 먼저 2개의 props를 받는데, `routes list`와 404 에러처리에 대한 `NotFound` 컴포넌트이다. 이 두 props는 `routes list`로 등록할 path를 모두 확인해 해당 경로가 없을 경우 바로 `NotFound` 컴포넌트를 출력해주기 위함이다.

또한 RouterContext를 통해 route 값을 각 컴포넌트에 전달하는 역할도 하고있고, `history.listen`을 통해 현재 history의 변경을 route값으로 저장하고 있다. 마지막으로는 export로 모든 컴포넌트를 한번에 export하는 모습을 볼 수 있다.

`react-router-dom`을 열어보니 Context Propvider 역할을 Switch에서 하고 있으며, `history`를 BrowserRouter에서 생성해 Router 컴포넌트로 전달하고 있었다.

아래는 이 Costom Router를 사용한 코드이다.

```
export const routes = {
  home: {
    path: "/",
  },
  about: {
    path: "/about"
  },
};
```
```
import React from "react";
import ReactDOM from "react-dom";
import {Router, Link, Route, history} from "./router";
import {routes} from "./routes";

function NotFound() {
  return (
    <div>
      <p>404 - Not Found</p>
      <Link to={routes.home.path}>Back to home</Link>
    </div>
  )
}

function App() {
  return (
    <Router routes={routes} NotFound={NotFound}>
      <Route path={routes.home.path}>
        <p>Home</p>
        <Link to={routes.about.path}>Go to about</Link>
        <Link to="/unknown">Go to unknown route</Link>
        <div className="link" onClick={() => history.push(routes.about.path)}>
          Programmatically go to about
        </div>
      </Route>
      <Route path={routes.about.path}>
        <p>About</p>
        <Link to={routes.home.path}>Go to home</Link>
      </Route>
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

___

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
