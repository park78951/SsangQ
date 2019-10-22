---
title: HTML내부의 <script> 태그 속성인 async와 defer
date: "2019-06-23T20:34:14.000Z"
layout: post
draft: false
path: "/posts/async-and-defer-in-script-tag/"
category: "HTML-CSS"
tags:
  - "Async"
  - "Defer"
  - "Asynchronize"
  - "Javascript"
  - "HTML-Tag"

description: "미션을 하면서 script태그를 body에 써야할지 head에 써야할지 고민하며 review받은 HTML script tag 속성인 async와 defer에 대해 정리해보고자 한다."
---

미션 진행 중 미션에서는 처음 HTML의 코드를 작성하면서 `<script>` 태그를 head에 쓸 것인가, body에 쓸것인가를 고민하게 되었다. 물론 대략적으로 *body의 마지막에 쓰는 것이 좋다* 라는 주입식 교육으로 인해 계속해서 body의 아랫 부분에 써왔지만, 왜 써야하는지는 수업과 미션을 통해 javascript를 모두 읽은 뒤 html을 렌더링하게되면, 화면 출력을 기다리는 UX 측면에서 부정적인 영향을 주기 때문에 자제해야 한다는 점을 알게 되었다.

하지만 역시 **정리됨**, **깔끔함** 은 코드 작성에서 매우 중요한 특성중 하나라는 점을 느꼈는데, 그 이유는 바로 `async`와 `defer`의 사용 때문이다. 단어에서 유추할 수 있 듯, 비동기적 처리를 가능하게 하는 속성이다. 비동기적 처리가 가능하다는 것은 body의 끝 부분에 작성할 필요가 없다는 것이다.
 
일반적으로 `async`와 `defer`는 모두 외부에서 받아오는 js파일에 한하여 작동한다고 한다.
그렇다면 `async`와 `defer`는 정확하게 무엇을 의미하며 어떤 기능을 수행하는 속성일까?

# async에 대해 알아보자.

```
<script async src="script.js">
```

`async`는 위와 같이 작성한다. `async` 의 특징은 `<head>`에 삽입하거나 `<body>`에 삽입하여도 parsing작업이 중단되지 않고 script를 비동기적으로 다운로드한다. 하지만, 다운로드 즉시 parsing작업이 중단되고 script가 실행되게 된다.

# 그렇다면 defer는?

```
<script defer src="script.js">
```

`defer`는 위와같이 작성하며 `async`와 비슷하게 script 파일을 비동기 다운로드하지만, HTML parsing작업이 끝나기 전까지 스크립트를 실행하지 않는다. 즉, parsing 작업이 모두 이뤄진 후 스크립트가 실행되게 된다.

# 그럼 무조건 defer를 써야하나?

내 생각으로는 스크립트 코드에 대한 깊은 이해가 없는 경우, 초보자의 경우에는 defer를 사용하면 대부분의 문제는 해결되지 않을까 싶다. 하지만, 각 특징은 아래와 같은 ***사용 타이밍(?)***을 갖고 있다고 한다.

## defer를 사용하는 경우

- DOM 조작을 수행하여 HTML과 의존성이 있는 경우. HTML에 완전히 parsing된 이후에 스크립트가 실행되어야 DOM을 완전히 조작할 수 있게된다.

## async를 사용하는 경우

- DOM 조작을 수행하지도 않으며 HTML과 의존성이 없는 경우.

굉장히 쉬울 수도 있는 내용이지만, 처음 봤을때는 뭔 차이인지 잘 몰랐기 때문에 다시 한 번 정리할 겸 작성한다.

___

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---