# Mosh Course - Redux Starter File

## redux 架構
1. 建立 reducer，需要 currentState, action 作為參數，根據不同的 action types 來更新 store 中的 state 並回傳
2. 建立 store，需要 reducer 作為參數，為主程式接口，負責處理主程式發出的 `dispatch`, `subscribe`, `getState` 等動作
3. 主程式對 store 進行 `dispatch`, `subscribe`, `getState` 等動作

## dispatch, subscribe, getState
dispatch: 根據不同的 action 來更新 store 中的 state  
subscribe: 參數為一 `function`，代表當 store 中的 state 更新時，需要做的事情  
getState: 獲得當前 store 中的 state

## 檔案:
### src folder: 
+ `index.js`: 發出 dispatch, subscribe, getState 的檔案
+ `reducer.js`: 建立 reducer
+ `store.js`: 建立 store
+ `customStore.js`: 親手建立簡單版的 store 內部
+ `actionTypes.js`: 統一管理 reducer 處理的各種 action type，為 actionTypes 的接口
+ `actionCreater.js`: 協助送出 dispatch 的細節

### duck-pattern
使用 duck-pattern 的結構時，會把 actionCreater, actionTypes, reducer 三個檔案合併放在同一個檔案裡
```diff
src folder:
- bugs
- |-- actionTypes.js
- |-- actionCreater.js
- |-- reducer.js
+ bugs.js
```

## Extension
Redux DevTools: [link](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=zh-TW)

使用時要在 create store 加上參數:
```diff
const store = createStore(
  reducer,
+  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```
參考: [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension#1-with-redux)

Redux Toolkit:
```bash
npm install @reduxjs/toolkit
```

使用 redux toolkit 可以幫助我們建立之前手動建立的 `reducer`、`actionTypes``、actionCreater`。

原本的 actionTypes + actionCreater > `createAction`: 
```js
import { createAction, createReducer } from "@reduxjs/toolkit";

// Action Creators + Action Types
export const bugAdded = createAction("bugAdded");
export const bugResolved = createAction("bugResolved");
export const bugRemoved = createAction("bugRemoved");
```
`createActions` 會根據我們傳入的 `typeName` 回傳一個 function，執行這個 function 並傳入 `argument` 會收到
```js
{
  type: typeName,
  payload: {
    // your argument
  }
}
```
原本的 reducer > `createReducer`:
```js
export default createReducer([], {
  // actions: function (event => event handler)
  // added
  [bugAdded.type]: (bugs, action) => {
    bugs.push({
      id: ++lastId,
      description: action.payload.description,
      resolved: false,
    });
  },
  // resolved
  [bugResolved.type]: (bugs, action) => {
    const index = bugs.findIndex((bug) => bug.id === action.payload.id);
    bugs[index].resolved = true;
  },
  // removed
  [bugRemoved.type]: (bugs, action) => {
    const index = bugs.findIndex((bug) => bug.id === action.payload.id);
    bugs.splice(index, 1);
  },
});
```

也可以將三個合併再一起寫 (`createAction` + `createReducer`) > `createSlice`:
```js
import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;

const slice = createSlice({
  name: "bugs",
  initialState: [],
  reducers: {
    // actions => action handlers
    bugAdded: (bugs, action) => {
      bugs.push({
        id: ++lastId,
        description: action.payload.description,
        resolved: false,
      });
    },
    bugResolved: (bugs, action) => {
      const index = bugs.findIndex((bug) => bug.id === action.payload.id);
      bugs[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      const index = bugs.findIndex((bug) => bug.id === action.payload.id);
      bugs.splice(index, 1);
    },
  },
});

export const { bugAdded, bugResolved, bugRemoved } = slice.actions;
export default slice.reducer;

```

## Reducer architecture
  <!-- insert reducer architecture image -->
### combineRedcers
建立多個 reducer 管理不同的 state，然後最後再將這些 reducer `combine`
```js
import { combineReducers } from "redux";
import projectsReducer from "./projects";
import bugsReducer from "./bugs";

export default combineReducers({
  bugs: bugsReducer,
  projects: projectsReducer,
});
```

### selector
可以在每個 `reducer slice` 的檔案中增加 selector，幫助我們選擇特定的 state
```js
// Selector
export const getUnresolvedBugs = (state) =>
  state.entities.bugs.filter((bug) => !bug.resolved);
```

利用套件可以讓我們將 output 儲存起來，如果下一次 input 沒有變動的話，就使用上一次儲存的結果回傳
```js
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs, // output of this function will pass to the next function
  (bugs) => bugs.filter((bug) => !bugs.resolved) // if the parameter "bugs" do not change, the bug filter won't execute, will use the result from the cache
);

```