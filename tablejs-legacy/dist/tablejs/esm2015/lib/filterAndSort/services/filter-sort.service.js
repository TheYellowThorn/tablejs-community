import { Injectable } from '@angular/core';
import { Comparator } from './../comparators/comparator';
import { SortDirection } from '../options/sort-direction';
import * as i0 from "@angular/core";
export class FilterSortService {
    constructor() {
        this.autoDefineUnsetProperties = false;
        Comparator.filterSortService = this;
    }
    get currentFilterOptions() {
        return this._currentFilterOptions;
    }
    get currentSortOptions() {
        return this._currentSortOptions;
    }
    get itemsBeingFilteredAndSorted() {
        return this._items;
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
FilterSortService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FilterSortService_Factory() { return new FilterSortService(); }, token: FilterSortService, providedIn: "root" });
FilterSortService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
FilterSortService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLXNvcnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9maWx0ZXJBbmRTb3J0L3NlcnZpY2VzL2ZpbHRlci1zb3J0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHekQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQUsxRCxNQUFNLE9BQU8saUJBQWlCO0lBeUI1QjtRQXhCTyw4QkFBeUIsR0FBWSxLQUFLLENBQUM7UUF5QmhELFVBQVUsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDdEMsQ0FBQztJQVpELElBQVcsb0JBQW9CO1FBQzdCLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBQ3BDLENBQUM7SUFDRCxJQUFXLGtCQUFrQjtRQUMzQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsSUFBVywyQkFBMkI7UUFDcEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFNRCxrQkFBa0IsQ0FDaEIsS0FBWSxFQUNaLGFBS1EsRUFDUixXQUFpRztRQUVqRyxJQUFJLGFBQW9CLENBQUM7UUFFekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUV0QixJQUFJLGFBQWEsRUFBRTtZQUNqQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ2hDLE1BQU0sZ0JBQWdCLEdBQVcsYUFBYSxDQUFDLE1BQU0sQ0FBQztnQkFDdEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixFQUFF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SSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDOzs7O1lBcFNGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElTb3J0T3B0aW9ucyB9IGZyb20gJy4vLi4vb3B0aW9ucy9pLXNvcnQtb3B0aW9ucyc7XG5pbXBvcnQgeyBTb3J0T3B0aW9ucyB9IGZyb20gJy4vLi4vb3B0aW9ucy9zb3J0LW9wdGlvbnMnO1xuaW1wb3J0IHsgQ29tcGFyYXRvciB9IGZyb20gJy4vLi4vY29tcGFyYXRvcnMvY29tcGFyYXRvcic7XG5pbXBvcnQgeyBJRmlsdGVyT3B0aW9ucyB9IGZyb20gJy4vLi4vb3B0aW9ucy9pLWZpbHRlci1vcHRpb25zJztcbmltcG9ydCB7IEZpbHRlck9wdGlvbnMgfSBmcm9tICcuLy4uL29wdGlvbnMvZmlsdGVyLW9wdGlvbnMnO1xuaW1wb3J0IHsgU29ydERpcmVjdGlvbiB9IGZyb20gJy4uL29wdGlvbnMvc29ydC1kaXJlY3Rpb24nO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgRmlsdGVyU29ydFNlcnZpY2Uge1xuICBwdWJsaWMgYXV0b0RlZmluZVVuc2V0UHJvcGVydGllczogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgZmlsdGVyU3BsaXRzOiBhbnlbXTtcbiAgcHJpdmF0ZSBmaWx0ZXJTcGxpdHNMZW46IG51bWJlcjtcbiAgcHJpdmF0ZSBzcGxpdHM6IGFueVtdO1xuICBwcml2YXRlIHNwbGl0c0xlbjogbnVtYmVyO1xuICBwdWJsaWMgc29ydERpcmVjdGlvbjogbnVtYmVyO1xuICBwdWJsaWMgaWdub3JlQ2FzZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSB2TmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHZhck5hbWVzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBfaXRlbXM6IGFueVtdO1xuXG4gIHByaXZhdGUgX2N1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IEZpbHRlck9wdGlvbnMgfCBudWxsO1xuICBwcml2YXRlIF9jdXJyZW50U29ydE9wdGlvbnM6IElTb3J0T3B0aW9ucyB8IFNvcnRPcHRpb25zIHwgbnVsbDtcblxuICBwdWJsaWMgZ2V0IGN1cnJlbnRGaWx0ZXJPcHRpb25zKCk6IElGaWx0ZXJPcHRpb25zIHwgRmlsdGVyT3B0aW9ucyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50RmlsdGVyT3B0aW9ucztcbiAgfVxuICBwdWJsaWMgZ2V0IGN1cnJlbnRTb3J0T3B0aW9ucygpOiBJU29ydE9wdGlvbnMgfCBTb3J0T3B0aW9ucyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50U29ydE9wdGlvbnM7XG4gIH1cbiAgcHVibGljIGdldCBpdGVtc0JlaW5nRmlsdGVyZWRBbmRTb3J0ZWQoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLl9pdGVtcztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UgPSB0aGlzO1xuICB9XG5cbiAgZmlsdGVyQW5kU29ydEl0ZW1zKFxuICAgIGl0ZW1zOiBhbnlbXSxcbiAgICBmaWx0ZXJPcHRpb25zOlxuICAgICAgfCBJRmlsdGVyT3B0aW9uc1xuICAgICAgfCAoSUZpbHRlck9wdGlvbnMgfCBudWxsKVtdXG4gICAgICB8IEZpbHRlck9wdGlvbnNcbiAgICAgIHwgKEZpbHRlck9wdGlvbnMgfCBudWxsKVtdXG4gICAgICB8IG51bGwsXG4gICAgc29ydE9wdGlvbnM6IElTb3J0T3B0aW9ucyB8IChJU29ydE9wdGlvbnMgfCBudWxsKVtdIHwgU29ydE9wdGlvbnMgfCAoU29ydE9wdGlvbnMgfCBudWxsKVtdIHwgbnVsbFxuICApOiBhbnlbXSB7XG4gICAgbGV0IGZpbHRlcmVkSXRlbXM6IGFueVtdO1xuXG4gICAgdGhpcy5faXRlbXMgPSBpdGVtcztcbiAgICBmaWx0ZXJlZEl0ZW1zID0gaXRlbXM7XG5cbiAgICBpZiAoZmlsdGVyT3B0aW9ucykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmlsdGVyT3B0aW9ucykpIHtcbiAgICAgICAgY29uc3QgZmlsdGVyT3B0aW9uc0xlbjogbnVtYmVyID0gZmlsdGVyT3B0aW9ucy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyT3B0aW9uc0xlbjsgaSsrKSB7XG4gICAgICAgICAgY29uc3Qgb3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IGZpbHRlck9wdGlvbnNbaV07XG4gICAgICAgICAgdGhpcy5fY3VycmVudEZpbHRlck9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICAgIGZpbHRlcmVkSXRlbXMgPSB0aGlzLmZpbHRlckl0ZW1zQnlWYXJOYW1lcyhmaWx0ZXJlZEl0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsdGVyZWRJdGVtcyA9IHRoaXMuZmlsdGVySXRlbXNCeVZhck5hbWVzKFxuICAgICAgICAgIGZpbHRlcmVkSXRlbXMsXG4gICAgICAgICAgZmlsdGVyT3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzb3J0T3B0aW9ucykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc29ydE9wdGlvbnMpKSB7XG4gICAgICAgIGZpbHRlcmVkSXRlbXMgPSB0aGlzLm11bHRpU29ydEl0ZW1zQnlWYXJOYW1lKFxuICAgICAgICAgIGZpbHRlcmVkSXRlbXMsXG4gICAgICAgICAgc29ydE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcmVkSXRlbXMgPSB0aGlzLnNvcnRJdGVtc0J5VmFyTmFtZShmaWx0ZXJlZEl0ZW1zLCBzb3J0T3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcmVkSXRlbXM7XG4gIH1cblxuICBpc1N0cmluZyh2YWw6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCB2YWwgaW5zdGFuY2VvZiBTdHJpbmc7XG4gIH1cblxuICBmaWx0ZXJJdGVtc0J5VmFyTmFtZXMoaXRlbXM6IGFueVtdLCBmaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IEZpbHRlck9wdGlvbnMgfCBudWxsKTogYW55W10ge1xuICAgIHRoaXMuX2N1cnJlbnRGaWx0ZXJPcHRpb25zID0gZmlsdGVyT3B0aW9ucztcbiAgICBpZiAoIWZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQSBGaWx0ZXJPcHRpb25zIG9iamVjdCBpcyBub3QgZGVmaW5lZC4gUGxlYXNlIHN1cHBseSBmaWx0ZXIgb3B0aW9ucyB0byBzb3J0IGl0ZW1zIGJ5LidcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHZhck5hbWVzOiBzdHJpbmcgfCAoc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZClbXSB8IHVuZGVmaW5lZCB8IG51bGwgPSB0aGlzLmlzU3RyaW5nKFxuICAgICAgZmlsdGVyT3B0aW9ucy52YXJpYWJsZUlkZW50aWZpZXJzXG4gICAgKVxuICAgICAgPyAoW2ZpbHRlck9wdGlvbnMudmFyaWFibGVJZGVudGlmaWVyc10gYXMgc3RyaW5nW10pXG4gICAgICA6IGZpbHRlck9wdGlvbnMudmFyaWFibGVJZGVudGlmaWVycztcblxuICAgIHRoaXMuaWdub3JlQ2FzZSA9IGZpbHRlck9wdGlvbnMuaWdub3JlQ2FzZTtcblxuICAgIGlmIChpdGVtcyA9PT0gbnVsbCB8fCBpdGVtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0l0ZW0gYXJyYXkgaXMgbm90IGRlZmluZWQuIFBsZWFzZSBzdXBwbHkgYSBkZWZpbmVkIGFycmF5IHRvIGZpbHRlci4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBpdGVtcztcbiAgICB9XG5cbiAgICB0aGlzLmZpbHRlclNwbGl0cyA9IFtdO1xuXG4gICAgY29uc3QgbnVtT2ZWYXJOYW1lczogbnVtYmVyID0gdmFyTmFtZXMgJiYgdmFyTmFtZXMubGVuZ3RoID4gMCA/IHZhck5hbWVzLmxlbmd0aCA6IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFyTmFtZXM7IGkrKykge1xuICAgICAgdGhpcy5zcGxpdFZhcmlhYmxlc0Zyb21JZGVudGlmaWVyKHZhck5hbWVzIVtpXSk7XG4gICAgICB0aGlzLmZpbHRlclNwbGl0cy5wdXNoKHRoaXMuc3BsaXRzKTtcbiAgICB9XG5cbiAgICB0aGlzLmZpbHRlclNwbGl0c0xlbiA9IHRoaXMuZmlsdGVyU3BsaXRzLmxlbmd0aDtcblxuICAgIGl0ZW1zID0gaXRlbXMuY29uY2F0KCk7XG5cbiAgICBpdGVtcyA9IGl0ZW1zLmZpbHRlcihmaWx0ZXJPcHRpb25zLmNvbXBhcmF0b3IpO1xuXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9XG5cbiAgc3BsaXRWYXJpYWJsZXNGcm9tSWRlbnRpZmllcih2YXJOYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgaWYgKHZhck5hbWUgPT09IG51bGwgfHwgdmFyTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHZhck5hbWUgPT09ICcnKSB7XG4gICAgICB0aGlzLnNwbGl0cyA9IFtdO1xuICAgICAgdGhpcy5zcGxpdHNMZW4gPSB0aGlzLnNwbGl0cy5sZW5ndGg7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbnRhaW5zQnJhY2tldHM6IGJvb2xlYW4gPSB2YXJOYW1lLmluY2x1ZGVzKCdbJyk7XG4gICAgdGhpcy5zcGxpdHMgPSB2YXJOYW1lLnNwbGl0KCcuJyk7XG4gICAgdGhpcy5zcGxpdHNMZW4gPSB0aGlzLnNwbGl0cy5sZW5ndGg7XG5cbiAgICBpZiAoY29udGFpbnNCcmFja2V0cykge1xuICAgICAgY29uc3QgYnJhY2tldFNwbGl0czogc3RyaW5nW10gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zcGxpdHNMZW47IGkrKykge1xuICAgICAgICBsZXQgc3BsaXQ6IHN0cmluZyA9IHRoaXMuc3BsaXRzW2ldO1xuICAgICAgICBsZXQgc3RhcnRCcmFja2V0SW5kZXg6IG51bWJlciA9IHNwbGl0LmluZGV4T2YoJ1snKTtcblxuICAgICAgICBpZiAoc3RhcnRCcmFja2V0SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgd2hpbGUgKHNwbGl0ICE9PSAnJykge1xuICAgICAgICAgICAgY29uc3QgZW5kQnJhY2tldEluZGV4OiBudW1iZXIgPSBzcGxpdC5pbmRleE9mKCddJykgKyAxO1xuICAgICAgICAgICAgY29uc3QgcHJlQnJhY2tldFZhcjogc3RyaW5nID0gc3BsaXQuc3Vic3RyaW5nKDAsIHN0YXJ0QnJhY2tldEluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IGJyYWNrZXRzOiBzdHJpbmcgPSBzcGxpdC5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgIHN0YXJ0QnJhY2tldEluZGV4ICsgMSxcbiAgICAgICAgICAgICAgZW5kQnJhY2tldEluZGV4IC0gMVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHBvc3RCcmFja2V0VmFyOiBzdHJpbmcgPSBzcGxpdC5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgIGVuZEJyYWNrZXRJbmRleCxcbiAgICAgICAgICAgICAgc3BsaXQubGVuZ3RoXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc3BsaXQgPSBwb3N0QnJhY2tldFZhcjtcbiAgICAgICAgICAgIHN0YXJ0QnJhY2tldEluZGV4ID0gc3BsaXQuaW5kZXhPZignWycpO1xuXG4gICAgICAgICAgICBpZiAocHJlQnJhY2tldFZhciAhPT0gJycpIHtcbiAgICAgICAgICAgICAgYnJhY2tldFNwbGl0cy5wdXNoKHByZUJyYWNrZXRWYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJhY2tldFNwbGl0cy5wdXNoKGJyYWNrZXRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJhY2tldFNwbGl0cy5wdXNoKHNwbGl0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5zcGxpdHMgPSBicmFja2V0U3BsaXRzO1xuICAgIH1cblxuICAgIHRoaXMuc3BsaXRzTGVuID0gdGhpcy5zcGxpdHMubGVuZ3RoO1xuICAgIGxldCB2YXJTdHI6IHN0cmluZyA9ICcoYXJyYXkgaXRlbSknO1xuICAgIHRoaXMudmFyTmFtZXMgPSBbdmFyU3RyXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zcGxpdHNMZW47IGkrKykge1xuICAgICAgdGhpcy52TmFtZSA9IHRoaXMuc3BsaXRzW2ldO1xuICAgICAgaWYgKGlzTmFOKE51bWJlcih0aGlzLnZOYW1lKSkpIHtcbiAgICAgICAgdmFyU3RyICs9ICcuJyArIHRoaXMudk5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXJTdHIgKz0gJ1snICsgdGhpcy52TmFtZSArICddJztcbiAgICAgIH1cbiAgICAgIHRoaXMudmFyTmFtZXMucHVzaCh2YXJTdHIpO1xuICAgIH1cbiAgfVxuXG4gIHNvcnRJdGVtc0J5VmFyTmFtZShpdGVtczogYW55W10sIHNvcnRPcHRpb25zOiBJU29ydE9wdGlvbnMgfCBudWxsKTogYW55W10ge1xuICAgIHRoaXMuX2N1cnJlbnRTb3J0T3B0aW9ucyA9IHNvcnRPcHRpb25zO1xuXG4gICAgaWYgKCFzb3J0T3B0aW9ucykge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdBIFNvcnRPcHRpb25zIG9iamVjdCBpcyBub3QgZGVmaW5lZC4gUGxlYXNlIHN1cHBseSBmaWx0ZXIgb3B0aW9ucyB0byBzb3J0IGl0ZW1zIGJ5LidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFyTmFtZTogc3RyaW5nID0gc29ydE9wdGlvbnMudmFyaWFibGVJZGVudGlmaWVyIGFzIHN0cmluZztcbiAgICB0aGlzLnNvcnREaXJlY3Rpb24gPSBzb3J0T3B0aW9ucy5zb3J0RGlyZWN0aW9uO1xuICAgIHRoaXMuaWdub3JlQ2FzZSA9IHNvcnRPcHRpb25zLmlnbm9yZUNhc2U7XG5cbiAgICBpZiAoaXRlbXMgPT09IG51bGwgfHwgaXRlbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdJdGVtIGFycmF5IGlzIG5vdCBkZWZpbmVkLiBQbGVhc2Ugc3VwcGx5IGEgZGVmaW5lZCBhcnJheSB0byBzb3J0LidcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBpdGVtcztcbiAgICB9XG5cbiAgICB0aGlzLnNwbGl0VmFyaWFibGVzRnJvbUlkZW50aWZpZXIodmFyTmFtZSk7XG5cbiAgICBpdGVtcyA9IGl0ZW1zLmNvbmNhdCgpO1xuXG4gICAgaWYgKHRoaXMuc29ydERpcmVjdGlvbiAhPT0gU29ydERpcmVjdGlvbi5OT05FKSB7XG4gICAgICBpdGVtcy5zb3J0KHNvcnRPcHRpb25zLmNvbXBhcmF0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVtcztcbiAgfVxuXG4gIG11bHRpU29ydEl0ZW1zQnlWYXJOYW1lKFxuICAgIGl0ZW1zOiBhbnlbXSxcbiAgICBzb3J0T3B0aW9uc0dyb3VwOiAoSVNvcnRPcHRpb25zIHwgbnVsbClbXSB8IChTb3J0T3B0aW9ucyB8IG51bGwpW11cbiAgKTogYW55W10ge1xuICAgIHNvcnRPcHRpb25zR3JvdXAuc29ydChcbiAgICAgIChzb3J0T3B0aW9uc0E6IElTb3J0T3B0aW9ucyB8IG51bGwsIHNvcnRPcHRpb25zQjogSVNvcnRPcHRpb25zIHwgbnVsbCkgPT4ge1xuICAgICAgICBpZiAoIXNvcnRPcHRpb25zQSB8fCAhc29ydE9wdGlvbnNCKSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3JkZXJBID0gc29ydE9wdGlvbnNBLnNvcnRPcmRlcjtcbiAgICAgICAgY29uc3Qgb3JkZXJCID0gc29ydE9wdGlvbnNCLnNvcnRPcmRlcjtcbiAgICAgICAgaWYgKG9yZGVyQSA9PT0gb3JkZXJCKSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yZGVyQSA+IG9yZGVyQiA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgc29ydE9wdGlvbnNHcm91cC5mb3JFYWNoKChzb3J0T3B0aW9ucykgPT4ge1xuICAgICAgaXRlbXMgPSB0aGlzLnNvcnRJdGVtc0J5VmFyTmFtZShpdGVtcywgc29ydE9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBpdGVtcztcbiAgfVxuXG4gIGdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyh2YWx1ZTogYW55KTogYW55W10ge1xuICAgIHRoaXMuZmlsdGVyU3BsaXRzTGVuID0gdGhpcy5maWx0ZXJTcGxpdHMubGVuZ3RoO1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID0gdGhpcy5maWx0ZXJTcGxpdHNMZW4gPT09IDAgPyBbdmFsdWVdIDogW107XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuZmlsdGVyU3BsaXRzTGVuOyBqKyspIHtcbiAgICAgIGxldCB2YXJBID0gdmFsdWU7XG4gICAgICBjb25zdCBzcGxpdHM6IGFueVtdID0gdGhpcy5maWx0ZXJTcGxpdHNbal07XG4gICAgICBjb25zdCBzcGxpdHNMZW46IG51bWJlciA9IHNwbGl0cy5sZW5ndGg7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXRzTGVuOyBpKyspIHtcbiAgICAgICAgdGhpcy52TmFtZSA9IHNwbGl0c1tpXTtcblxuICAgICAgICBpZiAoIXZhckEuaGFzT3duUHJvcGVydHkodGhpcy52TmFtZSkpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuYXV0b0RlZmluZVVuc2V0UHJvcGVydGllcykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgIGBQcm9wZXJ0eSAke3RoaXMudk5hbWV9IG5vdCBmb3VuZCBvbiAke3RoaXMudmFyTmFtZXNbaV19YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5kZWZpbmVQcm9wZXJ0eSh2YXJBLCB0aGlzLnZOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXJBID0gdmFyQVt0aGlzLnZOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFscy5wdXNoKHZhckEpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxzO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWZpbmVQcm9wZXJ0eShvYmo6IGFueSwgcHJvcE5hbWU6IHN0cmluZywgdmFsdWU6IGFueSA9IHVuZGVmaW5lZCwgd3JpdGFibGU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcE5hbWUsIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHdyaXRhYmxlOiB3cml0YWJsZVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0U29ydFZhbHVlc0Zyb21Qcm9wZXJ0eUlkZW50aWZpZXJzKHZhbHVlQTogYW55LCB2YWx1ZUI6IGFueSk6IGFueVtdIHtcbiAgICBsZXQgdmFyQSA9IHZhbHVlQTtcbiAgICBsZXQgdmFyQiA9IHZhbHVlQjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zcGxpdHNMZW47IGkrKykge1xuICAgICAgdGhpcy52TmFtZSA9IHRoaXMuc3BsaXRzW2ldO1xuICAgICAgaWYgKFxuICAgICAgICAhdmFyQS5oYXNPd25Qcm9wZXJ0eSh0aGlzLnZOYW1lKSB8fFxuICAgICAgICAhdmFyQi5oYXNPd25Qcm9wZXJ0eSh0aGlzLnZOYW1lKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IEVycm9yKGBQcm9wZXJ0eSAke3RoaXMudk5hbWV9IG5vdCBmb3VuZCBvbiAke3RoaXMudmFyTmFtZXNbaV19YCk7XG4gICAgICB9XG4gICAgICB2YXJBID0gdmFyQVt0aGlzLnZOYW1lXTtcbiAgICAgIHZhckIgPSB2YXJCW3RoaXMudk5hbWVdO1xuICAgIH1cblxuICAgIHJldHVybiBbdmFyQSwgdmFyQl07XG4gIH1cbn1cbiJdfQ==