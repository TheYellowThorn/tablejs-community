import { TestBed } from '@angular/core/testing';
import { ComponentFactoryResolver } from '@angular/core';

import { DynamicComponentService } from './dynamic-component.service';

describe('DynamicComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ComponentFactoryResolver]
  }));

  it('should be created', () => {
    const service: DynamicComponentService = TestBed.get(DynamicComponentService);
    expect(service).toBeTruthy();
  });

  // describe('createComponent()', () => {
    // it('should call resolveComponentFactory()', () => {
      // const vcr: ViewContainerRef = { createComponent: (factory) => true } as ViewContainerRef;
      // service.createComponent(vcr, 'Foo');
      // expect()
    // });
  // });
});
