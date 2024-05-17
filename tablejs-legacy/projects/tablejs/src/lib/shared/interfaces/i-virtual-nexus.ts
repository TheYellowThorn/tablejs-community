import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import { VirtualForDirective } from './../../directives/virtual-for/virtual-for.directive';

export interface IVirtualNexus {
  scrollViewportDirective: ScrollViewportDirective | null;
  virtualForDirective: VirtualForDirective<any, any> | null;
}
