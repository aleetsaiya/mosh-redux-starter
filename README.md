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

+ `index.js`: 發出 dispatch, subscribe, getState 的檔案
+ `reducer.js`: 建立 reducer
+ `store.js`: 建立 store
+ `customStore.js`: 親手建立簡單版的 store 內部
+ `actionTypes.js`: 統一管理 reducer 處理的各種 action type，為 actionTypes 的接口
+ `actionCreater.js`: 協助送出 dispatch 的細節
