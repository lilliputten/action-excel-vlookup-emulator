import { isDev } from '@/config';
import {
  editedLookupRangeName,
  expectedColumnNumber,
  expectedIntervalValue,
  lookupRangeName,
  sourceCellName,
} from '@/constants/ExcelEmulator';

export enum ProgressSteps {
  StepStart,
  StepEquationStart,
  StepSelectSourceColumn,
  StepEquationSemicolon,
  StepSelectLookupRange,
  StepEditLookupRange,
  StepAddColumnNumber,
  StepAddInterval,
  StepFinishEquation,
  StepExtendResults,
  StepDone,
}

/** Progress steps order */
export const progressStepsSequence = [
  ProgressSteps.StepStart,
  ProgressSteps.StepEquationStart,
  ProgressSteps.StepSelectSourceColumn,
  ProgressSteps.StepEquationSemicolon,
  ProgressSteps.StepSelectLookupRange,
  ProgressSteps.StepEditLookupRange,
  ProgressSteps.StepAddColumnNumber,
  ProgressSteps.StepAddInterval,
  ProgressSteps.StepFinishEquation,
  ProgressSteps.StepExtendResults,
  ProgressSteps.StepDone,
];

export const defaultStepsValues: string[] = [
  ``,
  ``,
  `=ВПР(`,
  `=ВПР(${sourceCellName}`,
  `=ВПР(${sourceCellName};`,
  `=ВПР(${sourceCellName};${lookupRangeName}`,
  `=ВПР(${sourceCellName};${editedLookupRangeName}`,
  `=ВПР(${sourceCellName};${editedLookupRangeName};${expectedColumnNumber}`,
  `=ВПР(${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue}`,
  `=ВПР(${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue})`,
  `=ВПР(${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue})`,
];

const __useDebug = true;
export const initalProgressStep =
  __useDebug && isDev
    ? ProgressSteps.StepAddColumnNumber // DEBUG
    : ProgressSteps.StepStart;
