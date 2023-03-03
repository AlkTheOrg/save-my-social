import Papa from "papaparse";
import { combineClassNames, prepareBlobURL } from "../../util";

describe("combineClassNames", () => {
  it("should concatenate multiple class names into a single string", () => {
    const result = combineClassNames(["class1", "class2", "class3"]);
    expect(result).toEqual("class1 class2 class3");
  });

  it("should filter out falsey values from the input array", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-scope
    const result = combineClassNames(["class1", false, "class2", null]);
    expect(result).toEqual("class1 class2");
  });
});

describe("prepareBlobURL", () => {
  const mockCreateObjectURL = jest.fn();
  const originalCreateObjectURL = URL.createObjectURL;

  beforeAll(() => {
    URL.createObjectURL = mockCreateObjectURL;
  });

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL;
  });

  afterEach(() => {
    mockCreateObjectURL.mockReset();
  });

  it("should call createObjectURL with the expected arguments for CSV data", () => {
    const csvData = [{ foo: 1, bar: "baz" }];
    prepareBlobURL(csvData, "text/csv");
    expect(mockCreateObjectURL).toHaveBeenCalledWith(
      expect.any(Blob),
    );
    // getting first call's first argument
    const blob = mockCreateObjectURL.mock.calls[0][0];
    expect(blob.type).toEqual("text/csv");
    expect(blob.size).toBeGreaterThan(0);
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = () => {
      expect(reader.result).toEqual(Papa.unparse(csvData));
    };
  });

  it("should call createObjectURL with the expected arguments for JSON data", () => {
    const jsonData = [{ foo: 1, bar: "baz" }];
    prepareBlobURL(jsonData, "application/json");
    expect(mockCreateObjectURL).toHaveBeenCalledWith(
      expect.any(Blob),
    );
    const blob = mockCreateObjectURL.mock.calls[0][0];
    expect(blob.type).toEqual("application/json");
    expect(blob.size).toBeGreaterThan(0);
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = () => {
      expect(reader.result).toEqual(JSON.stringify(jsonData));
    };
  });

  it("should call the onURLCreation callback with the new URL", () => {
    const callback = jest.fn();
    const jsonData = [{ foo: 1, bar: "baz" }];
    const url = prepareBlobURL(jsonData, "application/json", callback);
    expect(callback).toHaveBeenCalledWith(url);
  });
});
