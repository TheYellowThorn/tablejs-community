export interface IColumnHierarchy {
    level: number;
    element: Element;
    parent: Element;
    parentColumn: Element | null;
    subColumns: IColumnHierarchy[];
}
