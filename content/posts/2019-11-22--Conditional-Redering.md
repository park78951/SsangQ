---
title: '조건부 렌더링 vs display none'
date: '2019-11-22T19:21:09.000Z'
template: 'post'
draft: false
slug: 'conditional-rendering-vs-diplay-none'
category: 'JAVASCRIPT'
tags:
  - 'Conditional Redering'
  - 'React'
  - 'Javascript'
  - 'display none'

description: 프로젝트를 진행하면서 조건부 렌더링과 display none을 사용한 렌더링의 차이점을 정리하고자한다. 최적화를 위해 차이점을 비교하며 더 나은 렌더링 방식을 선택하려한다.
---

현재 프로젝트를 진행하면서 검색 필터링 기능을 구현하고있다. 구현하다보니 필터링 주제별로 ***4가지의 버튼***이 있고, 이 버튼에 따라 같은 형태의 내용만 다른 ***메뉴 컴포넌트***를 렌더링해야할 필요가 있었다. 최초 설계 했을 때와 다르게 코드를 작성하면서 변경할 필요성을 느낀점과 새롭게 알게된 점에 대해 정리하고자 한다.

## display: none

처음 설계하면서부터 컴포넌트를 flag 변경에 따라 styled-components에 변수로 전달해 display none을 하는 방식으로 렌더링을 진행했다. 하지만 React Dev Tools로 확인했을 때, 컴포넌트가 새롭게 렌더링 될 때마다 하위 요소들이 전부 새롭게 렌더링 되는 점을 발견했다. 성능에는 눈에 띌 정도로 문제가 발생하지는 않지만, 최적화 측면에서 좋지 않다는 것을 확실히 알 수 있었다.

위에 설명한 부부을 아래 사진으로 확인 할 수 있다.

![2019-11-22-22-45-57](https://user-images.githubusercontent.com/37759759/69438877-2de6c300-0d89-11ea-8ad4-c7f445ee3ba1.gif)

화살표 버튼으로 해당 필터 메뉴를 Toggle 했을 땐 필터 메뉴의 상위 컴포넌트를 display none으로 숨기다보니 그 하위 컴포넌트 및 요소는 `React.memo`의 영향을 받아 렌더링이 다시 일어나지 않는 것 같았지만 **(정확하지 않아 혹시 알게되면 추후 수정하도록 하겠습니다.)**, 버튼을 눌렀을 때는 해당 메뉴 컴포넌트 (Flag에 따라 변경되는)의 하위요소가 모두 다시 렌더링 되는 것을 확인할 수 있다. 이때 작성한 코드는 아래와 같다.

- Filter Menu부분의 최상단 컴포넌트 [FilterDetail]
```javascript
/*
...
*/
return (
    <ThemeProvider theme={ buttonTheme }>
        <Style.DetailWrapper filterFlag={ filterFlag }> //filterFlag가 화살표 버튼의 Flag
            <Location 
                activeBtn={ activeBtn }
                setFilterData={ setFilterData }
            />
            <Keywords 
                activeBtn={ activeBtn }
                setFilterData={ setFilterData }
            />
            <Recommendation
                activeBtn={ activeBtn }
                setFilterData={ setFilterData }
            />
            <Level 
                activeBtn={ activeBtn }
                setFilterData={ setFilterData }
            />
/*
...
*/
``` 
- 하위컴포넌트 중 하나인 [Location] (모든 컴포넌트의 html 구조는 동일)
```javascript
return (
    <Style.RecommendWrapper 
      activeBtn={ activeBtn } // activeBtn이 주제별 버튼의 Flag
      className='dropdown__menus'
    >
      { dropdownList }
    </Style.RecommendWrapper>
```
- Flag에 따라 변경되는 Style 부분
```
display: ${({ filterFlag }) => !filterFlag && 'none'};
display: ${({ activeBtn }) => activeBtn !== 'recommendation' && 'none' };
```

display none은 DOM Tree에 반영은 되지만 Render Tree에 반영되지 않는 특성이 있다. 이 때문에 당연히 개발자 도구에서 Filter Menu 컴포넌트들이 추가된 것을 확인할 수 있다. (Location, Keywords, Recommendation, Level)

![displayNone](https://user-images.githubusercontent.com/37759759/69441170-8750f100-0d8d-11ea-8319-d55d2c13c646.JPG)

React Dev Tools `Components` Tab에서도 Rendering이 이미 되어 있는 것을 확인할 수 있다.

![displayNone2](https://user-images.githubusercontent.com/37759759/69441362-edd60f00-0d8d-11ea-8da4-54874669a01f.JPG)

당연하겠지만, DOM TREE에 있는 것은 이미 자원을 소비하고 있는 것이라고 생각했다. 또한 불필요하게 하위 요소를 포함한 모든 컴포넌트의 Re-rendering이 빈번하게 일어난다면, 이 또한 최적화가 필요할 것이라고 생각했다. 그렇게 조건부 렌더링으로 변경하게 되었다.

## Conditional Rendering (조건부 렌더링)

[조건부 렌더링](https://ko.reactjs.org/docs/conditional-rendering.html)은 쉽게 말해서 `return flag && <Component />`와 같은 방법으로 flag가 true일 때 컴포넌트를 Rendering 하는 방법이다. 조건부 렌더링을 적용하기 전에 예상했던 것은 조건부 렌더링은 조건에 따라 컴포넌트 또는 요소를 Rendering 해주기 때문에 `display: none`의 방식과 같이 DOM Tree에 추가되는 현상은 없을 것으로 판단했다. 그렇게 적용을 하고 난 결과는 내 예상과 같았다.

아래의 사진에서 각 Menu 컴포넌트의 하위요소는 다시 Re-rendering이 발생하지 않는 것을 볼 수 있다.
![2019-11-22-23-17-41](https://user-images.githubusercontent.com/37759759/69442376-d861e480-0d8f-11ea-80fa-711726e1d598.gif)

각 Menu 컴포넌트는 당연히 새롭게 렌더링이 되는 것이기 때문에 Re-rendering이 되는 것이 맞지만 내부 요소들은 React.memo를 통해 memoized된 상태이기 때문에 Re-rendering이 발생하지 않는 다고 생각한다.

다음은 DOM의 구조를 확인할 수 있다.
![Conditional1](https://user-images.githubusercontent.com/37759759/69442733-6d64dd80-0d90-11ea-9d55-bd6e68939367.JPG)

`display: none`의 방식에서 4개의 컴포넌트가 모두 렌더링된 것과는 다르게 Menu 컴포넌트 하나와 버튼 UI만 Rendering된 것을 확인할 수 있다.

하지만 조금 예상 밖이었던 것은, 아래 사진과 같이 React Dev Tools의 `Components` Tab에서는 4개의 컴포넌트를 확인할 수 있는 점이였다..
![2019-11-22-23-20-46](https://user-images.githubusercontent.com/37759759/69443153-33480b80-0d91-11ea-829c-32e4c091711a.png)

리팩토링을 위해 코드를 점검해보니, `display: none` 방식의 위와 같은 형태처럼 flag를 넘겨주고 각 Menu 컴포넌트 내에서 조건부 렌더링을 걸어준 것이 문제라는 것을 발견했다.

아래 그 문제의 코드를 확인할 수 있다.

```javascript
<Location 
    activeBtn={ activeBtn }
    setFilterData={ setFilterData }
/>
```
```javascript
return activeBtn === 'location' && (
    <div
      className='dropdown__menus'
    >
      <FilterMenu 
        menuTitle='도시명'
        onChange={ ({ target }) => setCity(target.value) }
        optionValues={ cities }
      />
      <FilterMenu 
        menuTitle='군/구'
        onChange={ ({ target }) => setGu_nm(target.value)}
        optionValues={ locationDetail[city] }
      />
    </div>
  );
```

## 해당 UI 최상단 컴포넌트에서 Conditional Rendering 적용하기

이 문제를 해결하기 위해서 Menu 컴포넌트들을 관리하는 최상단 컴포넌트 [FilterDetail] 컴포넌트에서 조건부 렌더링을 적용시키려고 시도했다. 결과는 예상과 같았다. 다른 부분은 모두 위의 설명과 같았고, 문제시 되었던 React Dev Tools `Components` Tab에서의 4개 컴포넌트가 렌더된 것은 명확하게 해결한 것을 확인할 수 있었다.

먼저 코드는 아래와 같이 useMemo와 Switch 문을 활용해 작성했다.

```javascript
const filterRenderer = useMemo(() => {
    switch(activeBtn) { // 각 Menu 컴포넌트에 대한 Flag
      case 'location':
        return (
          <Location 
            setFilterData={ setFilterData }
          />
        );
      case 'keywords':
        return(
          <Keywords 
            setFilterData={ setFilterData }
          />
        );
      case 'recommendation':
        return (
          <Recommendation
            setFilterData={ setFilterData }
          />
        );
      case 'level':
        return (
          <Level 
            setFilterData={ setFilterData }
          />
        );
      default:
        break;
    }
  }, [activeBtn]);
```
```
 return filterFlag && ( // 화살표 버튼에 대한 Flag
    <ThemeProvider theme={ buttonTheme }>
      <Style.DetailWrapper>
        { filterRenderer }
/*
.
.
.
*/
```

아래는 그 결과에 따른 Render 결과이다.

![Conditional2](https://user-images.githubusercontent.com/37759759/69444112-0694f380-0d93-11ea-8263-1ddb07df0b61.JPG)

위의 사진에서 보시다시피 Location 하나의 Component만 Rendering 되었다.

하지만, React Dev Tools의 Profiler Tab을 확인했을 때는 `Context.consumer` 컴포넌트의 호출시간이 각 Menu 컴포넌트에서 Flag를 사용했을 때 보다 길게 나왔는데, 사실 Profiler의 사용법은 아직 거의 습득하지 못해서 추후 학습하며 수정이 필요하다면 수정해 나가도록 해야겠다.

## Rendering의 차이점을 확인해보면서..

일단 컴포넌트를 호출해서 그 컴포넌트 안에서 조건부 렌더링으로 처리한 것이기 때문에 어쩌면 너무나도 당연한 문제였을 수도 있다. 하지만 경험이 없었던 터라 이런 부분에 대해 명확하게 머릿속에 새긴 기회가 되어 매우 좋았고, 정리하면서 조금은 미흡했던 개념을 잡을 수 있어 좋았다. 아직 프로젝트에 이런 Rendering이 최적화되지 못한 컴포넌트들이 많은데, Filter UI를 완성하고 나면 Refactoring의 시간을 갖는 것이 좋을 것 같다.

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
