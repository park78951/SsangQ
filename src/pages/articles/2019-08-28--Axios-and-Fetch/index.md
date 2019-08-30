---
title: Axios와 Fetch, 무엇을 사용할까?
date: "2019-08-28T22:56:14.000Z"
layout: post
draft: false
path: "/posts/axios-and-fetch/"
category: "JAVASCRIPT"
tags:
  - "Async"
  - "Axios"
  - "Fetch"
  - "Javascript"
  - "Front-end"

description: "React를 하면서 Axios를 한 번 써보기로 했다. 근데 Fetch랑 비슷한 것 같은데...."
---

### Axios가 핫 하다던데

Axios를 사용하게 된 계기는 Hot 하다는 말 때문이었다. 내가 언젠가는 GET을 사용해 데이터를 받아오는 것 뿐만 아니라 직접 POST, PUT 메소드를 써가며 데이터를 저장, 변경하는 것 까지 직접 하고싶은 마음에 이러한 메소드 사용이 편리하다는 소식을 접하고 일단 써보자는 마음으로 React기반의 TODO Application의 기본 데이터를 가져올 때 사용해봤다. 하지만 아직까지는 GET 메소드 외에 사용할 일이 없었다...

### Axios의 장점?

Fetch API와 비교한 Axios의 장점을 간단하게 정리하자면 아래와 같다고한다.
- IE까지 대부분의 브라우저를 지원한다. (구형 포함)
- JSON 데이터를 자동 변환해준다. (.json() 사용할 필요 없음)
- Node.js에서도 사용 가능하다. (fetch도 별도 라이브러리로 사용할 수 있는 것으로 알고 있으나 사용해 보지는 않았다.)
- 요청을 중도 Cancel, 응답시간 초과 설정 등의 기능이 있다. (개인적으로 꼭 써보고 싶은 기능)
- 400, 500대의 Error 발생시에 `reject` 로 response를 전달해 catch로 잡아낼 수 있다. (fetch의 경우 네트워크 장애나 요청이 완료되지 않은 경우에만 `reject`로 response를 전달하기 때문에, 400, 500대의 Error의 경우는 `resolve`로 받아 따로 예외처리를 해야 한다.)

### 느낀점
- 아직까지 큰 프로젝트를 하지 않아서 Fetch보다 좋은 점에 대해 체감하기는 힘들었다. Native로 사용할 수 있는 Fetch와 달리, axios는 설치 및 import를 해야하고, 무거운 느낌도 있기 때문에 사실 체험삼아 사용해 본 것이 아니라면 사용하지 않는 것이 좋았을 것이란 생각이 든다. 하지만, 위의 Axios의 장점들은 서버를 구축하고 큰 프로젝트를 할 수록 분명 편리한 기능이 될 것이라고 생각하기 때문에, 추후 개인 프로젝트를 진행하면 다시 한 번 Axios의 편리하다는 메서드들을 사용하면서 위의 장점들을 살려보고 싶다. (물론 다시 이 글도 업데이트 될 것이라 믿는다..)

---
#### 도움받은 곳
[Axios Page](https://github.com/axios/axios)