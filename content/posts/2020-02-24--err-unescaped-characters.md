---
title: 'Data 요청 중에 발생한 [ERR_UNESCAPED_CHARACTERS]에러'
date: '2020-02-24T17:32:12.000Z'
template: 'post'
draft: false
slug: 'err-unescaped-characters'
category: 'WEB'
tags:
  - 'frontend'
  - 'async'
  - 'error'
  - 'http'
  - 'content-type'
  - 'unescaped'
  - 'unescaped characters'

description: 프로젝트를 진행하면서 처음 겪는 에러때문에 삽질을 한 경험을 공유하려 한다. 이번 문제의 에러는 [ERR_UNESCAPED_CHARACTERS]이다.
---

## 들어가기에 앞서
글을 모두 읽으면 정말 별 것 아닐 수도 있다. 하지만 나와 같이 처음 겪는 사람들에게 조금이나마 도움이 되었으면 좋겠다는 생각으로 이 글을 공유하려 한다.

## ERR-UNESCAPED-CHARACTERS의 발생 원인은?
프로젝트를 하면서 Axios를 사용해 get 요청을 보낼 일이 있었다. 농구 코트의 정보를 보내는 것인데, query string을 사용해 get 요청을 보내는 것이었다.
요청의 주소는 아래와 같았다.

```
axios.get('~~/courts?courtName=한강&page=1');
```
(위의 요청을 보고도 원인을 안다면, 더 이상 읽을 필요는 없을 것 같다.)

이렇게 요청을 보내고 나니, 아래와 같은 메시지가 출력되었다.
```
TypeError [ERR_UNESCAPED_CHARACTERS] Request path contains unescaped characters
```
backend쪽 log를 확인해보니 API 서버에 요청조차 오지 않았다. 그렇다면 온전히 클라이언트의 문제라는 말인데... 지금까지 한 번도 접해보지 못했던 Error였기에 에러 메시지를 기반으로 해결책을 찾으려고 노력했다.

## request path에 unescaped 문자가 있다?
unescaped characters에 대한 정확한 지식이 없었다. 그렇기 때문에 처음에는 [stackoverflow](https://stackoverflow.com/)에 해당 error를 검색해봤고, 구글링을 통해 가장 빈도가 높은 요인을 먼저 확인하기로 했다.

### 띄어쓰기나 잘못된 특수문자 등의 typo를 확인해라.
검색 결과에서 가장 빈도 높은 원인은 바로 URI의 path에 오타였다. URI에 띄어쓰기가 포함되어 있다거나, 허용되지 않는 특수문자가 포함되는 경우 해당 에러가 발생했다고 한다. 일단 나의 URI에 문제가 있는지 debugger, console.log를 사용하여 모두 확인해 봤지만, 문제가 없었다. 그렇다면 다른 원인이 있단 말일까?

### URI의 Query에 한글이 범인이었다
함께 프로젝트를 진행하는 동료와 의견을 나누며 한글이 문제일 수도 있지 않을까라는 의문을 제기하게 되었다. 생각을 해보니 내가 찾은 stackoverflow의 글들은 대부분 영어이고 대부분의 영어권 사람들이 나와 같은 문제를 경험하지는 못했을 것이다. (하지만 한글로 찾아도 오타 요인 외에는 잘 나오지 않았다. 그저 나의 무지함이 원인이란 말인가...) 한글이 문제라는 가정하에, 한글로 URI를 처리하는 방법들을 찾아봤다. 여러가지의 방법이 있었지만, 기본 메서드인 `encodeURI`를 사용하기로 결정했다. 전체 URI 주소를 `encodeURI`의 인자로 넘겨서 반환된 값을 `axios.get(URI)`에 넣어주었다. 놀랍게도 통신이 원활하게 이뤄졌고 문제는 해결되었다.

## 그럼 unescaped character가 정확히 뭐지?
문제를 해결하고 나니 unescaped character가 정확히 무엇이고 왜 한글이 문제인지 의문을 갖게 되었다. 아직 모든 것을 다 찾아보진 못했지만 구글링을 통해 배운 것을 정리하자면, 내가 보낸 get 요청은 `application/x-www-form-urlencoded`이란 content-type 포맷을 따르고 이는 바로 query string에서 찾아 볼 수 있는 `key=value&key=value`와 같은 형식이다. 

하지만, 국제 표준 내용인 `RFC2396`에 따른 아래와 같은 설명을 찾아 볼 수 있다고 한다.
```
The list of characters that are not encoded has been determined as follows:

RFC 2396 states:
-----
Data characters that are allowed in a URI but do not have a reserved purpose are 
called  unreserved. These include upper and lower case letters, decimal digits, 
and a limited set of punctuation marks and symbols.

unreserved  = alphanum | mark

mark        = "-" | "_" | "." | "!" | "~" | "*" | "'" | "(" | ")"

Unreserved characters can be escaped without changing the semantics of the URI, 
but this should not be done unless the URI is being used in a context that does 
not allow the unescaped character to appear.
-----

It appears that both Netscape and Internet Explorer escape all special characters 
from this list with the exception of "-", "_", ".", "*". While it is not clear 
why they are escaping the other characters, perhaps it is safest to assume that 
there might be contexts in which the others are unsafe if not escaped. Therefore, 
we will use the same list. It is also noteworthy that this is consistent with 
O'Reilly's "HTML: The Definitive Guide" (page 164).

As a last note, Intenet Explorer does not encode the "@" character which is 
clearly not unreserved according to the RFC. We are being consistent with the RFC 
in this matter, as is Netscape.
```

위의 내용을 요약하자면, 결국 영어 alpahbet과 숫자, 특수문자 `"-" | "_" | "." | "!" | "~" | "*" | "'" | "(" | ")"`을 제외한 문자, 특수문자 등은 인코딩, 디코딩 작업이 필요하다는 것이다. 이러한 이유로 위에 해당하지 않는 문자가 URI에 포함되기 위해서는 encoding 처리를 해줘야 하는데, 그 방법으로 `escape`, `encodeURI`, `encodeURIComponent` 등을 사용하면 된다.

## 해결 경험을 통해
사실 이와 비슷한 내용은 개발공부를 하면서 주워 들었던 것도 있었다. 나중에 공부를 하며 *'아 맞다!'*를 외친 것도 있었다. 하지만, 내가 이 에러를 경험하지 못했다면, 위의 내용에 대해 한 층 더 깊게 공부할 기회도 없었을 것이라고 생각한다. 처음에 URI encode decode를 들었을 때는 필요하지 않았기에 머릿속에 잘 남지도 않았다. 하지만, 내가 경험한 문제고 이를 해결하기 위해 찾아보니 `application/x-www-form-urlencoded`에 대한 포맷의 설명들도 더욱 머릿속에 강하게 박히게 되었다. 결과적으로 별 것 아닌 삽질이었음에도 좋은 경험이라고 생각한다.


## 도움받은 문서

[ietf](https://www.ietf.org/rfc/rfc2396.txt)<br>
[stackoverflow](https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data)<br>
[Derveljun's Programming Log](https://derveljunit.tistory.com/242)<br>

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
