# Mosh Course - Redux Starter File

## 目錄
+ [redux 架構](#redux-架構)   
+ [dispatch, subscribe, getState](#dispatch-subscribe-getstate)  
+ [Extensison](#extension)  
+ [Multiple Reducers](#multiple-reducers)  
+ [Middleware](#middleware)  
+ [Testing redux application](#testing-redux-application)


## redux 架構
1. 建立 reducer，需要 currentState, action 作為參數，根據不同的 action types 來更新 store 中的 state 並回傳
2. 建立 store，需要 reducer 作為參數，為主程式接口，負責處理主程式發出的 `dispatch`, `subscribe`, `getState` 等動作
3. 主程式對 store 進行 `dispatch`, `subscribe`, `getState` 等動作

## dispatch, subscribe, getState
dispatch: 根據不同的 action 來更新 store 中的 state  
subscribe: 參數為一 `function`，代表當 store 中的 state 更新時，需要做的事情  
getState: 獲得當前 store 中的 state

## 檔案:
> 課堂中各檔案的意思
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
> 介紹到的 redux extension
### Redux DevTools: [link](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=zh-TW)

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

使用 redux toolkit 可以幫助我們建立之前手動建立的 `reducer`、`actionTypes``、actionCreater` 以及 `createStore`。

`createStore` :
```js
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";

export default function () {
  // when use configureStore, we don't need to check redux devTool extension
  return configureStore({ reducer });
}

```  

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

## Multiple Reducers
<img width="573" alt="Reducer" src="https://user-images.githubusercontent.com/67775387/149883054-0b5d39c6-8cc6-468d-b60d-4d6c5b033882.png">

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

利用套件 `reselect` 可以讓我們將 output 儲存起來，如果下一次 input 沒有變動的話，就使用上一次儲存的結果回傳
```js
import { createSelector } from "reselect";
// Memoization
// when the input not change, use the output from the cache (do not recalculate)
// here we use "reselect" (npm install reselect)
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs, // output of this function will pass to the next function
  (bugs) => bugs.filter((bug) => !bugs.resolved) // if the parameter "bugs" do not change, the bug filter won't execute, will use the result from the cache
);

```
## Middleware
middleware 是我們從 dispatch 到 root reducer 的過程中所添加的程式

### create Middleware
1. 建立一個 middleware 資料夾 (使用這個名稱命名資料夾，資料夾 icon 會是不一樣的 ⚡)
2. 建立 middleware 檔案

使用 `currying` 表示接收三個參數 ( `store`, `next`, `action` ) 的函數
```js
// next: next is the reference to the "next middleware function",
// if this's the only middleware function we have, next is going
// to be the reducer that is going to handle this action
const logger = (store) => (next) => (action) => {
  console.log("store", store);
  console.log("next", next);
  console.log("action", action);
};

export default logger;

```

3. 於 createStore 的檔案內，增加 middleware (middleware: array of middleware)
```diff
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
+ import logger from "./middleware/logger";

export default function () {
  return configureStore(
    { reducer, 
+      middleware: [logger] 
    }
  );
}

```
> 如果要在 middleware 傳入參數的話 (除了 store, next, action 的參數)，在 store 前面再加一個 param，並在 createStore 中的 middleware 傳入參數

```js
// in middleware file
const logger = (param) => (store) => (next) => (action) => {
  console.log(param);
};

export default logger;

// in createStore file
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";

export default function () {
  return configureStore({ reducer, middleware: [logger("my param")] });
}
```

### Thunk middleware

平常我們 `dispatch` 時，我們只能 dispatch 一個 object，而 `thunk middleware` 就是透過 middleware 使我們達成 **"不僅可以 dispatch object，還可以 dispatch 一個 function"**。通常來說我們在製作一個 thunk middleware 時會需要傳 2 個參數，分別是 `store` 以及 `getState`，底下為自製一個 thunk middleware:

```js
// middleware/func.js
const func = (store) => (next) => (action) => {
  // 如果 action type 是 function 的話，就執行這個 function 並傳入 dispaych 以及 getState
  if (typeof action === "function") action(store.dispatch, store.getState);
  // 不是 function 就繼續送往下一個 middleware
  else next(action);
};

export default func;
```

製作完 thunk middleware 後，將他加入至 store 中
```js
// store/configureStore.js
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import func from "./middleware/func";

export default function () {
  return configureStore({ reducer, middleware: [func] });
}

```

除了上面自己做一個 thunk middleware，我們可以使用 [redux-thun](https://github.com/reduxjs/redux-thunk)。如果我們專案是使用 `redux toolkit` 的話，只需要在 configureStore 中的 middleware 內加入 `...getDefaultMiddleware()`，就可以使用他們做好的 thunk middleware。

```diff
// store/configureStore.js
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
- import func from "./middleware/func";

export default function () {
  return configureStore({
    reducer,
-    middleware: [func]
+    middleware: [...getDefaultMiddleware()],
  });
}

```

More about thunk: [讓你的Action能作更多 — Redux-Thunk](https://medium.com/frochu/%E9%80%81%E8%AE%93%E4%BD%A0%E7%9A%84action%E8%83%BD%E4%BD%9C%E6%9B%B4%E5%A4%9A-redux-thunk-c07bc5488e48)

### combine with API
將 middleware 結合發送 api:

1. 建立 action ( `createAction` ) 負責統一處理 action type:

```js
// store/api.js
import { createAction } from "@reduxjs/toolkit";

export const apiRequest = createAction("apiRequest"); // 送出 api request 的 action
export const apiCallSuccess = createAction("apiCallSuccess"); // request success 的 action
export const apiCallFailed = createAction("apiCallFailed"); // request failed 的 action

```
2. 建立 middleware，用來處理當我們從主程式收到 `api dispatch` 時要做的事情

```js
// store/middleware/api.js
import axios from "axios";
import * as actions from "../api";

const api = (store) => (next) => async (action) => {
  // 如果送出的 action type 不是 apiRequest，那就送至下一個 middleware 並跳出
  if (action.type !== actions.apiRequest.type) {
    next(action);
    return;
  }
  // action type 是 apiRequest，把接收到的 action payload 提取出來
  const { url, method, data, onSuccess, onError } = action.payload;
  // 將原 dispatch (apiRequest) 繼續送往下一個 middleware / reducer
  next(action);
  try {
    // 根據收到的 action payload，送出 request
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url,
      method,
      data,
    });
    // 如果收到的 action payload 中沒特別設定 request success 的 action type 的話，就 dispatch 預設的 success action type
    store.dispatch(actions.apiCallSuccess(response.data));
    // 如果有特別設定 request success 的 action type，就依內容送出 dispatch
    if (onSuccess) store.dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    // request 失敗時，送出預設 error dispatch
    store.dispatch(actions.apiCallFailed(error));
    // 有特別設定 request error 的 action type，依內容送出 dispatch
    if (onError) store.dispatch({ type: onError, payload: error });
  }
};

export default api;

```

3. 將 middleware 加入至 store 內
```js
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import toastify from "./middleware/toastify";
import api from "./middleware/api";

export default function () {
  // when use configureStore, we don't need to check redux devTool extension
  return configureStore({ reducer, middleware: [toastify, api] }); // 加入 api middleware
}
```

4. 主程式送出 api dispatch
```js
import configureStore from "./store/configureStore";
// 匯入統一接口的 api action type
import * as actions from "./store/api";

const store = configureStore();
store.dispatch(
  actions.apiRequest({
    url: "/bugs",
  })
);
// 上面的程式碼拆解如下:
// store.dispatch(
//   {
//     type: apiRequest.type,
//     payload: {
//       url: "/bugs"
//     }
//   }
// )
```

( 後續程式碼還有再增加 loading 以及 cache feature，完整版直接看 `src folder` 內程式 )


## Testing Redux Application
### Automated Testing
+ Uni tests
+ Integration tests
+ End-to-end tests 

`Uni test`: test the application without its external dependencies. (fast)  
`Integration test`: slower than uni test, but give us more confidence.  
`End-to-end test`: the most slowest, simple break the UI will break severals end-to-end test.  

### Use Extension 
1. install 
```bash
npm install jest @types/jest @babel/core @babel/preset-env babel-jest --save-dev
```

2. create `babel.config.json` in root folder (cool file icon ⚡)  
3. create `tests` folder to store `spec` file
4. create `testname.spec.js` in test folder ( 在名稱裡面有 `spec` 的，通常來說是一個 test file )
5. 在 package.json 加入:
```diff
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js",
+  "test": "jest"
},
```
5. 執行 `npm run test`

### create test file
常使用到的 function:
+ `describe` (name, fn): 一系列的測試，像是一個 folder 名叫 `name` 的感覺
+ `it` (name, fn): 一個名叫 `name` 測試
+ expect(`a`).toEqual(`b`): 如字面

```js
import { isEven } from "./math";

// define a group of test
describe("isEven", () => {
  // define a test: it (testName, testFunction)
  it("sould return true if given an even number", () => {
    // Function under test (SUT)
    const result = isEven(2);
    expect(result).toEqual(true);
  });

  it("sould return false if given an odd number", () => {
    const result = isEven(1);
    expect(result).toEqual(false);
  });
});

```

### solitary test && social test
solitary test 測試單一檔案是否有正常運作，social test 測試多個檔案合起來有沒有正常

> solitary test 可能會因為太 detail，所以一個小改動 test 就出現錯誤

solitary test demo: [link](https://github.com/aleetsaiya/mosh-redux-starter/blob/master/demo/solitaryTest.md)
