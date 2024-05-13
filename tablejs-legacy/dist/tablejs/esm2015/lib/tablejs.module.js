import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizResizeGripComponent } from './components/horiz-resize-grip/horiz-resize-grip.component';
import { ReorderGripComponent } from './components/reorder-grip/reorder-grip.component';
import { GridDirective } from './directives/grid/grid.directive';
import { GridRowDirective } from './directives/grid-row/grid-row.directive';
import { ResizableGripDirective } from './directives/resizable-grip/resizable-grip.directive';
import { InfiniteScrollDirective } from './directives/infinite-scroll/infinite-scroll.directive';
import { GridComponent } from './components/grid/grid.component';
import { EditableCellDirective } from './directives/editable-cell/editable-cell.directive';
import { DragAndDropGhostComponent } from './components/drag-and-drop-ghost/drag-and-drop-ghost.component';
import { ScrollPrevSpacerComponent } from './components/scroll-prev-spacer/scroll-prev-spacer.component';
import { GridService } from './services/grid/grid.service';
import { OperatingSystemService } from './services/operating-system/operating-system.service';
import { DirectiveRegistrationService } from './services/directive-registration/directive-registration.service';
import { ScrollDispatcherService } from './services/scroll-dispatcher/scroll-dispatcher.service';
import { ReorderGripDirective } from './directives/reorder-grip/reorder-grip.directive';
import { ReorderColDirective } from './directives/reorder-col/reorder-col.directive';
import { DataColClassesDirective } from './directives/data-col-classes/data-col-classes.directive';
import { DataColClassDirective } from './directives/data-col-class/data-col-class.directive';
import { VirtualForDirective } from './directives/virtual-for/virtual-for.directive';
import { ScrollViewportDirective } from './directives/scroll-viewport/scroll-viewport.directive';
import { HideColumnIfDirective } from './directives/hide-column-if/hide-column-if.directive';
export class TablejsModule {
}
TablejsModule.decorators = [
    { type: NgModule, args: [{
                entryComponents: [
                    DragAndDropGhostComponent,
                    ScrollPrevSpacerComponent
                ],
                declarations: [
                    GridDirective,
                    GridRowDirective,
                    ResizableGripDirective,
                    InfiniteScrollDirective,
                    HorizResizeGripComponent,
                    ReorderGripComponent,
                    GridComponent,
                    EditableCellDirective,
                    DragAndDropGhostComponent,
                    ReorderGripDirective,
                    ReorderColDirective,
                    DataColClassesDirective,
                    DataColClassDirective,
                    VirtualForDirective,
                    ScrollViewportDirective,
                    ScrollPrevSpacerComponent,
                    HideColumnIfDirective
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
                    EditableCellDirective,
                    DragAndDropGhostComponent,
                    ReorderGripDirective,
                    ReorderColDirective,
                    DataColClassesDirective,
                    DataColClassDirective,
                    VirtualForDirective,
                    ScrollViewportDirective,
                    HideColumnIfDirective
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGVqcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvdGFibGVqcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdEcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDeEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMzRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUMzRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUV6RyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDOUYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDaEgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFakcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDeEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDckYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDbkcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDN0YsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDckYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDakcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUF1RDdGLE1BQU0sT0FBTyxhQUFhOzs7WUFyRHpCLFFBQVEsU0FBQztnQkFDUixlQUFlLEVBQUU7b0JBQ2YseUJBQXlCO29CQUN6Qix5QkFBeUI7aUJBQzFCO2dCQUNELFlBQVksRUFBRTtvQkFDWixhQUFhO29CQUNiLGdCQUFnQjtvQkFDaEIsc0JBQXNCO29CQUN0Qix1QkFBdUI7b0JBQ3ZCLHdCQUF3QjtvQkFDeEIsb0JBQW9CO29CQUNwQixhQUFhO29CQUNiLHFCQUFxQjtvQkFDckIseUJBQXlCO29CQUN6QixvQkFBb0I7b0JBQ3BCLG1CQUFtQjtvQkFDbkIsdUJBQXVCO29CQUN2QixxQkFBcUI7b0JBQ3JCLG1CQUFtQjtvQkFDbkIsdUJBQXVCO29CQUN2Qix5QkFBeUI7b0JBQ3pCLHFCQUFxQjtpQkFDdEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLFlBQVk7aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULFdBQVc7b0JBQ1gsc0JBQXNCO29CQUN0Qiw0QkFBNEI7b0JBQzVCLHVCQUF1QjtpQkFDeEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGFBQWE7b0JBQ2IsZ0JBQWdCO29CQUNoQixzQkFBc0I7b0JBQ3RCLHVCQUF1QjtvQkFDdkIsd0JBQXdCO29CQUN4QixvQkFBb0I7b0JBQ3BCLGFBQWE7b0JBQ2IscUJBQXFCO29CQUNyQix5QkFBeUI7b0JBQ3pCLG9CQUFvQjtvQkFDcEIsbUJBQW1CO29CQUNuQix1QkFBdUI7b0JBQ3ZCLHFCQUFxQjtvQkFDckIsbUJBQW1CO29CQUNuQix1QkFBdUI7b0JBQ3ZCLHFCQUFxQjtpQkFDdEI7Z0JBQ0QsT0FBTyxFQUFFLENBQUUsc0JBQXNCLENBQUU7YUFDcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgSG9yaXpSZXNpemVHcmlwQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2hvcml6LXJlc2l6ZS1ncmlwL2hvcml6LXJlc2l6ZS1ncmlwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSZW9yZGVyR3JpcENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9yZW9yZGVyLWdyaXAvcmVvcmRlci1ncmlwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBHcmlkRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2dyaWQvZ3JpZC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgR3JpZFJvd0RpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9ncmlkLXJvdy9ncmlkLXJvdy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUmVzaXphYmxlR3JpcERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9yZXNpemFibGUtZ3JpcC9yZXNpemFibGUtZ3JpcC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSW5maW5pdGVTY3JvbGxEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvaW5maW5pdGUtc2Nyb2xsL2luZmluaXRlLXNjcm9sbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgR3JpZENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9ncmlkL2dyaWQuY29tcG9uZW50JztcbmltcG9ydCB7IEVkaXRhYmxlQ2VsbERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9lZGl0YWJsZS1jZWxsL2VkaXRhYmxlLWNlbGwuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWdBbmREcm9wR2hvc3RDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZHJhZy1hbmQtZHJvcC1naG9zdC9kcmFnLWFuZC1kcm9wLWdob3N0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTY3JvbGxQcmV2U3BhY2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Njcm9sbC1wcmV2LXNwYWNlci9zY3JvbGwtcHJldi1zcGFjZXIuY29tcG9uZW50JztcblxuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlJztcbmltcG9ydCB7IE9wZXJhdGluZ1N5c3RlbVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL29wZXJhdGluZy1zeXN0ZW0vb3BlcmF0aW5nLXN5c3RlbS5zZXJ2aWNlJztcbmltcG9ydCB7IERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24vZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9zY3JvbGwtZGlzcGF0Y2hlci9zY3JvbGwtZGlzcGF0Y2hlci5zZXJ2aWNlJztcblxuaW1wb3J0IHsgUmVvcmRlckdyaXBEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVvcmRlci1ncmlwL3Jlb3JkZXItZ3JpcC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUmVvcmRlckNvbERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9yZW9yZGVyLWNvbC9yZW9yZGVyLWNvbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YUNvbENsYXNzZXNEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZGF0YS1jb2wtY2xhc3Nlcy9kYXRhLWNvbC1jbGFzc2VzLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhQ29sQ2xhc3NEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZGF0YS1jb2wtY2xhc3MvZGF0YS1jb2wtY2xhc3MuZGlyZWN0aXZlJztcbmltcG9ydCB7IFZpcnR1YWxGb3JEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvdmlydHVhbC1mb3IvdmlydHVhbC1mb3IuZGlyZWN0aXZlJztcbmltcG9ydCB7IFNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3Njcm9sbC12aWV3cG9ydC9zY3JvbGwtdmlld3BvcnQuZGlyZWN0aXZlJztcbmltcG9ydCB7IEhpZGVDb2x1bW5JZkRpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9oaWRlLWNvbHVtbi1pZi9oaWRlLWNvbHVtbi1pZi5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICBEcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50LFxuICAgIFNjcm9sbFByZXZTcGFjZXJDb21wb25lbnRcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgR3JpZERpcmVjdGl2ZSxcbiAgICBHcmlkUm93RGlyZWN0aXZlLFxuICAgIFJlc2l6YWJsZUdyaXBEaXJlY3RpdmUsXG4gICAgSW5maW5pdGVTY3JvbGxEaXJlY3RpdmUsXG4gICAgSG9yaXpSZXNpemVHcmlwQ29tcG9uZW50LFxuICAgIFJlb3JkZXJHcmlwQ29tcG9uZW50LFxuICAgIEdyaWRDb21wb25lbnQsXG4gICAgRWRpdGFibGVDZWxsRGlyZWN0aXZlLFxuICAgIERyYWdBbmREcm9wR2hvc3RDb21wb25lbnQsXG4gICAgUmVvcmRlckdyaXBEaXJlY3RpdmUsXG4gICAgUmVvcmRlckNvbERpcmVjdGl2ZSxcbiAgICBEYXRhQ29sQ2xhc3Nlc0RpcmVjdGl2ZSxcbiAgICBEYXRhQ29sQ2xhc3NEaXJlY3RpdmUsXG4gICAgVmlydHVhbEZvckRpcmVjdGl2ZSxcbiAgICBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSxcbiAgICBTY3JvbGxQcmV2U3BhY2VyQ29tcG9uZW50LFxuICAgIEhpZGVDb2x1bW5JZkRpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIEdyaWRTZXJ2aWNlLFxuICAgIE9wZXJhdGluZ1N5c3RlbVNlcnZpY2UsXG4gICAgRGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZSxcbiAgICBTY3JvbGxEaXNwYXRjaGVyU2VydmljZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgR3JpZERpcmVjdGl2ZSxcbiAgICBHcmlkUm93RGlyZWN0aXZlLFxuICAgIFJlc2l6YWJsZUdyaXBEaXJlY3RpdmUsXG4gICAgSW5maW5pdGVTY3JvbGxEaXJlY3RpdmUsXG4gICAgSG9yaXpSZXNpemVHcmlwQ29tcG9uZW50LFxuICAgIFJlb3JkZXJHcmlwQ29tcG9uZW50LFxuICAgIEdyaWRDb21wb25lbnQsXG4gICAgRWRpdGFibGVDZWxsRGlyZWN0aXZlLFxuICAgIERyYWdBbmREcm9wR2hvc3RDb21wb25lbnQsXG4gICAgUmVvcmRlckdyaXBEaXJlY3RpdmUsXG4gICAgUmVvcmRlckNvbERpcmVjdGl2ZSxcbiAgICBEYXRhQ29sQ2xhc3Nlc0RpcmVjdGl2ZSxcbiAgICBEYXRhQ29sQ2xhc3NEaXJlY3RpdmUsXG4gICAgVmlydHVhbEZvckRpcmVjdGl2ZSxcbiAgICBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSxcbiAgICBIaWRlQ29sdW1uSWZEaXJlY3RpdmVcbiAgXSxcbiAgc2NoZW1hczogWyBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIF1cbn0pXG5leHBvcnQgY2xhc3MgVGFibGVqc01vZHVsZSB7IH1cbiJdfQ==