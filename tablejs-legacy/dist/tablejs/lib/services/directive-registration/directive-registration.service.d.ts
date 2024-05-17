import { GridService } from './../grid/grid.service';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import { VirtualForDirective } from './../../directives/virtual-for/virtual-for.directive';
import { IVirtualNexus } from './../../shared/interfaces/i-virtual-nexus';
export declare class DirectiveRegistrationService {
    gridService: GridService;
    constructor(gridService: GridService);
    private nexuses;
    setVirtualNexus(virtualForDirective: VirtualForDirective<any, any>, scrollViewportDirective: ScrollViewportDirective): IVirtualNexus;
    getVirtualNexusFromViewport(scrollViewportDirective: ScrollViewportDirective): IVirtualNexus;
    registerNodeAttributes(node: any): void;
    registerReorderGripOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerResizableGripOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerDataColClassesOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerDataColClassOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerRowsOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerViewportOnGridDirective(node: HTMLElement): void;
}
//# sourceMappingURL=directive-registration.service.d.ts.map