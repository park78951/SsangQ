---
title: '예상치 못한 모바일 hegiht 설정'
date: '2020-06-08T22:23:12.000Z'
template: 'post'
draft: false
slug: 'mobile-height-issue'
category: 'HTML-CSS'
tags:
  - 'frontend'
  - 'mobile'
  - 'viewport'
  - 'css'
  - 'height'

description: 최근 작업하면서 별 것 아닌 것 같지만 쉽게 혼란에 빠질 것 같은 모바일 웹뷰에서의 CSS 이슈를 공유하려한다.
---

<img width="710" alt="css" src="https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/117415455/original/ed070a7476304c9ea16e07722889a8633bf92f8c/fix-css-issues-in-your-website.jpg">

> image by [Fiverr](https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/117415455/original/ed070a7476304c9ea16e07722889a8633bf92f8c/fix-css-issues-in-your-website.jpg)

## Mobile 개발 비기너가 겪은 Issue

프론트엔드 개발을 공부하면서 개인적으로는 가장 까다로운 부분 중 하나가 CSS였다. 물론 지금 일을 하면서도 그렇게 느끼며 고통스러워하고 있다. 사실, CSS가 별 것 아니겠지라고 생각했던 적도 있지만, 그 생각은 조금만 복잡한 UI를 만들기 시작하면서 금새 사라져 버렸다. 각 브라우저의 특색을 표출하고 싶었던 것인지는 모르겠지만, 통일되지 못한 크고 작은 기준들 덕분에 issue가 마구 쏟아졌고 이를 수정하는데 시간도 많이 투자해야했다. 심지어는 수정을 하다보면 수정하는 것들이 꼬리에 꼬리를 물다보니 내가 무엇을 수정하고 있는지 혼란이 올 때도 있었다. 

최근에는 모바일 작업을 하다보니 기존 웹에서 익숙하게 사용하던 스타일이 잘 맞지 않거나 어긋나기 시작했다. 그 중에서 `height: 100vh` issue를 경험하게 되었는데, 단순히 UI의 크기 차이같은 issue라기 보다는 웹과 모바일의 뷰 영역 차이점을 담고있는 중요한 이슈라고 생각했다. 특히, 처음 모바일 스타일을 다루는 프론트엔드 개발자가 흔히 겪는 문제라하여 정리하면 좋을 것이라고 생각했다. 

## Mobile에서의 height: 100vh 이슈란?

개발을 하면서 UI 확인은 크롬의 Device Toolbar를 사용했다. 크롬의 화면대로 나오면 얼마나 좋을까... 하지만 어느 정도 만들고 확인을 해보니, Header가 짤리는 것을 발견했다. 단순히 margin이나 사소한 style의 잘못된 적용 때문이겠지 하며 style을 유심히 확인했지만 문제를 발견할 수는 없었다. 결국 구글링을 통해 쉽게 원인을 발견할 수 있었는데, 바로 모바일에서만 나타는 주소창은 `height: 100vh`의 영역 안이라는 것이다. 다시 말해, body에 `height: 100vh`을 주었을 때 body는 주소창이 붙어있는 view port의 최상단부터 맨 아래까지를 높이 영역으로 인식하게 된다. 이 때문에 아래 사진의 왼쪽과 같이 Header가 주소창에 가려져 짤리는 이슈가 발생하였다.

<img width="710" alt="mobile issue" src="https://res.cloudinary.com/practicaldev/image/fetch/s--Bp92gsta--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://i.imgur.com/ye8aGeo.png">

> image by [admitKard](https://dev.to/admitkard/mobile-issue-with-100vh-height-100-100vh-3-solutions-3nae)


그렇다면 어떻게 오른쪽사진과 같이 이슈를 해결할 수 있을까?

## hegiht: 100%로 간단하게 해결

간단하게 CSS만으로 해결할 수 있는 방법은 바로 `height: 100vh` 대신 `height: 100%`를 주는 것이다. 굉장히 간단하고 나도 이 방법을 사용했다. 하지만, 내가 참고한 블로그에서는 이 방법이 모든 노드에 정확하게 전파되지 않을 수 있다고 말하였다. 그리고 그 외에 JS로 innerHeight를 계산해 높이를 주는 방법과 JS + CSS 방법을 소개했지만, Style에 JS를 최소화하고 싶어 100%를 도입했었고 별 다른 이슈없이 잘 동작했다. 

다른 방법이 궁금하다면 아래 도움받은 문서에 기재된 블로그를 참조하면 좋을 것 같다.


## 도움받은 문서

[블로그: admitkard](https://dev.to/admitkard/mobile-issue-with-100vh-height-100-100vh-3-solutions-3naemotivation)<br>


> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
