import reducer, { opened, closed } from "../../features/windowOpener";

describe("windowOpener.slice", () => {
  test("should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      target: "",
      isOpened: false,
    });
  });

  test("should open and close", () => {
    const previousState = {
      target: "",
      isOpened: false,
    };
    const linkToOpen = "http://test.com";
    const secondState = { target: linkToOpen, isOpened: true };
    expect(reducer(previousState, opened(linkToOpen)))
      .toEqual(secondState);
    expect(reducer(secondState, closed()))
      .toEqual({ target: linkToOpen, isOpened: false });
  });
});
