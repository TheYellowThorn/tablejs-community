import { GridService } from './../grid/grid.service';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import { VirtualForDirective } from './../../directives/virtual-for/virtual-for.directive';
import { IVirtualNexus } from './../../shared/interfaces/i-virtual-nexus';
import * as i0 from "@angular/core";
export declare class DirectiveRegistrationService {
    gridService: GridService;
    constructor(gridService: GridService);
    private nexuses;
    setVirtualNexus(virtualForDirective: VirtualForDirective<any, any>, scrollViewportDirective: ScrollViewportDirective): IVirtualNexus;
    clearVirtualNexus(nexus: IVirtualNexus): void;
    getVirtualNexusFromViewport(scrollViewportDirective: ScrollViewportDirective): IVirtualNexus;
    registerNodeAttributes(node: any): void;
    registerReorderGripOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerResizableGripOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerDataColClassesOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerDataColClassOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerRowsOnGridDirective(node: HTMLElement, fromMutation?: boolean): void;
    registerViewportOnGridDirective(node: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DirectiveRegistrationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DirectiveRegistrationService>;
}
