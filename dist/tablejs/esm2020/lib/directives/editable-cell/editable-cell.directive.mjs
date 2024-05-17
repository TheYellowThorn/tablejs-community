import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class EditableCellDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.validator = null;
        this.validatorParams = [];
        this.regExp = null;
        this.regExpFlags = 'gi';
        this.list = [];
        this.cellInput = new EventEmitter();
        this.cellFocusOut = new EventEmitter();
        this.cellValidation = new EventEmitter();
        this.option = null;
        this.lastText = null;
        this.originalText = null;
        this.lastValidInput = null;
        this.hasInputListener = false;
        this.containerDiv = document.createElement('div');
        this.input = document.createElement('input'); // Create an <input> node
        this.input.type = 'text';
        this.dataList = document.createElement('datalist');
    }
    onKeyDownHandler(event) {
        if (document.activeElement === this.input) {
            this.input.blur();
            this.input.removeEventListener('focusout', this.onFocusOut);
        }
    }
    onClick(event) {
        let hasInput = false;
        if (this.elementRef.nativeElement.children) {
            for (let i = 0; i < this.elementRef.nativeElement.children.length; i++) {
                if (this.elementRef.nativeElement.children[i] === this.containerDiv) {
                    hasInput = true;
                }
            }
        }
        if (!hasInput) {
            this.input.value = this.elementRef.nativeElement.innerText;
            this.lastText = this.input.value;
            this.originalText = this.elementRef.nativeElement.innerText;
            this.elementRef.nativeElement.appendChild(this.containerDiv);
            this.containerDiv.appendChild(this.input);
            if (this.list.length > 0) {
                this.createDataList();
            }
            this.validateInput();
            this.input.focus();
            this.onFocusOut = () => {
                if (this.elementRef.nativeElement.contains(this.containerDiv)) {
                    this.elementRef.nativeElement.removeChild(this.containerDiv);
                }
                this.cellInput.emit(this.getCellObject());
                this.cellFocusOut.emit(this.getCellObject());
                this.input.removeEventListener('focusout', this.onFocusOut);
            };
            this.input.addEventListener('focusout', this.onFocusOut);
        }
        this.cellInput.emit(this.getCellObject());
    }
    createDataList() {
        let count = 0;
        let id = 'data-list-' + count.toString();
        while (document.getElementById(id) !== null && document.getElementById(id) !== undefined) {
            count++;
            id = 'data-list-' + count.toString();
        }
        this.dataList.setAttribute('id', id);
        this.elementRef.nativeElement.appendChild(this.containerDiv);
        this.containerDiv.appendChild(this.dataList);
        this.list.forEach(value => {
            const filteredDataList = Array.from(this.dataList.options).filter(option => option.value === value);
            if (filteredDataList.length === 0) {
                this.option = document.createElement('option');
                this.dataList.appendChild(this.option);
                this.option.value = value;
            }
        });
        this.input.setAttribute('list', id);
    }
    ngOnInit() {
        this.input.value = this.elementRef.nativeElement.innerText;
    }
    ngAfterViewInit() {
        this.input.value = this.elementRef.nativeElement.innerText;
        this.lastText = this.input.value;
        this.inputListener = () => {
            if (this.regExp) {
                const regEx = new RegExp(this.regExp, this.regExpFlags);
                if (regEx.test(this.input.value)) {
                    this.validateInput();
                    this.lastText = this.input.value;
                    this.cellInput.emit(this.getCellObject());
                }
                else {
                    this.input.value = this.lastText;
                }
            }
            else {
                this.validateInput();
                this.cellInput.emit(this.getCellObject());
            }
        };
        this.input.addEventListener('input', this.inputListener);
        this.hasInputListener = true;
    }
    getCellObject() {
        return {
            currentValue: this.input.value,
            lastValidInput: this.lastValidInput,
            originalValue: this.originalText,
            inputHasFocus: document.activeElement === this.input
        };
    }
    validateInput() {
        const validationOk = this.validator ? this.validator.apply(null, [this.input.value].concat(this.validatorParams)) : true;
        if (validationOk) {
            this.input.classList.remove('error');
            this.lastValidInput = this.input.value;
        }
        else {
            this.input.classList.add('error');
        }
        this.cellValidation.emit(validationOk);
    }
    ngOnDestroy() {
        if (this.hasInputListener) {
            this.input.removeEventListener('input', this.inputListener);
            this.hasInputListener = false;
        }
    }
}
EditableCellDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: EditableCellDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
EditableCellDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: EditableCellDirective, selector: "[tablejsEditableCell], [tablejseditablecell], [tablejs-editable-cell]", inputs: { initialData: ["tablejsEditableCell", "initialData"], validator: "validator", validatorParams: "validatorParams", regExp: "regExp", regExpFlags: "regExpFlags", list: "list" }, outputs: { cellInput: "cellInput", cellFocusOut: "cellFocusOut", cellValidation: "cellValidation" }, host: { listeners: { "document:keydown.enter": "onKeyDownHandler($event)", "click": "onClick($event)" }, classAttribute: "tablejs-editable-cell" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: EditableCellDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsEditableCell], [tablejseditablecell], [tablejs-editable-cell]',
                    host: { class: 'tablejs-editable-cell' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { initialData: [{
                type: Input,
                args: ['tablejsEditableCell']
            }], validator: [{
                type: Input
            }], validatorParams: [{
                type: Input
            }], regExp: [{
                type: Input
            }], regExpFlags: [{
                type: Input
            }], list: [{
                type: Input
            }], cellInput: [{
                type: Output
            }], cellFocusOut: [{
                type: Output
            }], cellValidation: [{
                type: Output
            }], onKeyDownHandler: [{
                type: HostListener,
                args: ['document:keydown.enter', ['$event']]
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtY2VsbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvZGlyZWN0aXZlcy9lZGl0YWJsZS1jZWxsL2VkaXRhYmxlLWNlbGwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBUW5JLE1BQU0sT0FBTyxxQkFBcUI7SUFzQmhDLFlBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFuQmpDLGNBQVMsR0FBb0IsSUFBSSxDQUFDO1FBQ2xDLG9CQUFlLEdBQVUsRUFBRSxDQUFDO1FBQzVCLFdBQU0sR0FBa0IsSUFBSSxDQUFDO1FBQzdCLGdCQUFXLEdBQVcsSUFBSSxDQUFDO1FBQzNCLFNBQUksR0FBYSxFQUFFLENBQUM7UUFDbkIsY0FBUyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3ZELGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFDMUQsbUJBQWMsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUk5RSxXQUFNLEdBQTZCLElBQUksQ0FBQztRQUN4QyxhQUFRLEdBQWtCLElBQUksQ0FBQztRQUMvQixpQkFBWSxHQUFrQixJQUFJLENBQUM7UUFDbkMsbUJBQWMsR0FBa0IsSUFBSSxDQUFDO1FBR3JDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUdoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMseUJBQXlCO1FBQ3ZFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxH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LHFCQUFxQjtrQkFKakMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdUVBQXVFO29CQUNqRixJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsdUJBQXVCLEVBQUU7aUJBQ3pDO2lHQUcrQixXQUFXO3NCQUF4QyxLQUFLO3VCQUFDLHFCQUFxQjtnQkFDbkIsU0FBUztzQkFBakIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDSSxTQUFTO3NCQUFsQixNQUFNO2dCQUNHLFlBQVk7c0JBQXJCLE1BQU07Z0JBQ0csY0FBYztzQkFBdkIsTUFBTTtnQkFvQjZDLGdCQUFnQjtzQkFBbkUsWUFBWTt1QkFBQyx3QkFBd0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFPZixPQUFPO3NCQUF6QyxZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgTkdfVkFMVUVfQUNDRVNTT1IsIE5HX1ZBTElEQVRPUlMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1t0YWJsZWpzRWRpdGFibGVDZWxsXSwgW3RhYmxlanNlZGl0YWJsZWNlbGxdLCBbdGFibGVqcy1lZGl0YWJsZS1jZWxsXScsXG4gIGhvc3Q6IHsgY2xhc3M6ICd0YWJsZWpzLWVkaXRhYmxlLWNlbGwnIH1cbn0pXG5leHBvcnQgY2xhc3MgRWRpdGFibGVDZWxsRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgndGFibGVqc0VkaXRhYmxlQ2VsbCcpIGluaXRpYWxEYXRhOiBhbnk7IC8vIGluaXRpYWwgZGF0YSBpcyBhbiBvYmplY3RcbiAgQElucHV0KCkgdmFsaWRhdG9yOiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSB2YWxpZGF0b3JQYXJhbXM6IGFueVtdID0gW107XG4gIEBJbnB1dCgpIHJlZ0V4cDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHJlZ0V4cEZsYWdzOiBzdHJpbmcgPSAnZ2knO1xuICBASW5wdXQoKSBsaXN0OiBzdHJpbmdbXSA9IFtdO1xuICBAT3V0cHV0KCkgY2VsbElucHV0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY2VsbEZvY3VzT3V0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY2VsbFZhbGlkYXRpb246IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgY29udGFpbmVyRGl2OiBIVE1MRGl2RWxlbWVudDtcbiAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIGRhdGFMaXN0OiBIVE1MRGF0YUxpc3RFbGVtZW50O1xuICBvcHRpb246IEhUTUxPcHRpb25FbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGxhc3RUZXh0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgb3JpZ2luYWxUZXh0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGFzdFZhbGlkSW5wdXQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBvbkZvY3VzT3V0OiBhbnk7XG4gIGlucHV0TGlzdGVuZXI6IGFueTtcbiAgaGFzSW5wdXRMaXN0ZW5lcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7IC8vIENyZWF0ZSBhbiA8aW5wdXQ+IG5vZGVcbiAgICB0aGlzLmlucHV0LnR5cGUgPSAndGV4dCc7XG5cbiAgICB0aGlzLmRhdGFMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGF0YWxpc3QnKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleWRvd24uZW50ZXInLCBbJyRldmVudCddKSBvbktleURvd25IYW5kbGVyKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuaW5wdXQpIHtcbiAgICAgIHRoaXMuaW5wdXQuYmx1cigpO1xuICAgICAgdGhpcy5pbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIHRoaXMub25Gb2N1c091dCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKSBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgbGV0IGhhc0lucHV0OiBib29sZWFuID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jaGlsZHJlbltpXSA9PT0gdGhpcy5jb250YWluZXJEaXYpIHtcbiAgICAgICAgICBoYXNJbnB1dCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFoYXNJbnB1dCkge1xuICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmlubmVyVGV4dDtcbiAgICAgIHRoaXMubGFzdFRleHQgPSB0aGlzLmlucHV0LnZhbHVlO1xuICAgICAgdGhpcy5vcmlnaW5hbFRleHQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbm5lclRleHQ7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmlucHV0KTtcblxuICAgICAgaWYgKHRoaXMubGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRGF0YUxpc3QoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52YWxpZGF0ZUlucHV0KCk7XG4gICAgICB0aGlzLmlucHV0LmZvY3VzKCk7XG4gICAgICB0aGlzLm9uRm9jdXNPdXQgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyh0aGlzLmNvbnRhaW5lckRpdikpIHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jZWxsSW5wdXQuZW1pdCh0aGlzLmdldENlbGxPYmplY3QoKSk7XG4gICAgICAgIHRoaXMuY2VsbEZvY3VzT3V0LmVtaXQodGhpcy5nZXRDZWxsT2JqZWN0KCkpO1xuICAgICAgICB0aGlzLmlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgdGhpcy5vbkZvY3VzT3V0KTtcbiAgICAgIH07XG4gICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgdGhpcy5vbkZvY3VzT3V0KTtcbiAgICB9XG4gICAgdGhpcy5jZWxsSW5wdXQuZW1pdCh0aGlzLmdldENlbGxPYmplY3QoKSk7XG4gIH1cblxuICBjcmVhdGVEYXRhTGlzdCgpIHtcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGlkOiBzdHJpbmcgPSAnZGF0YS1saXN0LScgKyBjb3VudC50b1N0cmluZygpO1xuICAgIHdoaWxlIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgIT09IG51bGwgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvdW50Kys7XG4gICAgICBpZCA9ICdkYXRhLWxpc3QtJyArIGNvdW50LnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHRoaXMuZGF0YUxpc3Quc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5kYXRhTGlzdCk7XG4gICAgdGhpcy5saXN0LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgZmlsdGVyZWREYXRhTGlzdDogYW55W10gPSBBcnJheS5mcm9tKHRoaXMuZGF0YUxpc3Qub3B0aW9ucykuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24udmFsdWUgPT09IHZhbHVlKTtcbiAgICAgIGlmIChmaWx0ZXJlZERhdGFMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLm9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICB0aGlzLmRhdGFMaXN0LmFwcGVuZENoaWxkKHRoaXMub3B0aW9uKTtcbiAgICAgICAgdGhpcy5vcHRpb24udmFsdWUgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbGlzdCcsIGlkKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5wdXQudmFsdWUgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbm5lclRleHQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pbnB1dC52YWx1ZSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmlubmVyVGV4dDtcbiAgICB0aGlzLmxhc3RUZXh0ID0gdGhpcy5pbnB1dC52YWx1ZTtcbiAgICB0aGlzLmlucHV0TGlzdGVuZXIgPSAoKSA9PiB7IFxuICAgICAgaWYgKHRoaXMucmVnRXhwKSB7XG4gICAgICAgIGNvbnN0IHJlZ0V4OiBSZWdFeHAgPSBuZXcgUmVnRXhwKHRoaXMucmVnRXhwLCB0aGlzLnJlZ0V4cEZsYWdzKTtcbiAgICAgICAgaWYgKHJlZ0V4LnRlc3QodGhpcy5pbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICB0aGlzLnZhbGlkYXRlSW5wdXQoKTtcbiAgICAgICAgICB0aGlzLmxhc3RUZXh0ID0gdGhpcy5pbnB1dC52YWx1ZTtcbiAgICAgICAgICB0aGlzLmNlbGxJbnB1dC5lbWl0KHRoaXMuZ2V0Q2VsbE9iamVjdCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gdGhpcy5sYXN0VGV4dCE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVJbnB1dCgpO1xuICAgICAgICB0aGlzLmNlbGxJbnB1dC5lbWl0KHRoaXMuZ2V0Q2VsbE9iamVjdCgpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmlucHV0TGlzdGVuZXIpO1xuICAgIHRoaXMuaGFzSW5wdXRMaXN0ZW5lciA9IHRydWU7XG4gIH1cblxuICBnZXRDZWxsT2JqZWN0KCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRWYWx1ZTogdGhpcy5pbnB1dC52YWx1ZSxcbiAgICAgIGxhc3RWYWxpZElucHV0OiB0aGlzLmxhc3RWYWxpZElucHV0LFxuICAgICAgb3JpZ2luYWxWYWx1ZTogdGhpcy5vcmlnaW5hbFRleHQsXG4gICAgICBpbnB1dEhhc0ZvY3VzOiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLmlucHV0XG4gICAgfTtcbiAgfVxuXG4gIHZhbGlkYXRlSW5wdXQoKSB7XG4gICAgY29uc3QgdmFsaWRhdGlvbk9rOiBib29sZWFuID0gdGhpcy52YWxpZGF0b3IgPyB0aGlzLnZhbGlkYXRvci5hcHBseShudWxsLCBbdGhpcy5pbnB1dC52YWx1ZV0uY29uY2F0KHRoaXMudmFsaWRhdG9yUGFyYW1zKSkgOiB0cnVlO1xuICAgIGlmICh2YWxpZGF0aW9uT2spIHtcbiAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcbiAgICAgIHRoaXMubGFzdFZhbGlkSW5wdXQgPSB0aGlzLmlucHV0LnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlucHV0LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgfVxuICAgIHRoaXMuY2VsbFZhbGlkYXRpb24uZW1pdCh2YWxpZGF0aW9uT2spO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaGFzSW5wdXRMaXN0ZW5lcikge1xuICAgICAgdGhpcy5pbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuaW5wdXRMaXN0ZW5lcik7XG4gICAgICB0aGlzLmhhc0lucHV0TGlzdGVuZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxufVxuIl19