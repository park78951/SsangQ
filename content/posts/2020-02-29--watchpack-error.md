---
title: '프로젝트를 배포한 후 EC2에서 발생한 Watchpack Error: ENOSPC'
date: '2020-02-29T14:49:12.000Z'
template: 'post'
draft: false
slug: 'watchpack-error'
category: 'WEB'
tags:
  - 'frontend'
  - 'EC2'
  - 'error'
  - 'AWS'
  - 'watchpack'

description: 프로젝트를 진행하면서 겪었던 에러를 공유하려고 한다. 이번에 겪은 에러는 EC2에서 테스트하다가 겪은 watchpack error[ENOSPC]이다.
---

## 들어가기에 앞서
사실 이 에러는 자주 접할 수 있는 에러는 아니라고 생각한다. 하지만 한글로 찾아봤을 때 이 에러에 대한 글을 찾아 볼 수 없었고, 혹시라도 에러에 대한 원인의 실마리를 찾는데 조금이나마 도움이 될 수도 있다고 생각하여 정리해보려고 한다.

## [Watchpack Error]의 발생 원인은?
프로젝트를 EC2에 배포하면서 함께 진행하는 동료와 EC2 내부 문제를 테스트하기 위해 develop mode로 build 및 nodemon 실행한 적이 있었다. 하지만 그 때 발생한 또 다른 문제는 바로 아래의 에러였다.

```
Watchpack Error (watcher): Error: ENOSPC: System limit for number of file watchers reached, watch '/home/ec2-user/~
```

의미를 해석해 보자니 EC2에서 허용하는 watcher가 감시하는 파일 갯수를 초과하였다고 하는 것 같은데 이건 또 무엇인가... 다시 구글링을 하기 시작했다.

## 단순 해결책이 다수인 해결책들
글이 많지는 않았지만, 다수의 글과 stackoverflow에서 해결책을 찾을 수는 있었다. 명령어를 읽어보니 max watch의 숫자를 늘리는 명령어로 추측할 수 있었다.
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
근데 어떤 부작용이 있을 줄 알고 무작정 늘릴 수는 없지 않은가? 일단 에러의 원인에 대해 더 찾아보기로 하고 구글링을 다시 시작했다.

## 원인은 develop mode의 웹팩과 nodemon
구글링을 통해 발견한 것은 바로 chokidar이란 npm module이 문제의 시작이란 것이었다. 에러메시지 전체를 확보하지는 못했지만, 위의 메인 에러메시지 아래 Error Stack에서 아래와 같이 `node_modules/chokidar`에서 문제가 발생함을 확인할 수 있었다.
```
at ~~/node_modules/chokidar
at ~~/node_modules/chokidar
at ~~/node_modules/chokidar
at ~~/node_modules/chokidar
```
이 chokidar는 웹팩과 바벨이 파일들을 모니터링하기 위해 사용하는 모듈이라고 한다. 그렇다면 웹팩 서버와 바벨, nodemoe이 문제일 수 있다고 가정해 볼 수 있었다. **develop mode에서 코드의 변화를 감지하고 hot-loader를 통해 바로 화면에 반영해 주기 때문에 배포했을 경우와는 달리 watcher의 갯수가 증가하게 된 것이 원인이라고 생각했다.** 동료와 함께 그 전의 다른 문제를 해결하고 바로 production모드로 실행해봤다.

> Clear

에러가 발생하지 않는 것을 볼 수 있었다.

## 해결 경험을 통해
사실 큰 쓸모가 있을 지는 모르겠지만, 항상 문제를 해결하는 것은 희열이 있다. 그리고 어떤 경험이든 뼈와 살이 된다고 생각한다. 하지만 무엇보다 다양한 경험을 통해 해결 방법에 대한 노하우, 그리고 그 해결 방법을 통해 얻은 지식은 또 다른 문제 해결의 밑거름이 된다고 생각한다. 단순 해결 방법을 찾는 사람에게는 도움이 되지 않을 수도 있지만, 조금이나마 원인을 알고 싶은 사람에게는 도움이 되었으면 좋겠다.



## 도움받은 문서

[Medium: Pavan](https://medium.com/@Pavan_/create-react-app-enospc-issue-on-linux-5f946df8479c)<br>
[stackoverflow](https://stackoverflow.com/questions/50793920/enospc-error-in-create-react-app)<br>

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
