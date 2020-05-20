---
title: "올바른 스킬 알고리즘 풀이"
date: '2019-11-19T14:11:11.000Z'
template: "post"
draft: false
slug: 'algorithm-right-skill-trees'
category: 'ALGORITHM'
tags:
  - 'Programmers'
  - 'Algorithm'
  - 'Javascript'

description: 프로그래머스 알고리즘 문제를 풀고 이를 정리하였다. 주제는 스킬 트리로, 쉽게 게임에서 선행 스킬을 배워야만 다음 스킬을 배울 수 있는 알고리즘으로 제공되는 여러가지 Skill Tree가 제시된 Skill 순서에 맞는지 확인하는 알고리즘이다. 해당 문제는 프로그래머스에서 제공하는 문제다.
---

## 문제
함수의 인자로 `skill`과 `skill_trees`를 받고, skill은 선행되어야 할 skill들의 순서이며, skill_trees는 유저가 찍으려는 skill 순서도를 나타낸 결과물의 배열이라고 생각하면 될 것같다.
예를 들어, `skill = 'CBD'` 라면 C -> B -> D 순서로 스킬이 반드시 찍혀야되며, `skill_trees = ["BACDE", "CBADF", "AECB", "BDA"]`에서 올바른 스킬트리는 2개이다. 다른 스킬들은 어떻게 찍히던 상관 없다.

## 제한조건
- 스킬은 알파벳 대문자로 표기하며, 모든 문자열은 알파벳 대문자로만 이루어져 있습니다.
- 스킬 순서와 스킬트리는 문자열로 표기합니다.
  - 예를 들어, C → B → D 라면 CBD로 표기합니다
- 선행 스킬 순서 skill의 길이는 1 이상 26 이하이며, 스킬은 중복해 주어지지 않습니다.
- skill_trees는 길이 1 이상 20 이하인 배열입니다.
- skill_trees의 원소는 스킬을 나타내는 문자열입니다.
  - skill_trees의 원소는 길이가 2 이상 26 이하인 문자열이며, 스킬이 중복해 주어지지 않습니다.

## 생각한 풀이 방법
객체에 skill 프로퍼티를 생성하고 반복문으로 skill tree들과 비교도 해보며 여러가지 시행착오를 겪었지만, 동료와 함께 풀면서 stack이나 queue를 사용하는 것이 어떤지 고민했고, queue를 사용해 하나씩 뽑아서 만약 skill tree에 있다면 그 선행 skill과 맞는지 비교하는 방법으로 풀었다.

```javascript
function solution(skill, skill_trees) {
    let answer = 0;

    skill_trees.forEach(skillTree => {
        const skillStack = [...skill];

        const isRightTree = [...skillTree].every((skillUnit) => {
            if(skillStack.indexOf(skillUnit) > -1) {
                const nextSkill = skillStack.shift();
                return nextSkill === skillUnit;
            }
            return true;
        });

        if(isRightTree) answer++;
    });

    return answer;
}
```

> 공부한 내용을 정리하는 공간으로 학습 중 습득한 내용이 정확하지 않은 정보를 포함할 수 있어 추후 발견시 수정하도록 하겠습니다.

---
