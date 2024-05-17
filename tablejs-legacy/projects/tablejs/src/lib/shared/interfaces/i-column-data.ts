export interface IColumnData {
  order: number;
  span: number;
  lastDataSpan: number;
  nthChild: number;
  subGroups: IColumnData[];
  parent: Element;
  child: Element;
  linkedChildren: Element[];
  subColumnLength: number;
}
