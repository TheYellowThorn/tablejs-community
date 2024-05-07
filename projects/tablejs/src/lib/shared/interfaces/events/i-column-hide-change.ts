import { IColumnHierarchy } from "./../i-column-hierarchy";

export interface IColumnHideChange {
  hierarchyColumn: IColumnHierarchy;
  hidden: boolean;
  wasTriggeredByThisColumn: boolean;
}
