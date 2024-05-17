import { EditableCellDirective } from './editable-cell.directive';
import { ComponentFixture, TestBed, tick, inject, fakeAsync } from '@angular/core/testing';
import { AfterViewInit, Component, DebugElement, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import { By } from '@angular/platform-browser';

export class MockElementRef extends ElementRef {
  constructor() {
    super(
      {
        children: null,
        innerText: '',
        contains: () => false,
        appendChild: (child: Node) => true,
        removeChild: (child: Node) => true
      }
    );
  }
}
@Component({
  selector: 'tablejs-app',
  template: '<div tablejsEditableCell></div>'
})
export class HostComponent {

}

describe('EditableCellDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let gridService: GridService;
  let hostElements: DebugElement[];
  let directive: EditableCellDirective;

  beforeEach(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [EditableCellDirective, HostComponent],
      providers: [
        EditableCellDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComponent = fixture.componentInstance;

    hostElements = fixture.debugElement.queryAll(By.directive(EditableCellDirective));

    gridService = TestBed.inject(GridService);
    directive = fixture.debugElement.injector.get(EditableCellDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(hostComponent).toBeTruthy();
  });

  describe('onKeyDownHandler()', () => {
    it ('should call blur when input is the activeElement', () => {
      const spy = spyOn(directive.input, 'blur');
      const event: KeyboardEvent = new KeyboardEvent('keydown');
      const activeElement = spyOnProperty(document, 'activeElement').and.returnValue(directive.input);
      directive.onKeyDownHandler(event);
      expect(spy).toHaveBeenCalled();
    });
    it ('should not call blur when input is not the activeElement', () => {
      const spy = spyOn(directive.input, 'blur');
      const event: KeyboardEvent = new KeyboardEvent('keydown');
      const activeElement = spyOnProperty(document, 'activeElement').and.returnValue(null);
      directive.onKeyDownHandler(event);
      expect(spy).not.toHaveBeenCalled();
    });
    it ('should call removeEventListener when input is the activeElement', () => {
      const spy = spyOn(directive.input, 'removeEventListener');
      const event: KeyboardEvent = new KeyboardEvent('keydown');
      const activeElement = spyOnProperty(document, 'activeElement').and.returnValue(directive.input);
      directive.onKeyDownHandler(event);
      expect(spy).toHaveBeenCalledWith('focusout', directive.onFocusOut);
    });
    it ('should not call removeEventListener when input is not the activeElement', () => {
      const spy = spyOn(directive.input, 'removeEventListener');
      const event: KeyboardEvent = new KeyboardEvent('keydown');
      const activeElement = spyOnProperty(document, 'activeElement').and.returnValue(null);
      directive.onKeyDownHandler(event);
      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe('onClick()', () => {
    it('should append child if input does not exist', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      directive['elementRef'].nativeElement.innerHTML = '';
      fixture.detectChanges();
      directive.onClick(new MouseEvent('click'));
      expect(directive.containerDiv.children.length).toBe(1);
    });
    it('should append child if input does not exist when containerDiv is not a child', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      directive.containerDiv = document.createElement('div');
      fixture.detectChanges();
      directive.onClick(new MouseEvent('click'));
      expect(directive.containerDiv.children.length).toBe(1);
    });
    it('should set value, lastText, and origitalText', () => {
      directive['elementRef'].nativeElement.innerText = 'boo';
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      directive.onClick(new MouseEvent('click'));
      expect(directive.input.value).toBe('boo');
      expect(directive.lastText).toBe('boo');
      expect(directive.originalText).toBe('boo');
    });
    describe('when no list supplied', () => {
      it('should not call createDataList', () => {
        if (directive.containerDiv.children.length > 0) {
          directive.containerDiv.innerHTML = '';
        }
        const spy = spyOn(directive, 'createDataList');
        directive.onClick(new MouseEvent('click'));
        expect(spy).not.toHaveBeenCalled();
      });
    });
    describe('when list supplied', () => {
      it('should call createDataList', () => {
        if (directive.containerDiv.children.length > 0) {
          directive.containerDiv.innerHTML = '';
        }
        directive.list = ['foo', 'boo'];
        const spy = spyOn(directive, 'createDataList');
        directive.onClick(new MouseEvent('click'));
        expect(spy).toHaveBeenCalled();
      });
    });
    it('should call validateInput()', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive, 'validateInput');
      directive.onClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalled();
    });
    it('should not call validateInput() if children already exist', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const parent =  directive['elementRef'].nativeElement;
      directive.containerDiv = document.createElement('div');
      parent.children = [directive.containerDiv];
      fixture.detectChanges();
      const spy = spyOn(directive, 'validateInput');
      directive.onClick(new MouseEvent('click'));
      expect(spy).not.toHaveBeenCalled();
    });
    it('should call validateInput() if children already exists but is not the containerDiv', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const parent =  directive['elementRef'].nativeElement;
      parent.children = [document.createElement('div')];
      fixture.detectChanges();
      const spy = spyOn(directive, 'validateInput');
      directive.onClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalled();
    });
    it('should call input.focus()', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive.input, 'focus');
      directive.onClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalled();
    });
    it('should set onFocusOut()', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      directive.onClick(new MouseEvent('click'));
      expect(directive.onFocusOut).toBeTruthy();
    });
    it('should add focus out listener', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive.input, 'addEventListener').and.callThrough();
      directive.onClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalledWith('focusout', directive.onFocusOut);
    });
    it('cellInput should emit', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive.cellInput, 'emit');
      directive.onClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalled();
    });
    it('should remove container div on onFocusOut', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      directive.onClick(new MouseEvent('click'));
      directive.onFocusOut();
      expect(directive['elementRef'].nativeElement.contains(directive.containerDiv)).toBe(false);
    });
    it('should not remove container div on onFocusOut', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive['elementRef'].nativeElement, 'removeChild');
      directive.onClick(new MouseEvent('click'));
      directive['elementRef'].nativeElement.innerHTML = '';
      fixture.detectChanges();
      directive.onFocusOut();
      expect(spy).not.toHaveBeenCalled();
    });
    it('cellInput should emit on onFocusOut', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive.cellInput, 'emit');
      directive.onClick(new MouseEvent('click'));
      directive.onFocusOut();
      expect(spy).toHaveBeenCalled();
    });
    it('cellFocusOut should emit on onFocusOut', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive.cellFocusOut, 'emit');
      directive.onClick(new MouseEvent('click'));
      directive.onFocusOut();
      expect(spy).toHaveBeenCalled();
    });
    it('input should remove listener on onFocusOut', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive.input, 'removeEventListener').and.callThrough();
      directive.onClick(new MouseEvent('click'));
      directive.onFocusOut();
      expect(spy).toHaveBeenCalledWith('focusout', directive.onFocusOut);
    });
    it('nativeElement should remove containerDiv on onFocusOut', () => {
      if (directive.containerDiv.children.length > 0) {
        directive.containerDiv.innerHTML = '';
      }
      const spy = spyOn(directive['elementRef'].nativeElement, 'removeChild');
      directive.onClick(new MouseEvent('click'));
       const parent =  directive['elementRef'].nativeElement;
      parent.children = [directive.containerDiv];
      parent.contains = (child: any) => true;
      directive.onFocusOut();
      expect(spy).toHaveBeenCalled();
    });
  });
  describe('createDataList()', () => {
    it('should have created a valid datalist', () => {
      directive.createDataList();
      expect(directive.dataList).toBeTruthy();
    });
    it('should set the datalist id', () => {
      const div = document.getElementById('data-list-0');
      if (div && div.parentElement) {
        div.parentElement.removeChild(div);
      }
      directive.createDataList();
      expect(directive.dataList.getAttribute('id')).toBe('data-list-0');
    });
    it('should increment datalist id if id exists', () => {
      let count: number = 0;
      let id: string = 'data-list-' + count.toString();
      var div = document.createElement('div');
      div.id = id;
      div.setAttribute('id', id);
      var body = document.querySelector('body');
      body!.appendChild(div);

      directive.createDataList();
      // expect(document.getElementById('data-list-0')).toBe(div);
      expect(directive.dataList.getAttribute('id')).toBe('data-list-1');
    });
    it('should add containerDiv', () => {
      const spy = spyOn(directive['elementRef'].nativeElement, 'appendChild');
      directive.createDataList();
      expect(spy).toHaveBeenCalledWith(directive.containerDiv);
    });
    it('containerDiv should add dataList', () => {
      const spy = spyOn(directive.containerDiv, 'appendChild');
      directive.createDataList();
      expect(spy).toHaveBeenCalledWith(directive.dataList);
    });
    it('should add lists options from list', () => {
      directive.list = ['foo', 'boo'];
      directive.createDataList();
      fixture.detectChanges();
      expect(directive.dataList.options.length).toBe(2);
      expect(directive.dataList.options[0].value).toBe('foo');
      expect(directive.dataList.options[1].value).toBe('boo');
    });
    it('should not add lists options from list when dataList matches', () => {
      directive.list = ['foo', 'boo'];
      var i, L = directive.dataList.options.length - 1;
      for (i = L; i >= 0; i--) {
          directive.dataList.children[i].remove();
      }
      let option = document.createElement('option');
      option.value = 'foo';
      directive.dataList.appendChild(option);
      option = document.createElement('option');
      option.value = 'boo';
      directive.dataList.appendChild(option);
      const spy = spyOn(directive.dataList, 'appendChild');
      directive.createDataList();
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });
    it('should add no list options when list is empty', () => {
      directive.list = [];
      directive.createDataList();
      fixture.detectChanges();
      expect(directive.dataList.options.length).toBe(0);
    });
    it('should set input list id', () => {
      const div = document.getElementById('data-list-0');
      if (div && div.parentElement) {
        div.parentElement.removeChild(div);
      }
      directive.createDataList();
      fixture.detectChanges();
      expect(directive.input.getAttribute('list')).toBe('data-list-0');
    });
  });
  describe('ngOnInit()', () => {
    it('should set the input value based on the innerText of the elementRef nativeElement', () => {
      directive['elementRef'].nativeElement.innerText = 'Bob';
      directive.ngOnInit();
      expect(directive.input.value).toBe('Bob');
    });
  });
  describe('ngAfterViewInit()', () => {
    it('should set the input value based on the innerText of the elementRef nativeElement', () => {
      directive['elementRef'].nativeElement.innerText = 'Bob2';
      directive.ngAfterViewInit();
      expect(directive.input.value).toBe('Bob2');
    });
    it('should set lastText', () => {
      directive['elementRef'].nativeElement.innerText = 'Bob3';
      directive.ngAfterViewInit();
      expect(directive.lastText).toBe('Bob3');
    });
    it('should set input listener', () => {
      const spy = spyOn(directive.input, 'addEventListener');
      directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
    it('should check set the input value to the lastText if the typed text is outside the scope of the regular expression', () => {
      directive['elementRef'].nativeElement.innerText = '124';
      directive.regExp = '^[0-9]*$'
      directive.regExpFlags = 'gi';
      directive.ngAfterViewInit();
      const event: Event = new Event('input', {
        bubbles: true,
        cancelable: true
      });
      directive.input.value = '124B';
      directive.input.dispatchEvent(event);
      expect(directive.input.value).toBe('124');
    });
    it('should call validateInput() when a valid value is input', () => {
      directive['elementRef'].nativeElement.innerText = '124';
      directive.regExp = '^[0-9]*$'
      directive.regExpFlags = 'gi';
      directive.ngAfterViewInit();
      const event: Event = new Event('input', {
        bubbles: true,
        cancelable: true
      });
      directive.input.value = '1245';
      const spy = spyOn(directive, 'validateInput');
      directive.input.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
    });
    it('should set lastText when a valid value is input', () => {
      directive['elementRef'].nativeElement.innerText = '124';
      directive.regExp = '^[0-9]*$'
      directive.regExpFlags = 'gi';
      directive.ngAfterViewInit();
      const event: Event = new Event('input', {
        bubbles: true,
        cancelable: true
      });
      directive.input.value = '1245';
      directive.input.dispatchEvent(event);
      expect(directive.lastText).toBe('1245');
    });
    it('should emit cellInput when a valid value in input', () => {
      directive['elementRef'].nativeElement.innerText = '124';
      directive.regExp = '^[0-9]*$'
      directive.regExpFlags = 'gi';
      directive.ngAfterViewInit();
      const event: Event = new Event('input', {
        bubbles: true,
        cancelable: true
      });
      directive.input.value = '1245';
      const spy = spyOn(directive.cellInput, 'emit');
      directive.input.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
    });
  });
  describe('getCellObject()', () => {
    it('object returned should match current values', () => {
      directive.originalText = '555';
      directive.lastValidInput = '674';
      directive.input.value = '6745';
      const spy = spyOnProperty(document, 'activeElement').and.returnValue(directive.input);
      expect(directive.getCellObject()).toEqual({
        currentValue: '6745',
        lastValidInput: '674',
        originalValue: '555',
        inputHasFocus: true
      });
    })
  });
  describe('validateInput()', () => {
    it('should call validator if function exists', () => {
      directive.validatorParams = [];
      directive.validator = (input: HTMLInputElement) => true;
      const spy = spyOn(directive.validator, 'apply');
      directive.validateInput();
      expect(spy).toHaveBeenCalled();
    });
    it('should remove error class if valid', () => {
      directive.input.classList.add('error');
      directive.validatorParams = [];
      directive.validator = null
      directive.validateInput();
      expect(directive.input.classList.contains('error')).toBe(false);
    });
    it('should add error class if invalid', () => {
      directive.input.classList.remove('error');
      directive.validatorParams = [];
      directive.validator = (input: HTMLInputElement) => false;
      directive.validateInput();
      expect(directive.input.classList.contains('error')).toBe(true);
    });
    it('should set lastValidInput to input.value', () => {
      directive.input.value = '6745';
      directive.validatorParams = [];
      directive.validator = null
      directive.validateInput();
      expect(directive.lastValidInput).toBe('6745');
    });
    it('should emit from cellValidation true if validation is ok', () => {
      directive.validatorParams = [];
      directive.validator = (input: HTMLInputElement) => true;
      const spy = spyOn(directive.cellValidation, 'emit');
      directive.validateInput();
      expect(spy).toHaveBeenCalledWith(true);
    });
    it('should emit from cellValidation false if validation is not ok', () => {
      directive.validatorParams = [];
      directive.validator = (input: HTMLInputElement) => false;
      const spy = spyOn(directive.cellValidation, 'emit');
      directive.validateInput();
      expect(spy).toHaveBeenCalledWith(false);
    })
  });
});
