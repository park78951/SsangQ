---
# title: Tree
# date: '2019-11-27T18:31:09.000Z'
# layout: post
# draft: false
# path: '/posts/code-splitting'
# category: 'JAVASCRIPT'
# tags:
#   - 'Code Splitting'
#   - 'React'
#   - 'Javascript'
#   - 'Webpack'
#   - 'Lazy Loading'

description: 프로젝트를 진행하면서 학습차원에서, 그리고 효율을 확인해보기 위해서 코드 스플리팅을 사용해봤다.
---

# Code Splitting의 필요성?
SPA의 장점이자 단점 중 하나는 렌더링에 필요한 모든 파일을 한 번에 다운받아 추가적인 요청 없이 하나의 어플리케이션 처럼 작동하는 방식이라고 한다. 물론 사용해보면서도 확실히 새로고침 없이 매끄럽게 동작하는 걸 보면 굉장히 공감하는 부분이다. 하지만, 역시 초기 요청시 필요한 모든 자원을 다운 받기 때문에 초기 로딩속도가 느린점은 감안해야 하는 부분 중 하나다. 

물론 요즘 인터넷 속도가 굉장히 빠르기 때문에 대부분 초기 렌더링이 느리다는 점을 못 느끼긴 하지만, 프로젝트의 크기가 커질 수록 *Code Splitting*이 성능상의 도움이 될 것이라고 생각한다.

이번에 시도해 본 것은 Webpack의 optimization property를 사용해 node moudles의 패키지 파일들을 splitting 하고 React의 lazy loading을 통해 컴포넌트를 splitting 한 것을 정리하고자 한다.

# Webpack을 활용한 Splitting
Webpack의 역할은 Bundling이다.


# 도움받은 문서
 
___

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
