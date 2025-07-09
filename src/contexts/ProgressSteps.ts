import { isDev } from '@/config';

export enum ProgressSteps {
  StepStart,
  StepEquationStart,
  StepSelectSourceColunn,
  StepEquationSemicolon,
  StepSelectLookupRangeStart,
  StepSelectLookupRangeFinish,
  StepDone,
}

/** Progress steps order */
export const progressStepsSequence = [
  // The order of steps
  ProgressSteps.StepStart,
  ProgressSteps.StepEquationStart,
  ProgressSteps.StepSelectSourceColunn,
  ProgressSteps.StepEquationSemicolon,
  ProgressSteps.StepSelectLookupRangeStart,
  ProgressSteps.StepSelectLookupRangeFinish,
  ProgressSteps.StepDone,
];

export const initalProgressStep = isDev
  ? ProgressSteps.StepSelectLookupRangeStart // DEBUG
  : ProgressSteps.StepStart;
