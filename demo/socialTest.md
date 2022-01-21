## Social Test
social test 用來測試功能整合是否有正常運作。底下可以注意到因為我們有使用 api middleware，它會回傳一個 `Promise`，而若是在 apiMiddleware 前面的 middlware 沒有 `return next(action)`，我們在測試的程式碼 `store.dispatch(addBug(bug))` 前加上 `await` 就沒有用 ( 因為前面的 middleware 沒有把 `Promise` 回傳回去，因此 `await` 不會接收到 `Promise`，而是 `undefined` )，因此要注意每個 middleware 是否有確實回傳結果。
```js
// Social test DEMO
import { addBug } from "../bugs";
import configureStore from "../configureStore";

describe("bugsSlice", () => {
  it("sould handle the addBug action", async () => {
    const store = configureStore();
    const bug = { description: "a" };
    // because we have a api middleware, and it will return a
    // Promise. We have to add "return" to every middleware in
    // in front of apiMiddleware, and here we use "await" to
    // wait this promise
    await store.dispatch(addBug(bug));
    // expect the we already added a bug (length == 1)
    expect(store.getState().entities.bugs.list).toHaveLength(1);
  });
});

```

底下為在 apiMiddleware 前的 middleware ( toastify ): 
```diff
const toastify = (store) => (next) => (action) => {
  if (action.type === "error") console.log("Toastify:", action.payload.message);
  else {
-    next(action)
+    return next(action); // will reveive a promise from apiMiddleware then return
  }
};

export default toastify;

```

上述的測試有使用到外部 server 給我們回傳結果 ( 當 server 有問題時 test 會出錯 ) ，而 uni test 因該純粹使用內部資源，因此改用套件 `axios-mock-adapter` 來幫助我們測試 request，並使用 `AAA Pattern` 讓程式碼更好看。

```js
// Social test DEMO

// Use fake server to replace remote server
// because uni test test the application without external dependencies
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import { addBug } from "../bugs";
import configureStore from "../configureStore";

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  // init before each test
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  it("sould add the bug to the store if it's saved to the server", async () => {
    // AAA (Arange, Act, Assert) pattern
    // Arange
    const bug = { description: "a" };
    const saveBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, saveBug);

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugsSlice().list).toContainEqual(saveBug);
  });
  it("sould not add the bug to the store if it's not saved to the server", async () => {
    // AAA design
    // Arange
    const bug = { description: "a" };
    fakeAxios.onPost("/bugs").reply(500);

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugsSlice().list).toHaveLength(0);
  });
});

```