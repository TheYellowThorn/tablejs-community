import { ElementRef, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorizResizeGripComponent } from './components/horiz-resize-grip/horiz-resize-grip.component';
import { ReorderGripComponent } from './components/reorder-grip/reorder-grip.component';
import { GridDirective } from './directives/grid/grid.directive';
import { GridRowDirective } from './directives/grid-row/grid-row.directive';
import { ResizableGripDirective } from './directives/resizable-grip/resizable-grip.directive';
import { InfiniteScrollDirective } from './directives/infinite-scroll/infinite-scroll.directive';
import { GridComponent } from './components/grid/grid.component';
import { SortableColDirective } from './directives/sortable-col/sortable-col.directive';
import { EditableCellDirective } from './directives/editable-cell/editable-cell.directive';
import { DragAndDropGhostComponent } from './components/drag-and-drop-ghost/drag-and-drop-ghost.component';
import { ResizableColDirective } from './directives/resizable-col/resizable-col.directive';

import { GridService } from './services/grid/grid.service';
import { OperatingSystemService } from './services/operating-system/operating-system.service';
import { DirectiveRegistrationService } from './services/directive-registration/directive-registration.service';
import { ScrollDispatcherService } from './services/scroll-dispatcher/scroll-dispatcher.service';

import { ReorderGripDirective } from './directives/reorder-grip/reorder-grip.directive';
import { ReorderColDirective } from './directives/reorder-col/reorder-col.directive';
import { DataColClassesDirective } from './directives/data-col-classes/data-col-classes.directive';
import { DataColClassDirective } from './directives/data-col-class/data-col-class.directive';
import { VirtualForDirective } from './directives/virtual-for/virtual-for.directive';
import { RenderedDirective } from './directives/rendered/rendered.directive';
import { ScrollViewportDirective } from './directives/scroll-viewport/scroll-viewport.directive';

@NgModule({
  entryComponents: [
    DragAndDropGhostComponent
  ],
  declarations: [
    GridDirective,
    GridRowDirective,
    ResizableGripDirective,
    InfiniteScrollDirective,
    HorizResizeGripComponent,
    ReorderGripComponent,
    GridComponent,
    SortableColDirective,
    EditableCellDirective,
    DragAndDropGhostComponent,
    ReorderGripDirective,
    ReorderColDirective,
    DataColClassesDirective,
    DataColClassDirective,
    ResizableColDirective,
    VirtualForDirective,
    RenderedDirective,
    ScrollViewportDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
    GridService,
    OperatingSystemService,
    DirectiveRegistrationService,
    ScrollDispatcherService
  ],
  exports: [
    GridDirective,
    GridRowDirective,
    ResizableGripDirective,
    InfiniteScrollDirective,
    HorizResizeGripComponent,
    ReorderGripComponent,
    GridComponent,
    SortableColDirective,
    EditableCellDirective,
    DragAndDropGhostComponent,
    ReorderGripDirective,
    ReorderColDirective,
    DataColClassesDirective,
    DataColClassDirective,
    ResizableColDirective,
    VirtualForDirective,
    ScrollViewportDirective
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TablejsModule { }
