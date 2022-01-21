// Social test DEMO

// Use fake server to replace remote server
// because uni test test the application without external dependencies
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import { addBug, resolveBug, loadBugs, getUnresolvedBugs } from "../bugs";
import configureStore from "../configureStore";
import { conforms } from "lodash";

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  // init before each test
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;
  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

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

  it("sould mark the bug as resolved if it's save to the server", async () => {
    fakeAxios.onPost(`/bugs`).reply(200, { id: 1 });
    fakeAxios.onPatch(`/bugs/1`).reply(200, { id: 1, resolved: "true" });

    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(resolveBug(1));

    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it("sould not mark the bug as resolved if it's not save to the server", async () => {
    fakeAxios.onPost(`/bugs`).reply(200, { id: 1 });
    fakeAxios.onPatch(`/bugs/1`).reply(500);

    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(resolveBug(1));

    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  describe("loading bugs", () => {
    describe("if the bugs exit in the cache", () => {
      it("they should not be fetched from the server again", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
      });
    });
    describe("if the bugs don't exit in the cache", () => {
      it("they should be fetched from the server and put in the store", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toHaveLength(1);
      });

      describe("loading indicator", () => {
        it("should be true while fetching the bug", () => {
          fakeAxios.onGet("/bugs").reply(() => {
            expect(bugsSlice().loading).toBe(true);
            return [200, [{ id: 1 }]];
          });

          store.dispatch(loadBugs());
        });

        it("should be false after the bug are fetched", async () => {
          fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });

        it("should be false if the server returns an error", async () => {
          fakeAxios.onGet("/bugs").reply(500);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  describe("selector", () => {
    it("getUnresolvedBugs", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 },
      ];

      const result = getUnresolvedBugs(state);

      expect(result).toHaveLength(2);
    });
  });
});
