import { BehaviorSubject } from 'rxjs';
export declare class GridService {
    linkedDirectiveObjs: any;
    containsInitialWidthSettings: BehaviorSubject<boolean | undefined>;
    constructor();
    getParentTablejsGridDirective(el: HTMLElement | null): HTMLElement | null;
    triggerHasInitialWidths(hasWidths: boolean): void;
}
//# sourceMappingURL=grid.service.d.ts.map