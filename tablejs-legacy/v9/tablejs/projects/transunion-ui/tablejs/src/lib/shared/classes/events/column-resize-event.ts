import { IColumnResizeEvent } from './../../interfaces/events/i-column-resize-event';

export class ColumnResizeEvent implements IColumnResizeEvent {

  public static readonly ON_RESIZE: string = 'onResize';
  public static readonly ON_RESIZE_START: string = 'onResizeStart';
  public static readonly ON_RESIZE_END: string = 'onResizeEnd';

  public pointerEvent: any;
  public columnWidth: number;
  public columnMinWidth: number;
  public classesBeingResized: string[];
  public type?: string;
}
