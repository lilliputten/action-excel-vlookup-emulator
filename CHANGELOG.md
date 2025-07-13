<!--
 @since 2025.07.08
 @changed 2025.07.14, 02:55
-->

# CHANGELOG

## [v.0.0.3](https://github.com/lilliputten/action-excel-vlookup-emulator/releases/tag/v.0.0.3) - 2025.07.14

[Issue #2: Finish progress (add the last steps). Add current step indications.](https://github.com/lilliputten/action-excel-vlookup-emulator/issues/2)

- The texts have been changed.
- Added a check for pressing the F4 key in the "Fix the search range in the formula" step.
- Instead of a pop-up warning about input errors, an error prompt is used.
- Increased delays in pop-up messages.
- Added navigation buttons (first, full screen).
- The project configuration has been changed: it works in the Action environment.
- Added column selection for subtraction.
- Added hints for incorrect selection of a range and cell with the mouse, a message appears after 3 incorrect selections.
- Added hints for repeated keyboard input errors for steps: StepEditLookupRange ('Fix the search range in the formula'), StepAddColumnNumber ('Add column number'), StepAddInterval ('Add interval view value').
- Added fireworks effect on success actions.
- Disabled error clearing on intermediate correct values.

- [Compare](https://github.com/lilliputten/action-excel-vlookup-emulator/compare/v.0.0.2...v.0.0.3)

## [v.0.0.2](https://github.com/lilliputten/action-excel-vlookup-emulator/releases/tag/v.0.0.2) - 2025.07.10

[Issue #3: Create progress tracking context.](https://github.com/lilliputten/action-excel-vlookup-emulator/issues/3)

Issue #3: Implemented progress steps 1-7.

- Added progress context with steps control.
- Refactored table layout to use css grids instead of html tables (due to rendering bugs for complex layout stylings).
- Created template components for inner tooltip hints and progress navigation.
- Added source cell, progress steps data, input & hint cells.
- Refactored ExcelEmulator type & constant modules.
- Added selection context and mouse movement control in the Table node.
- Completed lookup range selection.

- [Compare](https://github.com/lilliputten/action-excel-vlookup-emulator/compare/v.0.0.1...v.0.0.2)

## [v.0.0.1](https://github.com/lilliputten/action-excel-vlookup-emulator/releases/tag/v.0.0.1) - 2025.07.09

[Issue #1: Set up the project.](https://github.com/lilliputten/action-excel-vlookup-emulator/issues/1)

- Configured project enviroment.
- Implemented basic "Excel" table layout.

(Initial version.)
