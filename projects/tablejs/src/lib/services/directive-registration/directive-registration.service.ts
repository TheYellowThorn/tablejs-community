import { Injectable } from '@angular/core';
import { GridService } from './../grid/grid.service';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import { VirtualForDirective } from './../../directives/virtual-for/virtual-for.directive';
import { IVirtualNexus } from './../../shared/interfaces/i-virtual-nexus';

@Injectable({
  providedIn: 'root'
})
export class DirectiveRegistrationService {

  constructor(public gridService: GridService) { }

  private nexuses: IVirtualNexus[] = [];

  public setVirtualNexus(virtualForDirective: VirtualForDirective<any, any>, scrollViewportDirective: ScrollViewportDirective): IVirtualNexus {
    const nexus: IVirtualNexus = {
      scrollViewportDirective,
      virtualForDirective
    };
    this.nexuses.push(nexus);
    return nexus;
  }

  public clearVirtualNexus(nexus: IVirtualNexus): void {
    if (!nexus) {
      return;
    }
    nexus.scrollViewportDirective = null;
    nexus.virtualForDirective = null;
    const index: number = this.nexuses.indexOf(nexus);
    if (index === -1) {
      return;
    }
    this.nexuses.splice(index, 1);
    
  }

  public getVirtualNexusFromViewport(scrollViewportDirective: ScrollViewportDirective): IVirtualNexus {
    return this.nexuses.filter((nexus: IVirtualNexus) => nexus.scrollViewportDirective === scrollViewportDirective)[0];
  }

  public registerNodeAttributes(node: any) {
    if (node.getAttribute) {
      if (node.getAttribute('reordergrip') !== null) {
        this.registerReorderGripOnGridDirective(node, true);
      }
      if (node.getAttribute('resizablegrip') !== null) {
        this.registerResizableGripOnGridDirective(node, true);
      }
      if (node.getAttribute('tablejsDataColClasses') !== null) {
        this.registerDataColClassesOnGridDirective(node, true);
      }
      if (node.getAttribute('tablejsDataColClass') !== null) {
        this.registerDataColClassOnGridDirective(node, true);
      }
      if (node.getAttribute('tablejsGridRow') !== null) {
        this.registerRowsOnGridDirective(node, true);
      }
    }
  }

  public registerReorderGripOnGridDirective(node: HTMLElement, fromMutation: boolean = false) {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(node);
    if (el !== null) {
      el['gridDirective'].addReorderGrip(node, fromMutation);
    }
  }

  public registerResizableGripOnGridDirective(node: HTMLElement, fromMutation: boolean = false) {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(node);
    if (el !== null) {
      el['gridDirective'].addResizableGrip(node, fromMutation);
    }
  }

  public registerDataColClassesOnGridDirective(node: HTMLElement, fromMutation: boolean = false) {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(node);
    (node as any).dataClasses = node.getAttribute('tablejsdatacolclasses')!.replace(new RegExp(' ', 'g'), '').split(',');
    el['gridDirective'].addColumnsWithDataClasses(node, fromMutation);
  }

  public registerDataColClassOnGridDirective(node: HTMLElement, fromMutation: boolean = false) {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(node);
    if (!el) {
      return;
    }
    const cls: string | any | null = node.getAttribute('tablejsDataColClass');
    if (cls) {
      node.classList.add(cls);
    }
    const initialWidth = node.getAttribute('initialWidth');
    this.gridService.triggerHasInitialWidths(initialWidth ? true : false);
    el['gridDirective'].initialWidths[cls] = initialWidth;
  }

  public registerRowsOnGridDirective(node: HTMLElement, fromMutation: boolean = false) {
    node.classList.add('reorderable-table-row');
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(node);
    if (el !== null) {
      el['gridDirective'].addRow(node, fromMutation);
    }
  }

  public registerViewportOnGridDirective(node: HTMLElement): void {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(node);
    if (el !== null) {
      el['gridDirective'].infiniteScrollViewports = [node];
    }
  }
}
