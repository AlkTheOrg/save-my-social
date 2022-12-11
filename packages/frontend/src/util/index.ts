export const combineClassNames = (classNames: (string | boolean)[]) =>
  classNames.filter(Boolean).join(" ");
