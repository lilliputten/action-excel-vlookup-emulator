import { isDev } from '@/config';

export enum ProgressSteps {
  StepStart,
  StepEquationStart,
  StepSelectSourceColunn,
  StepDone,
}

/** Progress steps order */
export const progressStepsSequence = [
  // The order of steps
  ProgressSteps.StepStart,
  ProgressSteps.StepEquationStart,
  ProgressSteps.StepSelectSourceColunn,
  ProgressSteps.StepDone,
];

export const initalProgressStep = isDev
  ? ProgressSteps.StepEquationStart // DEBUG
  : ProgressSteps.StepStart;
