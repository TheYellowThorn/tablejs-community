import { AfterViewInit, ElementRef, EventEmitter, OnInit } from '@angular/core';
export declare class EditableCellDirective implements AfterViewInit, OnInit {
    private elementRef;
    initialData: any;
    validator: Function | null;
    validatorParams: any[];
    regExp: string | null;
    regExpFlags: string;
    list: string[];
    cellInput: EventEmitter<any>;
    cellFocusOut: EventEmitter<any>;
    cellValidation: EventEmitter<boolean>;
    containerDiv: HTMLDivElement;
    input: HTMLInputElement;
    dataList: HTMLDataListElement;
    option: HTMLOptionElement | null;
    lastText: string | null;
    originalText: string | null;
    lastValidInput: string | null;
    onFocusOut: any;
    constructor(elementRef: ElementRef);
    onKeyDownHandler(event: KeyboardEvent): void;
    onClick(event: MouseEvent): void;
    createDataList(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    getCellObject(): any;
    validateInput(): void;
}
//# sourceMappingURL=editable-cell.directive.d.ts.map