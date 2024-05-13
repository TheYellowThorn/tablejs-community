export interface IScrollOptions {
  items: any[];
  generateCloneMethod: (template: HTMLElement, items: any[], index: number) => Node;
  initialIndex?: number;
  initialOffset?: number;
}
