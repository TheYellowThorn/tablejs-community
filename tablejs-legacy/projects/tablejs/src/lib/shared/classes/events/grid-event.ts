import { IGridEvent } from './../../interfaces/events/i-grid-event';

export class GridEvent implements IGridEvent {

  public static readonly ON_INITIALIZED: string = 'onInitialized';

  public gridComponent: any;
  public gridElement: HTMLElement;
  public type: string;
}
