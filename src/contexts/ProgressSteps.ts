import { isDev } from '@/config';

export enum ProgressSteps {
  StepStart,
  StepEquationStart,
  StepSelectSourceColunn,
  StepEquationSemicolon,
  StepSelectTargetRange,
  StepDone,
}

/** Progress steps order */
export const progressStepsSequence = [
  // The order of steps
  ProgressSteps.StepStart,
  ProgressSteps.StepEquationStart,
  ProgressSteps.StepSelectSourceColunn,
  ProgressSteps.StepEquationSemicolon,
  ProgressSteps.StepSelectTargetRange,
  ProgressSteps.StepDone,
];

export const initalProgressStep = isDev
  ? ProgressSteps.StepSelectTargetRange // DEBUG
  : ProgressSteps.StepStart;
