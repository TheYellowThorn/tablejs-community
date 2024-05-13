import { SortDirection } from './sort-direction';
export class SortOptions {
    constructor(variableIdentifier, comparator, initialSortDirection = SortDirection.NONE, ignoreCase = true, sortOrder = 0, useLocalCompare = false, localeCompareOptions = null) {
        this.ignoreTimeOfDay = true;
        this._directionOrder = [SortDirection.ASCENDING, SortDirection.DESCENDING, SortDirection.NONE];
        this._sortDirectionIndex = -1;
        this.variableIdentifier = variableIdentifier;
        this.comparator = comparator;
        this.initialSortDirection = initialSortDirection;
        this.ignoreCase = ignoreCase;
        this.sortOrder = sortOrder;
        this.useLocaleCompare = useLocalCompare;
        this.localeCompareOptions = localeCompareOptions;
        this.sortDirection = this.initialSortDirection;
    }
    get directionOrder() {
        return this._directionOrder;
    }
    set directionOrder(order) {
        this._sortDirectionIndex = -1;
        this._directionOrder = order;
    }
    get sortDirection() {
        return this._sortDirectionIndex === -1
            ? SortDirection.NONE
            : this._directionOrder[this._sortDirectionIndex];
    }
    set sortDirection(direction) {
        this._sortDirectionIndex = this._directionOrder.indexOf(direction);
    }
    nextSortDirection() {
        this._sortDirectionIndex++;
        if (this._sortDirectionIndex >= this._directionOrder.length) {
            this._sortDirectionIndex = 0;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1vcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2ZpbHRlckFuZFNvcnQvb3B0aW9ucy9zb3J0LW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWpELE1BQU0sT0FBTyxXQUFXO0lBNkR0QixZQUNFLGtCQUEwQixFQUMxQixVQUFnRCxFQUNoRCx1QkFJOEIsYUFBYSxDQUFDLElBQUksRUFDaEQsYUFBc0IsSUFBSSxFQUMxQixZQUFvQixDQUFDLEVBQ3JCLGtCQUEyQixLQUFLLEVBQ2hDLHVCQUErRixJQUFJO1FBL0RyRyxvQkFBZSxHQUFZLElBQUksQ0FBQztRQU1oQyxvQkFBZSxHQUtULENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQXVCdEUsd0JBQW1CLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUErQnZDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7UUFDakQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUN4QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7UUFFakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDakQsQ0FBQztJQTdERCxJQUFJLGNBQWM7UUFNaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLGNBQWMsQ0FDaEIsS0FLRztRQUVILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUMvQixDQUFDO0lBSUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsbUJBQW1CLEtBQUssQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSTtZQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBSSxhQUFhLENBQ2YsU0FJc0I7UUFFdEIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUEwQk0saUJBQWlCO1FBQ3RCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRTNCLElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFO1lBQzNELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJU29ydE9wdGlvbnMgfSBmcm9tICcuL2ktc29ydC1vcHRpb25zJztcbmltcG9ydCB7IFNvcnREaXJlY3Rpb24gfSBmcm9tICcuL3NvcnQtZGlyZWN0aW9uJztcblxuZXhwb3J0IGNsYXNzIFNvcnRPcHRpb25zIGltcGxlbWVudHMgSVNvcnRPcHRpb25zIHtcbiAgcHVibGljIGlkOiBzdHJpbmc7XG4gIHZhcmlhYmxlSWRlbnRpZmllcjogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgaW5pdGlhbFNvcnREaXJlY3Rpb246XG4gICAgfCBudW1iZXJcbiAgICB8IFNvcnREaXJlY3Rpb24uREVTQ0VORElOR1xuICAgIHwgU29ydERpcmVjdGlvbi5OT05FXG4gICAgfCBTb3J0RGlyZWN0aW9uLkFTQ0VORElORztcbiAgaWdub3JlQ2FzZTogYm9vbGVhbjtcbiAgaWdub3JlVGltZU9mRGF5OiBib29sZWFuID0gdHJ1ZTtcbiAgc29ydE9yZGVyOiBudW1iZXI7XG4gIGNvbXBhcmF0b3I6ICh2YWx1ZUE6IGFueSwgdmFsdWVCOiBhbnkpID0+IG51bWJlcjtcbiAgdmFyaWFibGVNYXBwZXI/OiBGdW5jdGlvbiB8IG51bGw7XG4gIHVzZUxvY2FsZUNvbXBhcmU6IGJvb2xlYW47XG4gIGxvY2FsZUNvbXBhcmVPcHRpb25zOiBbc3RyaW5nIHwgc3RyaW5nW11dIHwgW3N0cmluZyB8IHN0cmluZ1tdLCBJbnRsLkNvbGxhdG9yT3B0aW9uc10gfCBudWxsO1xuICBfZGlyZWN0aW9uT3JkZXI6IChcbiAgICB8IG51bWJlclxuICAgIHwgU29ydERpcmVjdGlvbi5BU0NFTkRJTkdcbiAgICB8IFNvcnREaXJlY3Rpb24uREVTQ0VORElOR1xuICAgIHwgU29ydERpcmVjdGlvbi5OT05FXG4gIClbXSA9IFtTb3J0RGlyZWN0aW9uLkFTQ0VORElORywgU29ydERpcmVjdGlvbi5ERVNDRU5ESU5HLCBTb3J0RGlyZWN0aW9uLk5PTkVdO1xuXG4gIGdldCBkaXJlY3Rpb25PcmRlcigpOiAoXG4gICAgfCBudW1iZXJcbiAgICB8IFNvcnREaXJlY3Rpb24uQVNDRU5ESU5HXG4gICAgfCBTb3J0RGlyZWN0aW9uLkRFU0NFTkRJTkdcbiAgICB8IFNvcnREaXJlY3Rpb24uTk9ORVxuICApW10ge1xuICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb25PcmRlcjtcbiAgfVxuXG4gIHNldCBkaXJlY3Rpb25PcmRlcihcbiAgICBvcmRlcjogKFxuICAgICAgfCBudW1iZXJcbiAgICAgIHwgU29ydERpcmVjdGlvbi5BU0NFTkRJTkdcbiAgICAgIHwgU29ydERpcmVjdGlvbi5ERVNDRU5ESU5HXG4gICAgICB8IFNvcnREaXJlY3Rpb24uTk9ORVxuICAgIClbXVxuICApIHtcbiAgICB0aGlzLl9zb3J0RGlyZWN0aW9uSW5kZXggPSAtMTtcbiAgICB0aGlzLl9kaXJlY3Rpb25PcmRlciA9IG9yZGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBfc29ydERpcmVjdGlvbkluZGV4OiBudW1iZXIgPSAtMTtcblxuICBnZXQgc29ydERpcmVjdGlvbigpOiBudW1iZXJ8IFNvcnREaXJlY3Rpb24uQVNDRU5ESU5HIHwgU29ydERpcmVjdGlvbi5ERVNDRU5ESU5HIHwgU29ydERpcmVjdGlvbi5OT05FIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydERpcmVjdGlvbkluZGV4ID09PSAtMVxuICAgICAgPyBTb3J0RGlyZWN0aW9uLk5PTkVcbiAgICAgIDogdGhpcy5fZGlyZWN0aW9uT3JkZXJbdGhpcy5fc29ydERpcmVjdGlvbkluZGV4XTtcbiAgfVxuXG4gIHNldCBzb3J0RGlyZWN0aW9uKFxuICAgIGRpcmVjdGlvbjpcbiAgICAgIHwgbnVtYmVyXG4gICAgICB8IFNvcnREaXJlY3Rpb24uQVNDRU5ESU5HXG4gICAgICB8IFNvcnREaXJlY3Rpb24uREVTQ0VORElOR1xuICAgICAgfCBTb3J0RGlyZWN0aW9uLk5PTkVcbiAgKSB7XG4gICAgdGhpcy5fc29ydERpcmVjdGlvbkluZGV4ID0gdGhpcy5fZGlyZWN0aW9uT3JkZXIuaW5kZXhPZihkaXJlY3Rpb24pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdmFyaWFibGVJZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgY29tcGFyYXRvcjogKHZhbHVlQTogYW55LCB2YWx1ZUI6IGFueSkgPT4gbnVtYmVyLFxuICAgIGluaXRpYWxTb3J0RGlyZWN0aW9uOlxuICAgICAgfCBudW1iZXJcbiAgICAgIHwgU29ydERpcmVjdGlvbi5ERVNDRU5ESU5HXG4gICAgICB8IFNvcnREaXJlY3Rpb24uTk9ORVxuICAgICAgfCBTb3J0RGlyZWN0aW9uLkFTQ0VORElORyA9IFNvcnREaXJlY3Rpb24uTk9ORSxcbiAgICBpZ25vcmVDYXNlOiBib29sZWFuID0gdHJ1ZSxcbiAgICBzb3J0T3JkZXI6IG51bWJlciA9IDAsXG4gICAgdXNlTG9jYWxDb21wYXJlOiBib29sZWFuID0gZmFsc2UsXG4gICAgbG9jYWxlQ29tcGFyZU9wdGlvbnM6IFtzdHJpbmcgfCBzdHJpbmdbXV0gfCBbc3RyaW5nIHwgc3RyaW5nW10sIEludGwuQ29sbGF0b3JPcHRpb25zXSB8IG51bGwgPSBudWxsXG4gICkge1xuICAgIHRoaXMudmFyaWFibGVJZGVudGlmaWVyID0gdmFyaWFibGVJZGVudGlmaWVyO1xuICAgIHRoaXMuY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5pbml0aWFsU29ydERpcmVjdGlvbiA9IGluaXRpYWxTb3J0RGlyZWN0aW9uO1xuICAgIHRoaXMuaWdub3JlQ2FzZSA9IGlnbm9yZUNhc2U7XG4gICAgdGhpcy5zb3J0T3JkZXIgPSBzb3J0T3JkZXI7XG4gICAgdGhpcy51c2VMb2NhbGVDb21wYXJlID0gdXNlTG9jYWxDb21wYXJlO1xuICAgIHRoaXMubG9jYWxlQ29tcGFyZU9wdGlvbnMgPSBsb2NhbGVDb21wYXJlT3B0aW9ucztcblxuICAgIHRoaXMuc29ydERpcmVjdGlvbiA9IHRoaXMuaW5pdGlhbFNvcnREaXJlY3Rpb247XG4gIH1cblxuICBwdWJsaWMgbmV4dFNvcnREaXJlY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fc29ydERpcmVjdGlvbkluZGV4Kys7XG5cbiAgICBpZiAodGhpcy5fc29ydERpcmVjdGlvbkluZGV4ID49IHRoaXMuX2RpcmVjdGlvbk9yZGVyLmxlbmd0aCkge1xuICAgICAgdGhpcy5fc29ydERpcmVjdGlvbkluZGV4ID0gMDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==