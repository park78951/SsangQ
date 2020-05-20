---
title: 'React 상태관리를 통해 배운 내용'
date: '2019-12-30T23:57:23.000Z'
template: 'post'
draft: false
slug: 'react-state-management-1'
category: 'JAVASCRIPT'
tags:
  - 'React'
  - 'javascript'
  - 'frontend'
  - 'state'
  - 'state management'


description: React Google Map을 사용하면서 배열로 받은 상태값을 사용해 처음 marker를 렌더링하고, 이후 특정 marker만 변경하기 위해 고민했던 내용을 정리 공유하고자 한다.
---

이번 포스트에 정리하고자 하는 내용은 프로젝트를 진행하면서 Google Map에 marker를 찍어야 하는데, List 중 특정 정보를 클릭하면 그 정보에 해당하는 marker의 모양을 바꾸고 싶었다. 기존에 작성한 코드 내용을 간략하게 정리하자면, 배열로 전달 받은 위치 정보들을 useMemo와 배열의 map 메서드를 활용해 marker 컴포넌트 배열을 만들고 이를 rendering하는 구조였다. 중요한 코드만 추가하여 간추린 아래 코드 예시를 보자.

```javascript
// ..
  const markers = useMemo(() => {
    return searchedCourts.map((courtInfo) => {
      const { locationName } = courtInfo;
      return (
        <Marker
          courtInfo={ courtInfo }
          mouseOverOutHandler={ onMouseOverAndOutOfMarker }
          position={ createFullCoordinate(courtInfo) }
        />            
      );
    });
  }, [searchedCourts]);
// ..
```
`searchedCourts`는 검색으로 얻은 위치 정보가 담긴 배열이고, 이 배열을 통해 `Marker`(react-google-maps/api 제공) 컴포넌트를 생성하는 구조였다. 여기서 특정 Marker만 변경하기 위해 이 로직 안에서 기존의 위치 정보 중, 선택한 위치정보와 일치하는 정보를 비교하여 변경하였다. 그 때 아래와 같은 문제가 발생했다.

1. 모든 marker를 비교해야하기 때문에 `Marker` 컴포넌트들이 재 생성됨
2. 이후 모든 marker가 리렌더링 되어 지도에서도 깜빡거리는 현상 발생

이를 해결하기 위해서 고민하던 중, 아예 Marker를 포함하는 Component를 생성해 내부에서 선택한 위치 정보와 비교 작업을 진행하면 어떨까 생각했다. 선택한 위치 정보는 `Redux`의 `Reducer`에서 관리되고 있기 때문에 이를 Global Store에서 직접 받고, 검색으로 얻은 위치 정보는 상위 컴포넌트에서 전달 받는 로직으로 구현하면 문제가 해결될 것으로 생각했다. 아래와 같이 코드를 작성했다.

```javascript
// ..
 const markers = useMemo(() => {
    return searchedCourts.map((courtInfo) => {
      const { locationName } = courtInfo;
      return (
        <CourtMarker
          key={ keyMaker(locationName) }
          courtInfo={ courtInfo }
          mouseOverOutHandler={ onMouseOverAndOutOfMarker }
        />            
      );
    });
  }, [searchedCourts]);
// ..

// CourtMarker.js
const CourtMarker = ({ mouseOverOutHandler, courtInfo }) => {
  const { marker } = defaultMapOptions;
  const { selectedCourt } = useSelector(state => state.storeOnSelection);

  //..

  return (
    <>
      <Marker 
        position={ createFullCoordinate(courtInfo) }
        onMouseOver={ mouseOverOutHandler(courtInfo) }
        onMouseOut={ mouseOverOutHandler() }
        cursor='pointer'
        icon={ isSelectedCourt ? null : marker }
      /> 
    </>
  );
};
```
##### 특정 위치정보 선택 전
![capture1](https://user-images.githubusercontent.com/37759759/71589883-e282ba00-2b69-11ea-9ddd-1b2a45a27f81.JPG)

##### 특정 위치 정보 선택 후
![capture2](https://user-images.githubusercontent.com/37759759/71589896-eca4b880-2b69-11ea-811f-de120443e2b9.JPG)

`useSelector`로 전달받은 `selectedCourt`가 바로 선택된 위치 정보이고 Global Store에서 전달받은 state와 비교하여 `icon` props의 값만 변경해 주기 때문에 해당 컴포넌트만 리렌더링할 수 있어 지도상의 깜빡임 현상을 제거할 수 있었다. 이를 통해 UX 측면에서도 이점을 얻을 수 있다.

이 방법이 효율적인 방법이 아닐 수도 있다. 앞으로도 계속 검증하고 더 나은 로직이 있는지 확인해볼 것이다. 하지만, 이런 문제를 처음 맞딱뜨렸을 때 해결책이 바로 떠오르지는 않는 부분이고, 정리를 해 둔다면 추후 내가 생각했던 로직이 효율적인지 확인해 볼 수 있고 누군가 이와 같은 문제를 마주쳤을 때 도움이 될 수 있기 때문에 반드시 정리하고 공유하고 싶은 내용이다.


## 도움받은 문서

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
