import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FilterSortService } from './services/filter-sort.service';
import * as i0 from "@angular/core";
export class FilterAndSortModule {
}
FilterAndSortModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterAndSortModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FilterAndSortModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.5", ngImport: i0, type: FilterAndSortModule, imports: [BrowserModule] });
FilterAndSortModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterAndSortModule, providers: [FilterSortService], imports: [BrowserModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterAndSortModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [BrowserModule],
                    declarations: [],
                    providers: [FilterSortService],
                    exports: [],
                    bootstrap: [],
                }]
        }] });
export * from './services/filter-sort.service';
export * from './options/sort-direction';
export * from './options/sort-options';
export * from './options/i-sort-options';
export * from './options/filter-options';
export * from './options/i-filter-options';
export * from './comparators/comparator';
export * from './comparators/sort-comparator';
export * from './comparators/filter-comparator';
export * from './comparators/match-type';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLWFuZC1zb3J0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9maWx0ZXJBbmRTb3J0L2ZpbHRlci1hbmQtc29ydC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7O0FBU25FLE1BQU0sT0FBTyxtQkFBbUI7O2dIQUFuQixtQkFBbUI7aUhBQW5CLG1CQUFtQixZQU5wQixhQUFhO2lIQU1aLG1CQUFtQixhQUpuQixDQUFDLGlCQUFpQixDQUFDLFlBRnBCLGFBQWE7MkZBTVosbUJBQW1CO2tCQVAvQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDeEIsWUFBWSxFQUFFLEVBQUU7b0JBQ2hCLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO29CQUM5QixPQUFPLEVBQUUsRUFBRTtvQkFDWCxTQUFTLEVBQUUsRUFBRTtpQkFDZDs7QUFHRCxjQUFjLGdDQUFnQyxDQUFDO0FBQy9DLGNBQWMsMEJBQTBCLENBQUM7QUFDekMsY0FBYyx3QkFBd0IsQ0FBQztBQUN2QyxjQUFjLDBCQUEwQixDQUFDO0FBQ3pDLGNBQWMsMEJBQTBCLENBQUM7QUFDekMsY0FBYyw0QkFBNEIsQ0FBQztBQUMzQyxjQUFjLDBCQUEwQixDQUFDO0FBQ3pDLGNBQWMsK0JBQStCLENBQUM7QUFDOUMsY0FBYyxpQ0FBaUMsQ0FBQztBQUNoRCxjQUFjLDBCQUEwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgRmlsdGVyU29ydFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2ZpbHRlci1zb3J0LnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQnJvd3Nlck1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW10sXG4gIHByb3ZpZGVyczogW0ZpbHRlclNvcnRTZXJ2aWNlXSxcbiAgZXhwb3J0czogW10sXG4gIGJvb3RzdHJhcDogW10sXG59KVxuZXhwb3J0IGNsYXNzIEZpbHRlckFuZFNvcnRNb2R1bGUge31cblxuZXhwb3J0ICogZnJvbSAnLi9zZXJ2aWNlcy9maWx0ZXItc29ydC5zZXJ2aWNlJztcbmV4cG9ydCAqIGZyb20gJy4vb3B0aW9ucy9zb3J0LWRpcmVjdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL29wdGlvbnMvc29ydC1vcHRpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vb3B0aW9ucy9pLXNvcnQtb3B0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL29wdGlvbnMvZmlsdGVyLW9wdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9vcHRpb25zL2ktZmlsdGVyLW9wdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9jb21wYXJhdG9ycy9jb21wYXJhdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcGFyYXRvcnMvc29ydC1jb21wYXJhdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcGFyYXRvcnMvZmlsdGVyLWNvbXBhcmF0b3InO1xuZXhwb3J0ICogZnJvbSAnLi9jb21wYXJhdG9ycy9tYXRjaC10eXBlJztcbiJdfQ==