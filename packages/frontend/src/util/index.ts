import Papa from "papaparse";

export const combineClassNames = (classNames: (string | boolean)[]) =>
  classNames.filter(Boolean).join(" ");

const createBlobURL = (text: string, mimeType: string) => {
  const blob = new Blob([text], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  return url;
};

// const downloadFromURL = (url: string, filename: string) => {
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = filename;
//   link.click();
// };

export const prepareBlobURL = (
  data: Array<Record<string, unknown>>,
  mimeType: string,
  onURLCreation?: (url: string) => void,
) => {
  const text = mimeType === "text/csv" ? Papa.unparse(data) : JSON.stringify(data);
  const url = createBlobURL(text, mimeType);
  console.log("blob url is:", url);
  if (onURLCreation) onURLCreation(url);
  return url;
};
