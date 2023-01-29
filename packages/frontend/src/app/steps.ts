export type Step = "Select Apps" | "Export" | "Finished";
export type Steps = Record<string, Step>;
export type StepOrderMapping = Record<Step, string>;

export const stepsByOrder: Steps = {
  0: "Select Apps",
  1: "Export",
  2: "Finished",
};
export const numOfSteps = Object.keys(stepsByOrder).length;

// invert Steps from value to key
export const stepOrderMapping: StepOrderMapping = Object.entries(stepsByOrder).reduce(
  (prev, [key, val]) => ({ ...prev, [val]: key }),
  {} as StepOrderMapping,
);

export const getNextStep = (curStep: number): number => (curStep + 1) % numOfSteps;
