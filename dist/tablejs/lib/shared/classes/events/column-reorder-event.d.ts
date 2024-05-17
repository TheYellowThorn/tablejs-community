import { IColumnReorderEvent } from './../../interfaces/events/i-column-reorder-event';
export declare class ColumnReorderEvent implements IColumnReorderEvent {
    static readonly ON_REORDER: string;
    static readonly ON_REORDER_START: string;
    static readonly ON_REORDER_END: string;
    pointerEvent: any;
    columnDragged: Element;
    columnHovered: Element;
    type: string;
    constructor();
}
