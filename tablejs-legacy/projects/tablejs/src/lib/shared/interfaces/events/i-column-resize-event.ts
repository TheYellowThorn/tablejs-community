export interface IColumnResizeEvent {
  pointerEvent: any;
  columnWidth: number;
  columnMinWidth: number;
  classesBeingResized: string[];
  type?: string;
}

