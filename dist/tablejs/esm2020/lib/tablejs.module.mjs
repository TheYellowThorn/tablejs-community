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
import * as i0 from "@angular/core";
export class TablejsModule {
}
TablejsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: TablejsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TablejsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.5", ngImport: i0, type: TablejsModule, declarations: [GridDirective,
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
        HideColumnIfDirective], imports: [CommonModule], exports: [GridDirective,
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
        HideColumnIfDirective] });
TablejsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: TablejsModule, providers: [
        GridService,
        OperatingSystemService,
        DirectiveRegistrationService,
        ScrollDispatcherService
    ], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: TablejsModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGVqcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvdGFibGVqcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdEcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDeEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMzRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUMzRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUV6RyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDOUYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDaEgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFakcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDeEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDckYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDbkcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDN0YsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDckYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDakcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0RBQXNELENBQUM7O0FBdUQ3RixNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQS9DdEIsYUFBYTtRQUNiLGdCQUFnQjtRQUNoQixzQkFBc0I7UUFDdEIsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4QixvQkFBb0I7UUFDcEIsYUFBYTtRQUNiLHFCQUFxQjtRQUNyQix5QkFBeUI7UUFDekIsb0JBQW9CO1FBQ3BCLG1CQUFtQjtRQUNuQix1QkFBdUI7UUFDdkIscUJBQXFCO1FBQ3JCLG1CQUFtQjtRQUNuQix1QkFBdUI7UUFDdkIseUJBQXlCO1FBQ3pCLHFCQUFxQixhQUdyQixZQUFZLGFBU1osYUFBYTtRQUNiLGdCQUFnQjtRQUNoQixzQkFBc0I7UUFDdEIsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4QixvQkFBb0I7UUFDcEIsYUFBYTtRQUNiLHFCQUFxQjtRQUNyQix5QkFBeUI7UUFDekIsb0JBQW9CO1FBQ3BCLG1CQUFtQjtRQUNuQix1QkFBdUI7UUFDdkIscUJBQXFCO1FBQ3JCLG1CQUFtQjtRQUNuQix1QkFBdUI7UUFDdkIscUJBQXFCOzJHQUlaLGFBQWEsYUExQmI7UUFDVCxXQUFXO1FBQ1gsc0JBQXNCO1FBQ3RCLDRCQUE0QjtRQUM1Qix1QkFBdUI7S0FDeEIsWUFQQyxZQUFZOzJGQTRCSCxhQUFhO2tCQXJEekIsUUFBUTttQkFBQztvQkFDUixlQUFlLEVBQUU7d0JBQ2YseUJBQXlCO3dCQUN6Qix5QkFBeUI7cUJBQzFCO29CQUNELFlBQVksRUFBRTt3QkFDWixhQUFhO3dCQUNiLGdCQUFnQjt3QkFDaEIsc0JBQXNCO3dCQUN0Qix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIsb0JBQW9CO3dCQUNwQixhQUFhO3dCQUNiLHFCQUFxQjt3QkFDckIseUJBQXlCO3dCQUN6QixvQkFBb0I7d0JBQ3BCLG1CQUFtQjt3QkFDbkIsdUJBQXVCO3dCQUN2QixxQkFBcUI7d0JBQ3JCLG1CQUFtQjt3QkFDbkIsdUJBQXVCO3dCQUN2Qix5QkFBeUI7d0JBQ3pCLHFCQUFxQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7cUJBQ2I7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULFdBQVc7d0JBQ1gsc0JBQXNCO3dCQUN0Qiw0QkFBNEI7d0JBQzVCLHVCQUF1QjtxQkFDeEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGFBQWE7d0JBQ2IsZ0JBQWdCO3dCQUNoQixzQkFBc0I7d0JBQ3RCLHVCQUF1Qjt3QkFDdkIsd0JBQXdCO3dCQUN4QixvQkFBb0I7d0JBQ3BCLGFBQWE7d0JBQ2IscUJBQXFCO3dCQUNyQix5QkFBeUI7d0JBQ3pCLG9CQUFvQjt3QkFDcEIsbUJBQW1CO3dCQUNuQix1QkFBdUI7d0JBQ3ZCLHFCQUFxQjt3QkFDckIsbUJBQW1CO3dCQUNuQix1QkFBdUI7d0JBQ3ZCLHFCQUFxQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFLENBQUUsc0JBQXNCLENBQUU7aUJBQ3BDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IEhvcml6UmVzaXplR3JpcENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9ob3Jpei1yZXNpemUtZ3JpcC9ob3Jpei1yZXNpemUtZ3JpcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUmVvcmRlckdyaXBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVvcmRlci1ncmlwL3Jlb3JkZXItZ3JpcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgR3JpZERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9ncmlkL2dyaWQuZGlyZWN0aXZlJztcbmltcG9ydCB7IEdyaWRSb3dEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZ3JpZC1yb3cvZ3JpZC1yb3cuZGlyZWN0aXZlJztcbmltcG9ydCB7IFJlc2l6YWJsZUdyaXBEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVzaXphYmxlLWdyaXAvcmVzaXphYmxlLWdyaXAuZGlyZWN0aXZlJztcbmltcG9ydCB7IEluZmluaXRlU2Nyb2xsRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2luZmluaXRlLXNjcm9sbC9pbmZpbml0ZS1zY3JvbGwuZGlyZWN0aXZlJztcbmltcG9ydCB7IEdyaWRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZ3JpZC9ncmlkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFZGl0YWJsZUNlbGxEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZWRpdGFibGUtY2VsbC9lZGl0YWJsZS1jZWxsLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RyYWctYW5kLWRyb3AtZ2hvc3QvZHJhZy1hbmQtZHJvcC1naG9zdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2Nyb2xsUHJldlNwYWNlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zY3JvbGwtcHJldi1zcGFjZXIvc2Nyb2xsLXByZXYtc3BhY2VyLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9ncmlkL2dyaWQuc2VydmljZSc7XG5pbXBvcnQgeyBPcGVyYXRpbmdTeXN0ZW1TZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9vcGVyYXRpbmctc3lzdGVtL29wZXJhdGluZy1zeXN0ZW0uc2VydmljZSc7XG5pbXBvcnQgeyBEaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9kaXJlY3RpdmUtcmVnaXN0cmF0aW9uL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBTY3JvbGxEaXNwYXRjaGVyU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvc2Nyb2xsLWRpc3BhdGNoZXIvc2Nyb2xsLWRpc3BhdGNoZXIuc2VydmljZSc7XG5cbmltcG9ydCB7IFJlb3JkZXJHcmlwRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3Jlb3JkZXItZ3JpcC9yZW9yZGVyLWdyaXAuZGlyZWN0aXZlJztcbmltcG9ydCB7IFJlb3JkZXJDb2xEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVvcmRlci1jb2wvcmVvcmRlci1jb2wuZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGFDb2xDbGFzc2VzRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2RhdGEtY29sLWNsYXNzZXMvZGF0YS1jb2wtY2xhc3Nlcy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YUNvbENsYXNzRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2RhdGEtY29sLWNsYXNzL2RhdGEtY29sLWNsYXNzLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBWaXJ0dWFsRm9yRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZpcnR1YWwtZm9yL3ZpcnR1YWwtZm9yLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9zY3JvbGwtdmlld3BvcnQvc2Nyb2xsLXZpZXdwb3J0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBIaWRlQ29sdW1uSWZEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvaGlkZS1jb2x1bW4taWYvaGlkZS1jb2x1bW4taWYuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgRHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudCxcbiAgICBTY3JvbGxQcmV2U3BhY2VyQ29tcG9uZW50XG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEdyaWREaXJlY3RpdmUsXG4gICAgR3JpZFJvd0RpcmVjdGl2ZSxcbiAgICBSZXNpemFibGVHcmlwRGlyZWN0aXZlLFxuICAgIEluZmluaXRlU2Nyb2xsRGlyZWN0aXZlLFxuICAgIEhvcml6UmVzaXplR3JpcENvbXBvbmVudCxcbiAgICBSZW9yZGVyR3JpcENvbXBvbmVudCxcbiAgICBHcmlkQ29tcG9uZW50LFxuICAgIEVkaXRhYmxlQ2VsbERpcmVjdGl2ZSxcbiAgICBEcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50LFxuICAgIFJlb3JkZXJHcmlwRGlyZWN0aXZlLFxuICAgIFJlb3JkZXJDb2xEaXJlY3RpdmUsXG4gICAgRGF0YUNvbENsYXNzZXNEaXJlY3RpdmUsXG4gICAgRGF0YUNvbENsYXNzRGlyZWN0aXZlLFxuICAgIFZpcnR1YWxGb3JEaXJlY3RpdmUsXG4gICAgU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUsXG4gICAgU2Nyb2xsUHJldlNwYWNlckNvbXBvbmVudCxcbiAgICBIaWRlQ29sdW1uSWZEaXJlY3RpdmVcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBHcmlkU2VydmljZSxcbiAgICBPcGVyYXRpbmdTeXN0ZW1TZXJ2aWNlLFxuICAgIERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UsXG4gICAgU2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2VcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEdyaWREaXJlY3RpdmUsXG4gICAgR3JpZFJvd0RpcmVjdGl2ZSxcbiAgICBSZXNpemFibGVHcmlwRGlyZWN0aXZlLFxuICAgIEluZmluaXRlU2Nyb2xsRGlyZWN0aXZlLFxuICAgIEhvcml6UmVzaXplR3JpcENvbXBvbmVudCxcbiAgICBSZW9yZGVyR3JpcENvbXBvbmVudCxcbiAgICBHcmlkQ29tcG9uZW50LFxuICAgIEVkaXRhYmxlQ2VsbERpcmVjdGl2ZSxcbiAgICBEcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50LFxuICAgIFJlb3JkZXJHcmlwRGlyZWN0aXZlLFxuICAgIFJlb3JkZXJDb2xEaXJlY3RpdmUsXG4gICAgRGF0YUNvbENsYXNzZXNEaXJlY3RpdmUsXG4gICAgRGF0YUNvbENsYXNzRGlyZWN0aXZlLFxuICAgIFZpcnR1YWxGb3JEaXJlY3RpdmUsXG4gICAgU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUsXG4gICAgSGlkZUNvbHVtbklmRGlyZWN0aXZlXG4gIF0sXG4gIHNjaGVtYXM6IFsgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSBdXG59KVxuZXhwb3J0IGNsYXNzIFRhYmxlanNNb2R1bGUgeyB9XG4iXX0=