import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class GridService {
    linkedDirectiveObjs: any;
    containsInitialWidthSettings: BehaviorSubject<boolean | undefined>;
    constructor();
    getParentTablejsGridDirective(el: HTMLElement | null): HTMLElement | null;
    triggerHasInitialWidths(hasWidths: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GridService>;
}
