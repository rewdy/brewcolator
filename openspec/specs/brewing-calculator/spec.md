# brewing-calculator Specification

## Purpose

Provides a responsive brewing calculator that forecasts fermentation outcomes and calculates chaptalization sugar additions for cider, mead, and wine makers.

## Requirements

### Requirement: Outcome Forecasting Mode
The system SHALL provide a dedicated outcome forecasting view at `/predict` that computes predicted final gravity (FG), expected ABV %, and fermentation character based on batch size, starting original gravity (OG), yeast alcohol tolerance (% ABV), and a customizable baseline dry final gravity (defaulting to 0.998).

#### Scenario: Complete fermentation within yeast alcohol tolerance
- **WHEN** user inputs Starting OG of 1.050, Yeast Alcohol Tolerance of 12%, and baseline dry FG of 0.998
- **THEN** system computes potential ABV as approximately 6.82%
- **THEN** system displays Predicted FG as 0.998
- **THEN** system displays Expected ABV as 6.82%
- **THEN** system indicates the fermentation profile is "Dry" with complete sugar conversion

#### Scenario: Incomplete fermentation exceeding yeast alcohol tolerance
- **WHEN** user inputs Starting OG of 1.110, Yeast Alcohol Tolerance of 11%, and baseline dry FG of 0.998
- **THEN** system computes potential ABV as approximately 14.7% which exceeds the 11% tolerance
- **THEN** system displays Expected ABV capped at the yeast tolerance of 11.0%
- **THEN** system displays Predicted FG as approximately 1.026
- **THEN** system indicates the fermentation profile is "Sweet / Incomplete" with residual sugar
- **THEN** system displays a prominent visual warning indicating fermentation will stall before fermenting dry due to yeast alcohol limits

### Requirement: Chaptalization and ABV Targeting Mode
The system SHALL provide a dedicated chaptalization and sugar adjustment view at `/boost` that computes the target initial gravity and required addition weight of a selected fermentable to reach a desired target ABV from the current original gravity.

#### Scenario: Calculate sugar additions for target ABV
- **WHEN** user inputs Batch Size of 5 US Gallons, Current OG of 1.045, Target ABV of 12.0%, and selects Table Sugar (Sucrose at 46 PPG)
- **THEN** system calculates required Target Initial Gravity as approximately 1.089
- **THEN** system calculates gravity points deficit of 44 points per gallon
- **THEN** system outputs the required addition weight in both pounds and ounces (approximately 4 lbs 12.5 oz)
- **THEN** system displays a footnote stating calculations assume batch size represents final volume without modeling liquid displacement

#### Scenario: Warn when target ABV exceeds yeast alcohol tolerance
- **WHEN** user inputs Target ABV of 16.0% with a Yeast Alcohol Tolerance of 14.0%
- **THEN** system displays a prominent feasibility warning badge alerting that the target ABV exceeds the yeast alcohol tolerance ceiling and will result in excessive residual sweetness rather than reaching the target alcohol level

#### Scenario: Select alternative fermentables
- **WHEN** user chooses between Table Sugar (46 PPG), Corn Sugar (42 PPG), Honey (35 PPG), Maple Syrup (30 PPG), Brown Sugar (45 PPG), Dry Malt Extract (44 PPG), or Custom
- **THEN** system recalculates the required addition weight using the respective points-per-gallon rating of the selected fermentable

### Requirement: Unit System Support and Preference Persistence
The system SHALL support toggling between US Customary units (Gallons, lbs, oz) and Metric units (Liters, kg, grams), converting input volumes and output addition weights accordingly. User unit preferences and baseline dry FG configuration SHALL be persisted in browser local storage.

#### Scenario: Toggle from US Customary to Metric units
- **WHEN** user switches the unit toggle from US to Metric
- **THEN** batch volume inputs adapt to Liters
- **THEN** addition weights are calculated and displayed in kilograms and grams
- **THEN** the selected unit preference is saved to localStorage and restored on subsequent visits

### Requirement: Routing and Deep Linking
The system SHALL provide client-side routing allowing users to navigate between the outcome predictor and chaptalization booster via distinct URL paths `/predict` and `/boost`, preserving direct bookmarkability.

#### Scenario: Direct navigation to specific mode
- **WHEN** user navigates directly to `/predict`
- **THEN** system renders the Outcome Predictor interface with its corresponding route tab active
- **WHEN** user navigates directly to `/boost`
- **THEN** system renders the Chaptalization Booster interface with its corresponding route tab active
- **WHEN** user navigates to the root `/`
- **THEN** system defaults to the Outcome Predictor view (`/predict`)
