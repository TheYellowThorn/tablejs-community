import { Injectable } from '@angular/core';
import { Comparator } from './../comparators/comparator';
import { SortDirection } from '../options/sort-direction';
import * as i0 from "@angular/core";
export class FilterSortService {
    get currentFilterOptions() {
        return this._currentFilterOptions;
    }
    get currentSortOptions() {
        return this._currentSortOptions;
    }
    get itemsBeingFilteredAndSorted() {
        return this._items;
    }
    constructor() {
        this.autoDefineUnsetProperties = false;
        Comparator.filterSortService = this;
    }
    filterAndSortItems(items, filterOptions, sortOptions) {
        let filteredItems;
        this._items = items;
        filteredItems = items;
        if (filterOptions) {
            if (Array.isArray(filterOptions)) {
                const filterOptionsLen = filterOptions.length;
                for (let i = 0; i < filterOptionsLen; i++) {
                    const options = filterOptions[i];
                    this._currentFilterOptions = options;
                    filteredItems = this.filterItemsByVarNames(filteredItems, options);
                }
            }
            else {
                filteredItems = this.filterItemsByVarNames(filteredItems, filterOptions);
            }
        }
        if (sortOptions) {
            if (Array.isArray(sortOptions)) {
                filteredItems = this.multiSortItemsByVarName(filteredItems, sortOptions);
            }
            else {
                filteredItems = this.sortItemsByVarName(filteredItems, sortOptions);
            }
        }
        return filteredItems;
    }
    isString(val) {
        return typeof val === 'string' || val instanceof String;
    }
    filterItemsByVarNames(items, filterOptions) {
        this._currentFilterOptions = filterOptions;
        if (!filterOptions) {
            throw Error('A FilterOptions object is not defined. Please supply filter options to sort items by.');
        }
        const varNames = this.isString(filterOptions.variableIdentifiers)
            ? [filterOptions.variableIdentifiers]
            : filterOptions.variableIdentifiers;
        this.ignoreCase = filterOptions.ignoreCase;
        if (items === null || items === undefined) {
            throw Error('Item array is not defined. Please supply a defined array to filter.');
        }
        if (items.length === 0) {
            return items;
        }
        this.filterSplits = [];
        const numOfVarNames = varNames && varNames.length > 0 ? varNames.length : 0;
        for (let i = 0; i < numOfVarNames; i++) {
            this.splitVariablesFromIdentifier(varNames[i]);
            this.filterSplits.push(this.splits);
        }
        this.filterSplitsLen = this.filterSplits.length;
        items = items.concat();
        items = items.filter(filterOptions.comparator);
        return items;
    }
    splitVariablesFromIdentifier(varName) {
        if (varName === null || varName === undefined || varName === '') {
            this.splits = [];
            this.splitsLen = this.splits.length;
            return;
        }
        const containsBrackets = varName.includes('[');
        this.splits = varName.split('.');
        this.splitsLen = this.splits.length;
        if (containsBrackets) {
            const bracketSplits = [];
            for (let i = 0; i < this.splitsLen; i++) {
                let split = this.splits[i];
                let startBracketIndex = split.indexOf('[');
                if (startBracketIndex !== -1) {
                    while (split !== '') {
                        const endBracketIndex = split.indexOf(']') + 1;
                        const preBracketVar = split.substring(0, startBracketIndex);
                        const brackets = split.substring(startBracketIndex + 1, endBracketIndex - 1);
                        const postBracketVar = split.substring(endBracketIndex, split.length);
                        split = postBracketVar;
                        startBracketIndex = split.indexOf('[');
                        if (preBracketVar !== '') {
                            bracketSplits.push(preBracketVar);
                        }
                        bracketSplits.push(brackets);
                    }
                }
                else {
                    bracketSplits.push(split);
                }
            }
            this.splits = bracketSplits;
        }
        this.splitsLen = this.splits.length;
        let varStr = '(array item)';
        this.varNames = [varStr];
        for (let i = 0; i < this.splitsLen; i++) {
            this.vName = this.splits[i];
            if (isNaN(Number(this.vName))) {
                varStr += '.' + this.vName;
            }
            else {
                varStr += '[' + this.vName + ']';
            }
            this.varNames.push(varStr);
        }
    }
    sortItemsByVarName(items, sortOptions) {
        this._currentSortOptions = sortOptions;
        if (!sortOptions) {
            throw Error('A SortOptions object is not defined. Please supply filter options to sort items by.');
        }
        const varName = sortOptions.variableIdentifier;
        this.sortDirection = sortOptions.sortDirection;
        this.ignoreCase = sortOptions.ignoreCase;
        if (items === null || items === undefined) {
            throw Error('Item array is not defined. Please supply a defined array to sort.');
        }
        if (items.length === 0) {
            return items;
        }
        this.splitVariablesFromIdentifier(varName);
        items = items.concat();
        if (this.sortDirection !== SortDirection.NONE) {
            items.sort(sortOptions.comparator);
        }
        return items;
    }
    multiSortItemsByVarName(items, sortOptionsGroup) {
        sortOptionsGroup.sort((sortOptionsA, sortOptionsB) => {
            if (!sortOptionsA || !sortOptionsB) {
                return 0;
            }
            const orderA = sortOptionsA.sortOrder;
            const orderB = sortOptionsB.sortOrder;
            if (orderA === orderB) {
                return 0;
            }
            return orderA > orderB ? 1 : -1;
        });
        sortOptionsGroup.forEach((sortOptions) => {
            items = this.sortItemsByVarName(items, sortOptions);
        });
        return items;
    }
    getFilterValuesFromPropertyIndentifiers(value) {
        this.filterSplitsLen = this.filterSplits.length;
        const vals = this.filterSplitsLen === 0 ? [value] : [];
        for (let j = 0; j < this.filterSplitsLen; j++) {
            let varA = value;
            const splits = this.filterSplits[j];
            const splitsLen = splits.length;
            for (let i = 0; i < splitsLen; i++) {
                this.vName = splits[i];
                if (!varA.hasOwnProperty(this.vName)) {
                    if (!this.autoDefineUnsetProperties) {
                        throw Error(`Property ${this.vName} not found on ${this.varNames[i]}`);
                    }
                    this.defineProperty(varA, this.vName);
                }
                else {
                    varA = varA[this.vName];
                }
            }
            vals.push(varA);
        }
        return vals;
    }
    defineProperty(obj, propName, value = undefined, writable = true) {
        Object.defineProperty(obj, propName, {
            value: value,
            writable: writable
        });
    }
    getSortValuesFromPropertyIdentifiers(valueA, valueB) {
        let varA = valueA;
        let varB = valueB;
        for (let i = 0; i < this.splitsLen; i++) {
            this.vName = this.splits[i];
            if (!varA.hasOwnProperty(this.vName) ||
                !varB.hasOwnProperty(this.vName)) {
                throw Error(`Property ${this.vName} not found on ${this.varNames[i]}`);
            }
            varA = varA[this.vName];
            varB = varB[this.vName];
        }
        return [varA, varB];
    }
}
FilterSortService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterSortService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FilterSortService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterSortService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterSortService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLXNvcnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9maWx0ZXJBbmRTb3J0L3NlcnZpY2VzL2ZpbHRlci1zb3J0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHekQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQUsxRCxNQUFNLE9BQU8saUJBQWlCO0lBZTVCLElBQVcsb0JBQW9CO1FBQzdCLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBQ3BDLENBQUM7SUFDRCxJQUFXLGtCQUFrQjtRQUMzQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsSUFBVywyQkFBMkI7UUFDcEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRDtRQXhCTyw4QkFBeUIsR0FBWSxLQUFLLENBQUM7UUF5QmhELFVBQVUsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDdEMsQ0FBQztJQUVELGtCQUFrQixDQUNoQixLQUFZLEVBQ1osYUFLUSxFQUNSLFdBQWlHO1FBRWpHLElBQUksYUFBb0IsQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixhQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXRCLElBQUksYUFBYSxFQUFFO1lBQ2pCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDaEMsTUFBTSxnQkFBZ0IsR0FBVyxhQUFhLENBQUMsTUFBTSxDQUFDO2dCQUN0RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLEVBQUUs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LENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekI7UUFFRCxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7OzhHQWpTVSxpQkFBaUI7a0hBQWpCLGlCQUFpQixjQUZoQixNQUFNOzJGQUVQLGlCQUFpQjtrQkFIN0IsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJU29ydE9wdGlvbnMgfSBmcm9tICcuLy4uL29wdGlvbnMvaS1zb3J0LW9wdGlvbnMnO1xuaW1wb3J0IHsgU29ydE9wdGlvbnMgfSBmcm9tICcuLy4uL29wdGlvbnMvc29ydC1vcHRpb25zJztcbmltcG9ydCB7IENvbXBhcmF0b3IgfSBmcm9tICcuLy4uL2NvbXBhcmF0b3JzL2NvbXBhcmF0b3InO1xuaW1wb3J0IHsgSUZpbHRlck9wdGlvbnMgfSBmcm9tICcuLy4uL29wdGlvbnMvaS1maWx0ZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBGaWx0ZXJPcHRpb25zIH0gZnJvbSAnLi8uLi9vcHRpb25zL2ZpbHRlci1vcHRpb25zJztcbmltcG9ydCB7IFNvcnREaXJlY3Rpb24gfSBmcm9tICcuLi9vcHRpb25zL3NvcnQtZGlyZWN0aW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEZpbHRlclNvcnRTZXJ2aWNlIHtcbiAgcHVibGljIGF1dG9EZWZpbmVVbnNldFByb3BlcnRpZXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGZpbHRlclNwbGl0czogYW55W107XG4gIHByaXZhdGUgZmlsdGVyU3BsaXRzTGVuOiBudW1iZXI7XG4gIHByaXZhdGUgc3BsaXRzOiBhbnlbXTtcbiAgcHJpdmF0ZSBzcGxpdHNMZW46IG51bWJlcjtcbiAgcHVibGljIHNvcnREaXJlY3Rpb246IG51bWJlcjtcbiAgcHVibGljIGlnbm9yZUNhc2U6IGJvb2xlYW47XG4gIHByaXZhdGUgdk5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSB2YXJOYW1lczogc3RyaW5nW107XG4gIHByaXZhdGUgX2l0ZW1zOiBhbnlbXTtcblxuICBwcml2YXRlIF9jdXJyZW50RmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBGaWx0ZXJPcHRpb25zIHwgbnVsbDtcbiAgcHJpdmF0ZSBfY3VycmVudFNvcnRPcHRpb25zOiBJU29ydE9wdGlvbnMgfCBTb3J0T3B0aW9ucyB8IG51bGw7XG5cbiAgcHVibGljIGdldCBjdXJyZW50RmlsdGVyT3B0aW9ucygpOiBJRmlsdGVyT3B0aW9ucyB8IEZpbHRlck9wdGlvbnMgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudEZpbHRlck9wdGlvbnM7XG4gIH1cbiAgcHVibGljIGdldCBjdXJyZW50U29ydE9wdGlvbnMoKTogSVNvcnRPcHRpb25zIHwgU29ydE9wdGlvbnMgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFNvcnRPcHRpb25zO1xuICB9XG4gIHB1YmxpYyBnZXQgaXRlbXNCZWluZ0ZpbHRlcmVkQW5kU29ydGVkKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXM7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlID0gdGhpcztcbiAgfVxuXG4gIGZpbHRlckFuZFNvcnRJdGVtcyhcbiAgICBpdGVtczogYW55W10sXG4gICAgZmlsdGVyT3B0aW9uczpcbiAgICAgIHwgSUZpbHRlck9wdGlvbnNcbiAgICAgIHwgKElGaWx0ZXJPcHRpb25zIHwgbnVsbClbXVxuICAgICAgfCBGaWx0ZXJPcHRpb25zXG4gICAgICB8IChGaWx0ZXJPcHRpb25zIHwgbnVsbClbXVxuICAgICAgfCBudWxsLFxuICAgIHNvcnRPcHRpb25zOiBJU29ydE9wdGlvbnMgfCAoSVNvcnRPcHRpb25zIHwgbnVsbClbXSB8IFNvcnRPcHRpb25zIHwgKFNvcnRPcHRpb25zIHwgbnVsbClbXSB8IG51bGxcbiAgKTogYW55W10ge1xuICAgIGxldCBmaWx0ZXJlZEl0ZW1zOiBhbnlbXTtcblxuICAgIHRoaXMuX2l0ZW1zID0gaXRlbXM7XG4gICAgZmlsdGVyZWRJdGVtcyA9IGl0ZW1zO1xuXG4gICAgaWYgKGZpbHRlck9wdGlvbnMpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGZpbHRlck9wdGlvbnMpKSB7XG4gICAgICAgIGNvbnN0IGZpbHRlck9wdGlvbnNMZW46IG51bWJlciA9IGZpbHRlck9wdGlvbnMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlck9wdGlvbnNMZW47IGkrKykge1xuICAgICAgICAgIGNvbnN0IG9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBmaWx0ZXJPcHRpb25zW2ldO1xuICAgICAgICAgIHRoaXMuX2N1cnJlbnRGaWx0ZXJPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICBmaWx0ZXJlZEl0ZW1zID0gdGhpcy5maWx0ZXJJdGVtc0J5VmFyTmFtZXMoZmlsdGVyZWRJdGVtcywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcmVkSXRlbXMgPSB0aGlzLmZpbHRlckl0ZW1zQnlWYXJOYW1lcyhcbiAgICAgICAgICBmaWx0ZXJlZEl0ZW1zLFxuICAgICAgICAgIGZpbHRlck9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc29ydE9wdGlvbnMpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNvcnRPcHRpb25zKSkge1xuICAgICAgICBmaWx0ZXJlZEl0ZW1zID0gdGhpcy5tdWx0aVNvcnRJdGVtc0J5VmFyTmFtZShcbiAgICAgICAgICBmaWx0ZXJlZEl0ZW1zLFxuICAgICAgICAgIHNvcnRPcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJlZEl0ZW1zID0gdGhpcy5zb3J0SXRlbXNCeVZhck5hbWUoZmlsdGVyZWRJdGVtcywgc29ydE9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXJlZEl0ZW1zO1xuICB9XG5cbiAgaXNTdHJpbmcodmFsOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nO1xuICB9XG5cbiAgZmlsdGVySXRlbXNCeVZhck5hbWVzKGl0ZW1zOiBhbnlbXSwgZmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBGaWx0ZXJPcHRpb25zIHwgbnVsbCk6IGFueVtdIHtcbiAgICB0aGlzLl9jdXJyZW50RmlsdGVyT3B0aW9ucyA9IGZpbHRlck9wdGlvbnM7XG4gICAgaWYgKCFmaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0EgRmlsdGVyT3B0aW9ucyBvYmplY3QgaXMgbm90IGRlZmluZWQuIFBsZWFzZSBzdXBwbHkgZmlsdGVyIG9wdGlvbnMgdG8gc29ydCBpdGVtcyBieS4nXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCB2YXJOYW1lczogc3RyaW5nIHwgKHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpW10gfCB1bmRlZmluZWQgfCBudWxsID0gdGhpcy5pc1N0cmluZyhcbiAgICAgIGZpbHRlck9wdGlvbnMudmFyaWFibGVJZGVudGlmaWVyc1xuICAgIClcbiAgICAgID8gKFtmaWx0ZXJPcHRpb25zLnZhcmlhYmxlSWRlbnRpZmllcnNdIGFzIHN0cmluZ1tdKVxuICAgICAgOiBmaWx0ZXJPcHRpb25zLnZhcmlhYmxlSWRlbnRpZmllcnM7XG5cbiAgICB0aGlzLmlnbm9yZUNhc2UgPSBmaWx0ZXJPcHRpb25zLmlnbm9yZUNhc2U7XG5cbiAgICBpZiAoaXRlbXMgPT09IG51bGwgfHwgaXRlbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdJdGVtIGFycmF5IGlzIG5vdCBkZWZpbmVkLiBQbGVhc2Ugc3VwcGx5IGEgZGVmaW5lZCBhcnJheSB0byBmaWx0ZXIuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJTcGxpdHMgPSBbXTtcblxuICAgIGNvbnN0IG51bU9mVmFyTmFtZXM6IG51bWJlciA9IHZhck5hbWVzICYmIHZhck5hbWVzLmxlbmd0aCA+IDAgPyB2YXJOYW1lcy5sZW5ndGggOiAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhck5hbWVzOyBpKyspIHtcbiAgICAgIHRoaXMuc3BsaXRWYXJpYWJsZXNGcm9tSWRlbnRpZmllcih2YXJOYW1lcyFbaV0pO1xuICAgICAgdGhpcy5maWx0ZXJTcGxpdHMucHVzaCh0aGlzLnNwbGl0cyk7XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJTcGxpdHNMZW4gPSB0aGlzLmZpbHRlclNwbGl0cy5sZW5ndGg7XG5cbiAgICBpdGVtcyA9IGl0ZW1zLmNvbmNhdCgpO1xuXG4gICAgaXRlbXMgPSBpdGVtcy5maWx0ZXIoZmlsdGVyT3B0aW9ucy5jb21wYXJhdG9yKTtcblxuICAgIHJldHVybiBpdGVtcztcbiAgfVxuXG4gIHNwbGl0VmFyaWFibGVzRnJvbUlkZW50aWZpZXIodmFyTmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGlmICh2YXJOYW1lID09PSBudWxsIHx8IHZhck5hbWUgPT09IHVuZGVmaW5lZCB8fCB2YXJOYW1lID09PSAnJykge1xuICAgICAgdGhpcy5zcGxpdHMgPSBbXTtcbiAgICAgIHRoaXMuc3BsaXRzTGVuID0gdGhpcy5zcGxpdHMubGVuZ3RoO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb250YWluc0JyYWNrZXRzOiBib29sZWFuID0gdmFyTmFtZS5pbmNsdWRlcygnWycpO1xuICAgIHRoaXMuc3BsaXRzID0gdmFyTmFtZS5zcGxpdCgnLicpO1xuICAgIHRoaXMuc3BsaXRzTGVuID0gdGhpcy5zcGxpdHMubGVuZ3RoO1xuXG4gICAgaWYgKGNvbnRhaW5zQnJhY2tldHMpIHtcbiAgICAgIGNvbnN0IGJyYWNrZXRTcGxpdHM6IHN0cmluZ1tdID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3BsaXRzTGVuOyBpKyspIHtcbiAgICAgICAgbGV0IHNwbGl0OiBzdHJpbmcgPSB0aGlzLnNwbGl0c1tpXTtcbiAgICAgICAgbGV0IHN0YXJ0QnJhY2tldEluZGV4OiBudW1iZXIgPSBzcGxpdC5pbmRleE9mKCdbJyk7XG5cbiAgICAgICAgaWYgKHN0YXJ0QnJhY2tldEluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHdoaWxlIChzcGxpdCAhPT0gJycpIHtcbiAgICAgICAgICAgIGNvbnN0IGVuZEJyYWNrZXRJbmRleDogbnVtYmVyID0gc3BsaXQuaW5kZXhPZignXScpICsgMTtcbiAgICAgICAgICAgIGNvbnN0IHByZUJyYWNrZXRWYXI6IHN0cmluZyA9IHNwbGl0LnN1YnN0cmluZygwLCBzdGFydEJyYWNrZXRJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBicmFja2V0czogc3RyaW5nID0gc3BsaXQuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICBzdGFydEJyYWNrZXRJbmRleCArIDEsXG4gICAgICAgICAgICAgIGVuZEJyYWNrZXRJbmRleCAtIDFcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBwb3N0QnJhY2tldFZhcjogc3RyaW5nID0gc3BsaXQuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICBlbmRCcmFja2V0SW5kZXgsXG4gICAgICAgICAgICAgIHNwbGl0Lmxlbmd0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHNwbGl0ID0gcG9zdEJyYWNrZXRWYXI7XG4gICAgICAgICAgICBzdGFydEJyYWNrZXRJbmRleCA9IHNwbGl0LmluZGV4T2YoJ1snKTtcblxuICAgICAgICAgICAgaWYgKHByZUJyYWNrZXRWYXIgIT09ICcnKSB7XG4gICAgICAgICAgICAgIGJyYWNrZXRTcGxpdHMucHVzaChwcmVCcmFja2V0VmFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyYWNrZXRTcGxpdHMucHVzaChicmFja2V0cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyYWNrZXRTcGxpdHMucHVzaChzcGxpdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc3BsaXRzID0gYnJhY2tldFNwbGl0cztcbiAgICB9XG5cbiAgICB0aGlzLnNwbGl0c0xlbiA9IHRoaXMuc3BsaXRzLmxlbmd0aDtcbiAgICBsZXQgdmFyU3RyOiBzdHJpbmcgPSAnKGFycmF5IGl0ZW0pJztcbiAgICB0aGlzLnZhck5hbWVzID0gW3ZhclN0cl07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3BsaXRzTGVuOyBpKyspIHtcbiAgICAgIHRoaXMudk5hbWUgPSB0aGlzLnNwbGl0c1tpXTtcbiAgICAgIGlmIChpc05hTihOdW1iZXIodGhpcy52TmFtZSkpKSB7XG4gICAgICAgIHZhclN0ciArPSAnLicgKyB0aGlzLnZOYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyU3RyICs9ICdbJyArIHRoaXMudk5hbWUgKyAnXSc7XG4gICAgICB9XG4gICAgICB0aGlzLnZhck5hbWVzLnB1c2godmFyU3RyKTtcbiAgICB9XG4gIH1cblxuICBzb3J0SXRlbXNCeVZhck5hbWUoaXRlbXM6IGFueVtdLCBzb3J0T3B0aW9uczogSVNvcnRPcHRpb25zIHwgbnVsbCk6IGFueVtdIHtcbiAgICB0aGlzLl9jdXJyZW50U29ydE9wdGlvbnMgPSBzb3J0T3B0aW9ucztcblxuICAgIGlmICghc29ydE9wdGlvbnMpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQSBTb3J0T3B0aW9ucyBvYmplY3QgaXMgbm90IGRlZmluZWQuIFBsZWFzZSBzdXBwbHkgZmlsdGVyIG9wdGlvbnMgdG8gc29ydCBpdGVtcyBieS4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHZhck5hbWU6IHN0cmluZyA9IHNvcnRPcHRpb25zLnZhcmlhYmxlSWRlbnRpZmllciBhcyBzdHJpbmc7XG4gICAgdGhpcy5zb3J0RGlyZWN0aW9uID0gc29ydE9wdGlvbnMuc29ydERpcmVjdGlvbjtcbiAgICB0aGlzLmlnbm9yZUNhc2UgPSBzb3J0T3B0aW9ucy5pZ25vcmVDYXNlO1xuXG4gICAgaWYgKGl0ZW1zID09PSBudWxsIHx8IGl0ZW1zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnSXRlbSBhcnJheSBpcyBub3QgZGVmaW5lZC4gUGxlYXNlIHN1cHBseSBhIGRlZmluZWQgYXJyYXkgdG8gc29ydC4nXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgdGhpcy5zcGxpdFZhcmlhYmxlc0Zyb21JZGVudGlmaWVyKHZhck5hbWUpO1xuXG4gICAgaXRlbXMgPSBpdGVtcy5jb25jYXQoKTtcblxuICAgIGlmICh0aGlzLnNvcnREaXJlY3Rpb24gIT09IFNvcnREaXJlY3Rpb24uTk9ORSkge1xuICAgICAgaXRlbXMuc29ydChzb3J0T3B0aW9ucy5jb21wYXJhdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbXM7XG4gIH1cblxuICBtdWx0aVNvcnRJdGVtc0J5VmFyTmFtZShcbiAgICBpdGVtczogYW55W10sXG4gICAgc29ydE9wdGlvbnNHcm91cDogKElTb3J0T3B0aW9ucyB8IG51bGwpW10gfCAoU29ydE9wdGlvbnMgfCBudWxsKVtdXG4gICk6IGFueVtdIHtcbiAgICBzb3J0T3B0aW9uc0dyb3VwLnNvcnQoXG4gICAgICAoc29ydE9wdGlvbnNBOiBJU29ydE9wdGlvbnMgfCBudWxsLCBzb3J0T3B0aW9uc0I6IElTb3J0T3B0aW9ucyB8IG51bGwpID0+IHtcbiAgICAgICAgaWYgKCFzb3J0T3B0aW9uc0EgfHwgIXNvcnRPcHRpb25zQikge1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yZGVyQSA9IHNvcnRPcHRpb25zQS5zb3J0T3JkZXI7XG4gICAgICAgIGNvbnN0IG9yZGVyQiA9IHNvcnRPcHRpb25zQi5zb3J0T3JkZXI7XG4gICAgICAgIGlmIChvcmRlckEgPT09IG9yZGVyQikge1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmRlckEgPiBvcmRlckIgPyAxIDogLTE7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHNvcnRPcHRpb25zR3JvdXAuZm9yRWFjaCgoc29ydE9wdGlvbnMpID0+IHtcbiAgICAgIGl0ZW1zID0gdGhpcy5zb3J0SXRlbXNCeVZhck5hbWUoaXRlbXMsIHNvcnRPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlbXM7XG4gIH1cblxuICBnZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnModmFsdWU6IGFueSk6IGFueVtdIHtcbiAgICB0aGlzLmZpbHRlclNwbGl0c0xlbiA9IHRoaXMuZmlsdGVyU3BsaXRzLmxlbmd0aDtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9IHRoaXMuZmlsdGVyU3BsaXRzTGVuID09PSAwID8gW3ZhbHVlXSA6IFtdO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmZpbHRlclNwbGl0c0xlbjsgaisrKSB7XG4gICAgICBsZXQgdmFyQSA9IHZhbHVlO1xuICAgICAgY29uc3Qgc3BsaXRzOiBhbnlbXSA9IHRoaXMuZmlsdGVyU3BsaXRzW2pdO1xuICAgICAgY29uc3Qgc3BsaXRzTGVuOiBudW1iZXIgPSBzcGxpdHMubGVuZ3RoO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0c0xlbjsgaSsrKSB7XG4gICAgICAgIHRoaXMudk5hbWUgPSBzcGxpdHNbaV07XG5cbiAgICAgICAgaWYgKCF2YXJBLmhhc093blByb3BlcnR5KHRoaXMudk5hbWUpKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmF1dG9EZWZpbmVVbnNldFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICAgICBgUHJvcGVydHkgJHt0aGlzLnZOYW1lfSBub3QgZm91bmQgb24gJHt0aGlzLnZhck5hbWVzW2ldfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZGVmaW5lUHJvcGVydHkodmFyQSwgdGhpcy52TmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyQSA9IHZhckFbdGhpcy52TmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhbHMucHVzaCh2YXJBKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFscztcbiAgfVxuXG4gIHByaXZhdGUgZGVmaW5lUHJvcGVydHkob2JqOiBhbnksIHByb3BOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkgPSB1bmRlZmluZWQsIHdyaXRhYmxlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB3cml0YWJsZTogd3JpdGFibGVcbiAgICB9KTtcbiAgfVxuXG4gIGdldFNvcnRWYWx1ZXNGcm9tUHJvcGVydHlJZGVudGlmaWVycyh2YWx1ZUE6IGFueSwgdmFsdWVCOiBhbnkpOiBhbnlbXSB7XG4gICAgbGV0IHZhckEgPSB2YWx1ZUE7XG4gICAgbGV0IHZhckIgPSB2YWx1ZUI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3BsaXRzTGVuOyBpKyspIHtcbiAgICAgIHRoaXMudk5hbWUgPSB0aGlzLnNwbGl0c1tpXTtcbiAgICAgIGlmIChcbiAgICAgICAgIXZhckEuaGFzT3duUHJvcGVydHkodGhpcy52TmFtZSkgfHxcbiAgICAgICAgIXZhckIuaGFzT3duUHJvcGVydHkodGhpcy52TmFtZSlcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBFcnJvcihgUHJvcGVydHkgJHt0aGlzLnZOYW1lfSBub3QgZm91bmQgb24gJHt0aGlzLnZhck5hbWVzW2ldfWApO1xuICAgICAgfVxuICAgICAgdmFyQSA9IHZhckFbdGhpcy52TmFtZV07XG4gICAgICB2YXJCID0gdmFyQlt0aGlzLnZOYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3ZhckEsIHZhckJdO1xuICB9XG59XG4iXX0=