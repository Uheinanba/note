- 可以使用内置的yield*操作符来组合多个sagas,是的它们保持顺序
```
function* g1(getState) {}
function* g2(getState) {}
function* g3(getState) {}

function* game(getState) {
  const score1 = yield* g1(getState);
  put(showScore(score1));

  const score2 = yield* g1(getState);
  put(showScore(score2));

  const score3 = yield* g1(getState);
  put(showScore(score3));
}
```