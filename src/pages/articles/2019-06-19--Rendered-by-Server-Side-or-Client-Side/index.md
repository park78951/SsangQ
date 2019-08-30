---
title: 서버사이드 렌더링과 클라이언트사이드 렌더링
date: "2019-06-19T21:00:00.000Z"
layout: post
draft: false
path: "/posts/rendered-by-server-or-client/"
category: "WEB"
tags:
  - "Rendering"
  - "Server"
  - "Client"
  - "Front-end"
description: "React를 공부하면서, 또는 Front-end와 약간의 Back-end 내용을 공부하면서 접한 Server Side Rendering, Client Side Rendering에 대한 학습의 필요성을 느껴 정리해보고자 한다."
---

---

React를 공부하기 전이지만, node.js에서 서버 생성이나 그와 관련된 Frame Work을 공부하다보니 그렇게 스쳐지나가며 들었던 **Server Side Rendering**과 **Client Side Rendering**의 의미와 특징이 무엇인지 궁금해졌다. 이번 기회에 조금이나마 공부한 것을 정리해보고자 한다. 

## **먼저 Rendering이란 무엇일까?**

간단하게 말하면 Rendering은 웹페이지를 화면에 그려주는 것으로 생각하면 된다. 자세한 Rendering에 관한 학습이 필요하다면 아래 링크를 참조하는 것도 좋다. <br>

- [NaverD2 - 브라우저는 어떻게 작동하는가?](https://d2.naver.com/helloworld/59361)


## **그렇다면 클라이언트와 서버란?**

사실 처음에 '클라이언트 단, 서버 단에서 렌더링을 하는 방식이야' 라는 설명을 들었을 때 클라이언트나 서버가 어떤 역할을 하는지도 몰랐기 때문에 도대체 무슨 말인지 알 수가 없었다. (무지했다.. 아직도지만..) <br> 

간단하게 클라이언트와 서버를 설명하자면 요청과 응답의 관계라고 설명할 수 있을 것 같다. 클라이언트는 인터넷을 사용하는 유저 측, 서버는 그 유저가 요청한 정보나 파일을 전달하는 것이라고 생각하면 되겠다.

## Single Page web Application?

SPA의 등장 배경은 바로 모바일 기기의 사용때문이라고 한다. PC보다 성능이 낮다보니 웹페이지를 출력하기 위해 기존 방식과는 다른 접근의 필요성이 그 배경이라고 한다. <br>

## **두 방식의 차이점이라 함은?**

두 방식의 차이점은 화면을 렌더링하는 위치, 유저의 요청에 따른 데이터 변화가 화면을 만들어주는 위치라고 한다. <br>

### 웹사이트를 사용하던 중 변화를 주었을 때

1. ***Server Side Rendering*** 은 서버 단에서 변화된 데이터를 반영해 완성된 화면을 전달해주는 것.
2. ***Client Side Rendering*** 은 변화된 UI를 유저의 브라우저에서 만드는 것
<br>

### 초기 view 로딩 속도

1. ***Server Side Rendering*** 에서는 view를 서버에서 처리해 초기 로딩속도는 빠르지만, 정보가 많은 B2C 웹 서버에서 등은 서버의 부담이 크다.

2. ***Client Side Rendering*** 에서는 CSS, Javascript 파일 등 필요한 파일을 모두 다운로드하기 때문에 view 로딩이 다소 늦지만, 최초 로딩 이후의 요청에 대한 대응이 빠르다.

### 보안문제

1. ***Server Side Rendering*** 은 사용자에 대한 정보를 서버측에서 세션으로 관리했다.
2. ***Client Side Rendering*** 은 쿠키 이외에 사용자에 대한 정보를 저장할 공간이 마땅치 않다.



## **요즘 Trend는 어떤지?**

SPA(Single Page Application)이 성장하면서 전통적인 ***Server Side Rendering*** 방식에서 ***Client Side Rendering*** 으로 변화되고 있는 상황이라고 한다. <br>

SPA는 APP에 필요한 리소스 모든 정적 리소스를 최초에 한번 다운로드하여 사용하는 Client Side Rendering이라고 한다. 요즘에는 제공되는 정보나 데이터가 굉장히 많아 서버 단에서 렌더링을 하게 된다면 요청시마다 페이지의 새로고침과 더불어 모든 화면을 그리는 작업, 불필요한 트래픽 때문에 성능상의 이슈가 발생한다. 그리하여 렌더링을 유저의 브라우저가 담당하게 하여 필요한 정보만 변경하여 보여주는 클라이언트 단의 렌더링은 유저들에게 더 나은 경험을 제공하기 시작하여 지금의 위치에 오르게됐다고 한다.

## **그럼 React는 Client Rendering으로만 이뤄졌다?**

일단 대답은 **'아니오'** 라고 한다. 추후에 더 공부하여 다루겠지만, Webpack 설정에 따라 Server Side Rendering 또한 제공하고 있다고 한다. 이 부분에 대해서는 더 학습하여 추후 다루기로 하겠다.

---
