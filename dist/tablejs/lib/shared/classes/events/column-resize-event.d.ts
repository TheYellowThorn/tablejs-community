import { IColumnResizeEvent } from './../../interfaces/events/i-column-resize-event';
export declare class ColumnResizeEvent implements IColumnResizeEvent {
    static readonly ON_RESIZE: string;
    static readonly ON_RESIZE_START: string;
    static readonly ON_RESIZE_END: string;
    pointerEvent: any;
    columnWidth: number;
    columnMinWidth: number;
    classesBeingResized: string[];
    type?: string;
}
