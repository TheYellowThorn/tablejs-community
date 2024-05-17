import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[tablejsEditableCell], [tablejseditablecell], [tablejs-editable-cell]',
  host: { class: 'tablejs-editable-cell' }
})
export class EditableCellDirective implements AfterViewInit, OnInit, OnDestroy {

  @Input('tablejsEditableCell') initialData: any; // initial data is an object
  @Input() validator: Function | null = null;
  @Input() validatorParams: any[] = [];
  @Input() regExp: string | null = null;
  @Input() regExpFlags: string = 'gi';
  @Input() list: string[] = [];
  @Output() cellInput: EventEmitter<any> = new EventEmitter<any>();
  @Output() cellFocusOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() cellValidation: EventEmitter<boolean> = new EventEmitter<boolean>();
  containerDiv: HTMLDivElement;
  input: HTMLInputElement;
  dataList: HTMLDataListElement;
  option: HTMLOptionElement | null = null;
  lastText: string | null = null;
  originalText: string | null = null;
  lastValidInput: string | null = null;
  onFocusOut: any;
  inputListener: any;
  hasInputListener: boolean = false;

  constructor(private elementRef: ElementRef) {
    this.containerDiv = document.createElement('div');
    this.input = document.createElement('input'); // Create an <input> node
    this.input.type = 'text';

    this.dataList = document.createElement('datalist');
  }

  @HostListener('document:keydown.enter', ['$event']) onKeyDownHandler(event: KeyboardEvent) {
    if (document.activeElement === this.input) {
      this.input.blur();
      this.input.removeEventListener('focusout', this.onFocusOut);
    }
  }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    let hasInput: boolean = false;
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
    let count: number = 0;
    let id: string = 'data-list-' + count.toString();
    while (document.getElementById(id) !== null && document.getElementById(id) !== undefined) {
      count++;
      id = 'data-list-' + count.toString();
    }
    this.dataList.setAttribute('id', id);
    this.elementRef.nativeElement.appendChild(this.containerDiv);
    this.containerDiv.appendChild(this.dataList);
    this.list.forEach(value => {
      const filteredDataList: any[] = Array.from(this.dataList.options).filter(option => option.value === value);
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
        const regEx: RegExp = new RegExp(this.regExp, this.regExpFlags);
        if (regEx.test(this.input.value)) {
          this.validateInput();
          this.lastText = this.input.value;
          this.cellInput.emit(this.getCellObject());
        } else {
          this.input.value = this.lastText!;
        }
      } else {
        this.validateInput();
        this.cellInput.emit(this.getCellObject());
      }
    };
    this.input.addEventListener('input', this.inputListener);
    this.hasInputListener = true;
  }

  getCellObject(): any {
    return {
      currentValue: this.input.value,
      lastValidInput: this.lastValidInput,
      originalValue: this.originalText,
      inputHasFocus: document.activeElement === this.input
    };
  }

  validateInput() {
    const validationOk: boolean = this.validator ? this.validator.apply(null, [this.input.value].concat(this.validatorParams)) : true;
    if (validationOk) {
      this.input.classList.remove('error');
      this.lastValidInput = this.input.value;
    } else {
      this.input.classList.add('error');
    }
    this.cellValidation.emit(validationOk);
  }

  ngOnDestroy(): void {
    if (this.hasInputListener) {
      this.input.removeEventListener('input', this.inputListener);
      this.hasInputListener = false;
    }
  }

}
