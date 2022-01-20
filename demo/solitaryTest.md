## Solitary Test
```js
// Solitary test DEMO

import { addBug, bugAdded } from "../bugs";
import { apiCallBegan } from "../api";

// define a group of test "bugsSlice"
describe("bugsSlice", () => {
  // define a group of test "action creators"
  describe("action creators", () => {
    // define a test "addBug"
    it("addBug", () => {
      const bug = { description: "a" };
      const result = addBug(bug);
      const expected = {
        type: apiCallBegan.type,
        payload: {
          url: "/bugs",
          method: "post",
          data: bug,
          onSuccess: bugAdded.type,
        },
      };
      expect(result).toEqual(expected);
    });
  });
});

```