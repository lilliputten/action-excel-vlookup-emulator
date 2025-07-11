import { isDev } from '@/config';
import {
  editedLookupRangeName,
  equationBegin,
  expectedColumnNumber,
  expectedIntervalValue,
  lookupRangeName,
  sourceCellName,
  substrCellName,
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
  StepExtendRawResults,
  StepSelectEquatonAgain,
  StepAddSubstrColumn,
  StepExtendFinalResults,
  StepDone,
}
export const progressStepsCount = Math.floor(Object.keys(ProgressSteps).length);

/** Default (failback/test) values on start of each step */
export const defaultStepsValues: string[] = [
  ``, // StepStart
  ``, // StepEquationStart
  `${equationBegin}`, // StepSelectSourceColumn
  `${equationBegin}${sourceCellName}`, // StepEquationSemicolon
  `${equationBegin}${sourceCellName};`, // StepSelectLookupRange
  `${equationBegin}${sourceCellName};${lookupRangeName}`, // StepEditLookupRange
  `${equationBegin}${sourceCellName};${editedLookupRangeName}`, // StepAddColumnNumber
  `${equationBegin}${sourceCellName};${editedLookupRangeName};${expectedColumnNumber}`, // StepAddInterval
  `${equationBegin}${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue}`, // StepFinishEquation
  `${equationBegin}${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue})`, // StepExtendRawResults
  `${equationBegin}${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue})`, // StepSelectEquatonAgain
  `${equationBegin}${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue})`, // StepAddSubstrColumn
  `${equationBegin}${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue})-${substrCellName}`, // StepExtendFinalResults
  `${equationBegin}${sourceCellName};${editedLookupRangeName};${expectedColumnNumber};${expectedIntervalValue})-${substrCellName}`, // StepDone
];

const __useDebug = true;
export const initalProgressStep =
  __useDebug && isDev
    ? ProgressSteps.StepSelectLookupRange // DEBUG
    : ProgressSteps.StepStart;
