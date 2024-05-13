import { ComponentFactoryResolver, Injectable, ViewContainerRef, ComponentRef } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {

  constructor(private cfr: ComponentFactoryResolver) { }

  createComponent(vcr: ViewContainerRef, componentClass: any): ComponentRef<any> {
     const componentFactory = this.cfr.resolveComponentFactory(componentClass);
     return vcr.createComponent(componentFactory);
  }
}
