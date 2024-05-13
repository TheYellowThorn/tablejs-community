import { IColumnReorderEvent } from './../../interfaces/events/i-column-reorder-event';

export class ColumnReorderEvent implements IColumnReorderEvent {

  public static readonly ON_REORDER: string = 'onReorder';
  public static readonly ON_REORDER_START: string = 'onReorderStart';
  public static readonly ON_REORDER_END: string = 'onReorderEnd';

  public pointerEvent: any;
  public columnDragged: Element;
  public columnHovered: Element;
  public type: string;

  constructor() {}
}
