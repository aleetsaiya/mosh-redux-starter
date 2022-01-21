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
    const bug = { description: "a" };
    fakeAxios.onPost("/bugs").reply(500);

    await store.dispatch(addBug(bug));

    expect(bugsSlice().list).toHaveLength(0);
  });
});
