import { Comparator } from './comparator';
import { MatchType } from './match-type';
export class FilterComparator extends Comparator {
    static getRequiredMatches(numOfValues) {
        if (!Comparator.filterSortService.currentFilterOptions) {
            return 1;
        }
        else {
            return Comparator.filterSortService.currentFilterOptions.matchType ===
                MatchType.ANY
                ? 1
                : numOfValues;
        }
    }
    static escapeRegExp(str) {
        const regExp = /[.*+?^${}()|[\]\\]/g;
        return str.replace(regExp, '\\$&'); // $& means the whole matched string
    }
    static getModifiedValue(value, variableMappers, index) {
        if (Array.isArray(variableMappers)) {
            if (index > variableMappers.length - 1) {
                throw Error(`${value} does not have a variable mapper assigned to it.`);
            }
        }
        let modifier;
        modifier = Array.isArray(variableMappers)
            ? variableMappers[index]
            : variableMappers;
        if (modifier !== null && modifier !== undefined) {
            return modifier.apply(null, [value]);
        }
        return value;
    }
    static CONTAINS_STRING(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let containsString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toString().toLowerCase() : val.toString();
            if (val.includes(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    containsString = true;
                }
            }
        }
        return containsString;
    }
    static DOES_NOT_CONTAIN_STRING(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotContainString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toString().toLowerCase() : val.toString();
            if (!val.includes(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotContainString = true;
                }
            }
        }
        return doesNotContainString;
    }
    static CONTAINS_WORD(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let startsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const regex = new RegExp(startsWithOrSpace +
            '(' +
            escapedValue +
            '$|' +
            escapedValue +
            '(\\s|' +
            punctuation +
            '))', regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    startsWithString = true;
                }
            }
        }
        return startsWithString;
    }
    static DOES_NOT_CONTAIN_WORD(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotContainWord = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const regex = new RegExp(startsWithOrSpace +
            '(' +
            escapedValue +
            '$|' +
            escapedValue +
            '(\\s|' +
            punctuation +
            '))', regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (!found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotContainWord = true;
                }
            }
        }
        return doesNotContainWord;
    }
    static STARTS_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let startsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toLowerCase() : val;
            if (val.toString().substring(0, filterValue.length) === filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    startsWithString = true;
                }
            }
        }
        return startsWithString;
    }
    static DOES_NOT_START_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotStartWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toLowerCase() : val;
            if (val.toString().substring(0, filterValue.length) !== filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotStartWithString = true;
                }
            }
        }
        return doesNotStartWithString;
    }
    static ENDS_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let endsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toLowerCase() : val;
            if (val
                .toString()
                .substr(val.length - filterValue.length, filterValue.length) ===
                filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    endsWithString = true;
                }
            }
        }
        return endsWithString;
    }
    static DOES_NOT_END_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotEndWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toLowerCase() : val;
            if (val
                .toString()
                .substr(val.length - filterValue.length, filterValue.length) !==
                filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotEndWithString = true;
                }
            }
        }
        return doesNotEndWithString;
    }
    static WORD_STARTS_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let startsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
        const regex = new RegExp(startsWithOrSpace + escapedValue, regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    startsWithString = true;
                }
            }
        }
        return startsWithString;
    }
    static WORD_DOES_NOT_START_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotStartsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
        const regex = new RegExp(startsWithOrSpace + escapedValue, regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (!found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotStartsWithString = true;
                }
            }
        }
        return doesNotStartsWithString;
    }
    static WORD_ENDS_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let endsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const regex = new RegExp('(' + escapedValue + '$)|(' + escapedValue + '(\\s|' + punctuation + '))', regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    endsWithString = true;
                }
            }
        }
        return endsWithString;
    }
    static WORD_DOES_NOT_END_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotEndWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const regex = new RegExp('(' + escapedValue + '$)|(' + escapedValue + '(\\s|' + punctuation + '))', regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (!found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotEndWithString = true;
                }
            }
        }
        return doesNotEndWithString;
    }
    static EQUALS(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let equals = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue =
            Comparator.isString(filterValue) && ignoreCase
                ? filterValue.toLowerCase()
                : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val =
                Comparator.isString(val) && ignoreCase
                    ? val.toString().toLowerCase()
                    : val;
            if (val == filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    equals = true;
                }
            }
        }
        return equals;
    }
    static NOT_EQUAL(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let notEquals = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue =
            Comparator.isString(filterValue) && ignoreCase
                ? filterValue.toLowerCase()
                : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val =
                Comparator.isString(val) && ignoreCase
                    ? val.toString().toLowerCase()
                    : val;
            if (val != filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    notEquals = true;
                }
            }
        }
        return notEquals;
    }
    static STRICT_EQUALS(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let equals = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue =
            Comparator.isString(filterValue) && ignoreCase
                ? filterValue.toLowerCase()
                : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val =
                Comparator.isString(val) && ignoreCase
                    ? val.toString().toLowerCase()
                    : val;
            if (val === filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    equals = true;
                }
            }
        }
        return equals;
    }
    static NOT_STRICT_EQUALS(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let notStrictEquals = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue =
            Comparator.isString(filterValue) && ignoreCase
                ? filterValue.toLowerCase()
                : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val =
                Comparator.isString(val) && ignoreCase
                    ? val.toString().toLowerCase()
                    : val;
            if (val !== filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    notStrictEquals = true;
                }
            }
        }
        return notStrictEquals;
    }
    static LESS_THAN(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let lessThan = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        const filterValue = currentFilterOptions.filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = Number(val);
            if (val < Number(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    lessThan = true;
                }
            }
        }
        return lessThan;
    }
    static GREATER_THAN(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let greaterThan = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        const filterValue = currentFilterOptions.filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = Number(val);
            if (val > Number(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    greaterThan = true;
                }
            }
        }
        return greaterThan;
    }
    static LESS_THAN_OR_EQUAL(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let lessThan = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        const filterValue = currentFilterOptions.filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = Number(val);
            if (val <= Number(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    lessThan = true;
                }
            }
        }
        return lessThan;
    }
    static GREATER_THAN_OR_EQUAL(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let greaterThan = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        const filterValue = currentFilterOptions.filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = Number(val);
            if (val >= Number(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    greaterThan = true;
                }
            }
        }
        return greaterThan;
    }
    static IS_AFTER_DATE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let afterDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() > filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    afterDate = true;
                }
            }
        }
        return afterDate;
    }
    static IS_BEFORE_DATE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let beforeDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() < filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    beforeDate = true;
                }
            }
        }
        return beforeDate;
    }
    static DATE_IS(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let beforeDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() === filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    beforeDate = true;
                }
            }
        }
        return beforeDate;
    }
    static DATE_IS_NOT(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isNotDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() !== filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isNotDate = true;
                }
            }
        }
        return isNotDate;
    }
    static IS_ON_OR_AFTER_DATE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let afterDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() >= filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    afterDate = true;
                }
            }
        }
        return afterDate;
    }
    static IS_ON_OR_BEFORE_DATE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let beforeDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() <= filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    beforeDate = true;
                }
            }
        }
        return beforeDate;
    }
    static IS_TRUE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isTrue = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (val === true) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isTrue = true;
                }
            }
        }
        return isTrue;
    }
    static IS_FALSE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isFalse = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (val === false) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isFalse = true;
                }
            }
        }
        return isFalse;
    }
    static IS_TRUTHY(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isTruthy = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (val) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isTruthy = true;
                }
            }
        }
        return isTruthy;
    }
    static IS_FALSY(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isFalsy = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (!val) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isFalsy = true;
                }
            }
        }
        return isFalsy;
    }
    static triggerNoFilterOptionsError() {
        throw Error(`Please supply a FilterOptions object to filter your array by.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLWNvbXBhcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvZmlsdGVyQW5kU29ydC9jb21wYXJhdG9ycy9maWx0ZXItY29tcGFyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHekMsTUFBTSxPQUFPLGdCQUFpQixTQUFRLFVBQVU7SUFDdEMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQW1CO1FBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWtCLENBQUMsb0JBQW9CLEVBQUU7WUFDdkQsT0FBTyxDQUFDLENBQUM7U0FDVjthQUFNO1lBQ0wsT0FBTyxVQUFVLENBQUMsaUJBQWtCLENBQUMsb0JBQW9CLENBQUMsU0FBUztnQkFDbkUsU0FBUyxDQUFDLEdBQUc7Z0JBQ2IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLFdBQVcsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVPLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBVztRQUNyQyxNQUFNLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQztRQUNyQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsb0NBQW9DO0lBQzFFLENBQUM7SUFFTSxNQUFNLENBQUMsZ0JBQWdCLENBQzVCLEtBQVUsRUFDVixlQUFzRCxFQUN0RCxLQUFhO1FBRWIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ2xDLElBQUksS0FBSyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN0QyxNQUFNLEtBQUssQ0FBQyxHQUFHLEtBQUssa0RBQWtELENBQUMsQ0FBQzthQUN6RTtTQUNG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L2NvbXBhcmF0b3InO1xuaW1wb3J0IHsgTWF0Y2hUeXBlIH0gZnJvbSAnLi9tYXRjaC10eXBlJztcbmltcG9ydCB7IElGaWx0ZXJPcHRpb25zIH0gZnJvbSAnLi8uLi9maWx0ZXItYW5kLXNvcnQubW9kdWxlJztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckNvbXBhcmF0b3IgZXh0ZW5kcyBDb21wYXJhdG9yIHtcbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmICghQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuY3VycmVudEZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuY3VycmVudEZpbHRlck9wdGlvbnMubWF0Y2hUeXBlID09PVxuICAgICAgTWF0Y2hUeXBlLkFOWVxuICAgICAgPyAxXG4gICAgICA6IG51bU9mVmFsdWVzO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGVzY2FwZVJlZ0V4cChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVnRXhwID0gL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nO1xuICAgIHJldHVybiBzdHIucmVwbGFjZShyZWdFeHAsICdcXFxcJCYnKTsgLy8gJCYgbWVhbnMgdGhlIHdob2xlIG1hdGNoZWQgc3RyaW5nXG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldE1vZGlmaWVkVmFsdWUoXG4gICAgdmFsdWU6IGFueSxcbiAgICB2YXJpYWJsZU1hcHBlcnM6IEZ1bmN0aW9uIHwgKEZ1bmN0aW9uIHwgbnVsbClbXSB8IG51bGwsXG4gICAgaW5kZXg6IG51bWJlclxuICApOiBhbnkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhcmlhYmxlTWFwcGVycykpIHtcbiAgICAgIGlmIChpbmRleCA+IHZhcmlhYmxlTWFwcGVycy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHRocm93IEVycm9yKGAke3ZhbHVlfSBkb2VzIG5vdCBoYXZlIGEgdmFyaWFibGUgbWFwcGVyIGFzc2lnbmVkIHRvIGl0LmApO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgbW9kaWZpZXI6IEZ1bmN0aW9uIHwgbnVsbDtcbiAgICBtb2RpZmllciA9IEFycmF5LmlzQXJyYXkodmFyaWFibGVNYXBwZXJzKVxuICAgICAgPyB2YXJpYWJsZU1hcHBlcnNbaW5kZXhdXG4gICAgICA6IHZhcmlhYmxlTWFwcGVycztcbiAgICBpZiAobW9kaWZpZXIgIT09IG51bGwgJiYgbW9kaWZpZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG1vZGlmaWVyLmFwcGx5KG51bGwsIFt2YWx1ZV0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBzdGF0aWMgQ09OVEFJTlNfU1RSSU5HKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgY29udGFpbnNTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgbGV0IGZpbHRlclZhbHVlOiBzdHJpbmcgPSAgY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuICAgIGNvbnN0IGlnbm9yZUNhc2U6IGJvb2xlYW4gPSAgY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZUNhc2U7XG5cbiAgICBmaWx0ZXJWYWx1ZSA9IGlnbm9yZUNhc2UgPyBmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIDogZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICB2YWwgPSBpZ25vcmVDYXNlID8gdmFsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA6IHZhbC50b1N0cmluZygpO1xuXG4gICAgICBpZiAodmFsLmluY2x1ZGVzKGZpbHRlclZhbHVlKSkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBjb250YWluc1N0cmluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29udGFpbnNTdHJpbmc7XG4gIH1cblxuICBzdGF0aWMgRE9FU19OT1RfQ09OVEFJTl9TVFJJTkcoXG4gICAgdmFsdWU6IGFueSxcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBhcnJheT86IGFueVtdXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7IFxuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTsgXG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGRvZXNOb3RDb250YWluU3RyaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCBjdXJyZW50RmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBudWxsID0gQ29tcGFyYXRvci5nZXRDdXJyZW50RmlsdGVyT3B0aW9ucygpO1xuICAgIGlmICghY3VycmVudEZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vRmlsdGVyT3B0aW9uc0Vycm9yKCk7XG4gICAgfVxuICAgIGxldCBmaWx0ZXJWYWx1ZTogc3RyaW5nID0gIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5maWx0ZXJWYWx1ZTtcbiAgICBjb25zdCBpZ25vcmVDYXNlOiBib29sZWFuID0gIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVDYXNlO1xuXG4gICAgZmlsdGVyVmFsdWUgPSBpZ25vcmVDYXNlID8gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSA6IGZpbHRlclZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgICBjdXJyZW50RmlsdGVyT3B0aW9ucyEudmFyaWFibGVNYXBwZXJzISxcbiAgICAgICAgaVxuICAgICAgKTtcblxuICAgICAgdmFsID0gaWdub3JlQ2FzZSA/IHZhbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgOiB2YWwudG9TdHJpbmcoKTtcblxuICAgICAgaWYgKCF2YWwuaW5jbHVkZXMoZmlsdGVyVmFsdWUpKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIGRvZXNOb3RDb250YWluU3RyaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkb2VzTm90Q29udGFpblN0cmluZztcbiAgfVxuXG4gIHN0YXRpYyBDT05UQUlOU19XT1JEKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IHN0YXJ0c1dpdGhTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgbGV0IGZpbHRlclZhbHVlOiBzdHJpbmcgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuZmlsdGVyVmFsdWU7XG4gICAgY29uc3QgaWdub3JlQ2FzZTogYm9vbGVhbiA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVDYXNlO1xuICAgIGNvbnN0IHJlZ0V4RmxhZ3M6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVDYXNlXG4gICAgICA/ICdtaSdcbiAgICAgIDogJ20nO1xuXG4gICAgY29uc3QgcHVuY3R1YXRpb246IHN0cmluZyA9ICcsfDp8O3xcXFxcW3xcXFxcXXxcXFxce3xcXFxcfXxcXFxcKHxcXFxcKXxcXCd8XCJ8KFxcXFwuXFxcXC5cXFxcLil8KFxcXFwuXFxcXC5cXFxcLlxcXFwuKXwo4oCmKXwoXFxcXD8pfCF8XFxcXC58LXzigJR8QHwjfFxcXFwkfCV8XFxcXF58JnxcXFxcKnxffFxcXFwrfD18L3w+fDx8YHx+fCgnXG4gICAgKyBGaWx0ZXJDb21wYXJhdG9yLmVzY2FwZVJlZ0V4cCgnXFxcXCcpICsgJyl8KCcgKyBGaWx0ZXJDb21wYXJhdG9yLmVzY2FwZVJlZ0V4cCgnfCcpICsgJyknO1xuICAgIGNvbnN0IHN0YXJ0c1dpdGhPclNwYWNlOiBzdHJpbmcgPSAnKD86XnxcXFxcc3wnICsgcHVuY3R1YXRpb24gKyAnKSc7XG4gICAgY29uc3QgZXNjYXBlZFZhbHVlOiBzdHJpbmcgPSBGaWx0ZXJDb21wYXJhdG9yLmVzY2FwZVJlZ0V4cChmaWx0ZXJWYWx1ZSk7XG5cbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICBzdGFydHNXaXRoT3JTcGFjZSArXG4gICAgICAnKCcgK1xuICAgICAgZXNjYXBlZFZhbHVlICtcbiAgICAgICckfCcgK1xuICAgICAgZXNjYXBlZFZhbHVlICtcbiAgICAgICcoXFxcXHN8JyArXG4gICAgICBwdW5jdHVhdGlvbiArXG4gICAgICAnKSknLFxuICAgICAgcmVnRXhGbGFnc1xuICAgICk7XG5cbiAgICBmaWx0ZXJWYWx1ZSA9IGlnbm9yZUNhc2UgPyBmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIDogZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXgudGVzdCh2YWwpO1xuXG4gICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICBpZiAobWF0Y2hDb3VudCA9PT0gcmVxdWlyZWRNYXRjaGVzKSB7XG4gICAgICAgICAgc3RhcnRzV2l0aFN0cmluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhcnRzV2l0aFN0cmluZztcbiAgfVxuXG4gIHN0YXRpYyBET0VTX05PVF9DT05UQUlOX1dPUkQoXG4gICAgdmFsdWU6IGFueSxcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBhcnJheT86IGFueVtdXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgZG9lc05vdENvbnRhaW5Xb3JkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCBjdXJyZW50RmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBudWxsID0gQ29tcGFyYXRvci5nZXRDdXJyZW50RmlsdGVyT3B0aW9ucygpO1xuICAgIGlmICghY3VycmVudEZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vRmlsdGVyT3B0aW9uc0Vycm9yKCk7XG4gICAgfVxuICAgIGxldCBmaWx0ZXJWYWx1ZTogc3RyaW5nID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuICAgIGNvbnN0IGlnbm9yZUNhc2U6IGJvb2xlYW4gPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlQ2FzZTtcbiAgICBjb25zdCByZWdFeEZsYWdzOiBzdHJpbmcgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlQ2FzZVxuICAgICAgPyAnbWknXG4gICAgICA6ICdtJztcblxuICAgIGNvbnN0IHB1bmN0dWF0aW9uOiBzdHJpbmcgPSAnLHw6fDt8XFxcXFt8XFxcXF18XFxcXHt8XFxcXH18XFxcXCh8XFxcXCl8XFwnfFwifChcXFxcLlxcXFwuXFxcXC4pfChcXFxcLlxcXFwuXFxcXC5cXFxcLil8KOKApil8KFxcXFw/KXwhfFxcXFwufC184oCUfEB8I3xcXFxcJHwlfFxcXFxefCZ8XFxcXCp8X3xcXFxcK3w9fC98Pnw8fGB8fnwoJ1xuICAgICsgRmlsdGVyQ29tcGFyYXRvci5lc2NhcGVSZWdFeHAoJ1xcXFwnKSArICcpfCgnICsgRmlsdGVyQ29tcGFyYXRvci5lc2NhcGVSZWdFeHAoJ3wnKSArICcpJztcbiAgICBjb25zdCBzdGFydHNXaXRoT3JTcGFjZTogc3RyaW5nID0gJyg/Ol58XFxcXHN8JyArIHB1bmN0dWF0aW9uICsgJyknO1xuICAgIGNvbnN0IGVzY2FwZWRWYWx1ZTogc3RyaW5nID0gRmlsdGVyQ29tcGFyYXRvci5lc2NhcGVSZWdFeHAoZmlsdGVyVmFsdWUpO1xuXG4gICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgc3RhcnRzV2l0aE9yU3BhY2UgK1xuICAgICAgJygnICtcbiAgICAgIGVzY2FwZWRWYWx1ZSArXG4gICAgICAnJHwnICtcbiAgICAgIGVzY2FwZWRWYWx1ZSArXG4gICAgICAnKFxcXFxzfCcgK1xuICAgICAgcHVuY3R1YXRpb24gK1xuICAgICAgJykpJyxcbiAgICAgIHJlZ0V4RmxhZ3NcbiAgICApO1xuXG4gICAgZmlsdGVyVmFsdWUgPSBpZ25vcmVDYXNlID8gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSA6IGZpbHRlclZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBmb3VuZCA9IHJlZ2V4LnRlc3QodmFsKTtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBkb2VzTm90Q29udGFpbldvcmQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvZXNOb3RDb250YWluV29yZDtcbiAgfVxuXG4gIHN0YXRpYyBTVEFSVFNfV0lUSChcbiAgICB2YWx1ZTogYW55LFxuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGFycmF5PzogYW55W11cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IHN0YXJ0c1dpdGhTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgbGV0IGZpbHRlclZhbHVlOiBzdHJpbmcgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuZmlsdGVyVmFsdWU7XG4gICAgY29uc3QgaWdub3JlQ2FzZTogYm9vbGVhbiA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVDYXNlO1xuXG4gICAgZmlsdGVyVmFsdWUgPSBpZ25vcmVDYXNlID8gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSA6IGZpbHRlclZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICB2YWwgPSBpZ25vcmVDYXNlID8gdmFsLnRvTG93ZXJDYXNlKCkgOiB2YWw7XG5cbiAgICAgIGlmICh2YWwudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgZmlsdGVyVmFsdWUubGVuZ3RoKSA9PT0gZmlsdGVyVmFsdWUpIHtcbiAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICBpZiAobWF0Y2hDb3VudCA9PT0gcmVxdWlyZWRNYXRjaGVzKSB7XG4gICAgICAgICAgc3RhcnRzV2l0aFN0cmluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhcnRzV2l0aFN0cmluZztcbiAgfVxuXG4gIHN0YXRpYyBET0VTX05PVF9TVEFSVF9XSVRIKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgZG9lc05vdFN0YXJ0V2l0aFN0cmluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBsZXQgZmlsdGVyVmFsdWU6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5maWx0ZXJWYWx1ZTtcbiAgICBjb25zdCBpZ25vcmVDYXNlOiBib29sZWFuID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZUNhc2U7XG5cbiAgICBmaWx0ZXJWYWx1ZSA9IGlnbm9yZUNhc2UgPyBmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIDogZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIHZhbCA9IGlnbm9yZUNhc2UgPyB2YWwudG9Mb3dlckNhc2UoKSA6IHZhbDtcblxuICAgICAgaWYgKHZhbC50b1N0cmluZygpLnN1YnN0cmluZygwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpICE9PSBmaWx0ZXJWYWx1ZSkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBkb2VzTm90U3RhcnRXaXRoU3RyaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkb2VzTm90U3RhcnRXaXRoU3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIEVORFNfV0lUSCh2YWx1ZTogYW55LCBpbmRleD86IG51bWJlciwgYXJyYXk/OiBhbnlbXSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG5cbiAgICBjb25zdCBudW1PZlZhbHVlczogbnVtYmVyID0gdmFscy5sZW5ndGg7XG4gICAgY29uc3QgcmVxdWlyZWRNYXRjaGVzOiBudW1iZXIgPVxuICAgICAgRmlsdGVyQ29tcGFyYXRvci5nZXRSZXF1aXJlZE1hdGNoZXMobnVtT2ZWYWx1ZXMpO1xuICAgIGxldCBtYXRjaENvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCBlbmRzV2l0aFN0cmluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBsZXQgZmlsdGVyVmFsdWU6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5maWx0ZXJWYWx1ZTtcbiAgICBjb25zdCBpZ25vcmVDYXNlOiBib29sZWFuID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZUNhc2U7XG5cbiAgICBmaWx0ZXJWYWx1ZSA9IGlnbm9yZUNhc2UgPyBmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIDogZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIHZhbCA9IGlnbm9yZUNhc2UgPyB2YWwudG9Mb3dlckNhc2UoKSA6IHZhbDtcblxuICAgICAgaWYgKFxuICAgICAgICB2YWxcbiAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgIC5zdWJzdHIodmFsLmxlbmd0aCAtIGZpbHRlclZhbHVlLmxlbmd0aCwgZmlsdGVyVmFsdWUubGVuZ3RoKSA9PT1cbiAgICAgICAgZmlsdGVyVmFsdWVcbiAgICAgICkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBlbmRzV2l0aFN0cmluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZW5kc1dpdGhTdHJpbmc7XG4gIH1cblxuICBzdGF0aWMgRE9FU19OT1RfRU5EX1dJVEgodmFsdWU6IGFueSwgaW5kZXg/OiBudW1iZXIsIGFycmF5PzogYW55W10pOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgZG9lc05vdEVuZFdpdGhTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgbGV0IGZpbHRlclZhbHVlOiBzdHJpbmcgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuZmlsdGVyVmFsdWU7XG4gICAgY29uc3QgaWdub3JlQ2FzZTogYm9vbGVhbiA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVDYXNlO1xuXG4gICAgZmlsdGVyVmFsdWUgPSBpZ25vcmVDYXNlID8gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSA6IGZpbHRlclZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICB2YWwgPSBpZ25vcmVDYXNlID8gdmFsLnRvTG93ZXJDYXNlKCkgOiB2YWw7XG5cbiAgICAgIGlmIChcbiAgICAgICAgdmFsXG4gICAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgICAuc3Vic3RyKHZhbC5sZW5ndGggLSBmaWx0ZXJWYWx1ZS5sZW5ndGgsIGZpbHRlclZhbHVlLmxlbmd0aCkgIT09XG4gICAgICAgIGZpbHRlclZhbHVlXG4gICAgICApIHtcbiAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICBpZiAobWF0Y2hDb3VudCA9PT0gcmVxdWlyZWRNYXRjaGVzKSB7XG4gICAgICAgICAgZG9lc05vdEVuZFdpdGhTdHJpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvZXNOb3RFbmRXaXRoU3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIFdPUkRfU1RBUlRTX1dJVEgoXG4gICAgdmFsdWU6IGFueSxcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBhcnJheT86IGFueVtdXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG5cbiAgICBjb25zdCBudW1PZlZhbHVlczogbnVtYmVyID0gdmFscy5sZW5ndGg7XG4gICAgY29uc3QgcmVxdWlyZWRNYXRjaGVzOiBudW1iZXIgPVxuICAgICAgRmlsdGVyQ29tcGFyYXRvci5nZXRSZXF1aXJlZE1hdGNoZXMobnVtT2ZWYWx1ZXMpO1xuICAgIGxldCBtYXRjaENvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCBzdGFydHNXaXRoU3RyaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCBjdXJyZW50RmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBudWxsID0gQ29tcGFyYXRvci5nZXRDdXJyZW50RmlsdGVyT3B0aW9ucygpO1xuICAgIGlmICghY3VycmVudEZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vRmlsdGVyT3B0aW9uc0Vycm9yKCk7XG4gICAgfVxuICAgIGxldCBmaWx0ZXJWYWx1ZTogc3RyaW5nID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuICAgIGNvbnN0IGlnbm9yZUNhc2U6IGJvb2xlYW4gPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlQ2FzZTtcbiAgICBjb25zdCByZWdFeEZsYWdzOiBzdHJpbmcgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlQ2FzZVxuICAgICAgPyAnbWknXG4gICAgICA6ICdtJztcbiAgICBjb25zdCBlc2NhcGVkVmFsdWU6IHN0cmluZyA9IEZpbHRlckNvbXBhcmF0b3IuZXNjYXBlUmVnRXhwKGZpbHRlclZhbHVlKTtcbiAgICBjb25zdCBwdW5jdHVhdGlvbjogc3RyaW5nID0gJyx8Onw7fFxcXFxbfFxcXFxdfFxcXFx7fFxcXFx9fFxcXFwofFxcXFwpfFxcJ3xcInwoXFxcXC5cXFxcLlxcXFwuKXwoXFxcXC5cXFxcLlxcXFwuXFxcXC4pfCjigKYpfChcXFxcPyl8IXxcXFxcLnwtfOKAlHxAfCN8XFxcXCR8JXxcXFxcXnwmfFxcXFwqfF98XFxcXCt8PXwvfD58PHxgfH58KCdcbiAgICArIEZpbHRlckNvbXBhcmF0b3IuZXNjYXBlUmVnRXhwKCdcXFxcJykgKyAnKXwoJyArIEZpbHRlckNvbXBhcmF0b3IuZXNjYXBlUmVnRXhwKCd8JykgKyAnKSc7XG4gICAgY29uc3Qgc3RhcnRzV2l0aE9yU3BhY2U6IHN0cmluZyA9ICcoPzpefFxcXFxzfCcgKyBwdW5jdHVhdGlvbiArICcpJztcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoc3RhcnRzV2l0aE9yU3BhY2UgKyBlc2NhcGVkVmFsdWUsIHJlZ0V4RmxhZ3MpO1xuXG4gICAgZmlsdGVyVmFsdWUgPSBpZ25vcmVDYXNlID8gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSA6IGZpbHRlclZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBmb3VuZCA9IHJlZ2V4LnRlc3QodmFsKTtcblxuICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIHN0YXJ0c1dpdGhTdHJpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXJ0c1dpdGhTdHJpbmc7XG4gIH1cblxuICBzdGF0aWMgV09SRF9ET0VTX05PVF9TVEFSVF9XSVRIKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgZG9lc05vdFN0YXJ0c1dpdGhTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgbGV0IGZpbHRlclZhbHVlOiBzdHJpbmcgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuZmlsdGVyVmFsdWU7XG4gICAgY29uc3QgaWdub3JlQ2FzZTogYm9vbGVhbiA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVDYXNlO1xuICAgIGNvbnN0IHJlZ0V4RmxhZ3M6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVDYXNlXG4gICAgICA/ICdtaSdcbiAgICAgIDogJ20nO1xuICAgIGNvbnN0IGVzY2FwZWRWYWx1ZTogc3RyaW5nID0gRmlsdGVyQ29tcGFyYXRvci5lc2NhcGVSZWdFeHAoZmlsdGVyVmFsdWUpO1xuICAgIGNvbnN0IHB1bmN0dWF0aW9uOiBzdHJpbmcgPSAnLHw6fDt8XFxcXFt8XFxcXF18XFxcXHt8XFxcXH18XFxcXCh8XFxcXCl8XFwnfFwifChcXFxcLlxcXFwuXFxcXC4pfChcXFxcLlxcXFwuXFxcXC5cXFxcLil8KOKApil8KFxcXFw/KXwhfFxcXFwufC184oCUfEB8I3xcXFxcJHwlfFxcXFxefCZ8XFxcXCp8X3xcXFxcK3w9fC98Pnw8fGB8fnwoJ1xuICAgICsgRmlsdGVyQ29tcGFyYXRvci5lc2NhcGVSZWdFeHAoJ1xcXFwnKSArICcpfCgnICsgRmlsdGVyQ29tcGFyYXRvci5lc2NhcGVSZWdFeHAoJ3wnKSArICcpJztcbiAgICBjb25zdCBzdGFydHNXaXRoT3JTcGFjZTogc3RyaW5nID0gJyg/Ol58XFxcXHN8JyArIHB1bmN0dWF0aW9uICsgJyknO1xuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChzdGFydHNXaXRoT3JTcGFjZSArIGVzY2FwZWRWYWx1ZSwgcmVnRXhGbGFncyk7XG5cbiAgICBmaWx0ZXJWYWx1ZSA9IGlnbm9yZUNhc2UgPyBmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIDogZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXgudGVzdCh2YWwpO1xuXG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIGRvZXNOb3RTdGFydHNXaXRoU3RyaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkb2VzTm90U3RhcnRzV2l0aFN0cmluZztcbiAgfVxuXG4gIHN0YXRpYyBXT1JEX0VORFNfV0lUSChcbiAgICB2YWx1ZTogYW55LFxuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGFycmF5PzogYW55W11cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGVuZHNXaXRoU3RyaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCBjdXJyZW50RmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBudWxsID0gQ29tcGFyYXRvci5nZXRDdXJyZW50RmlsdGVyT3B0aW9ucygpO1xuICAgIGlmICghY3VycmVudEZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vRmlsdGVyT3B0aW9uc0Vycm9yKCk7XG4gICAgfVxuICAgIGxldCBmaWx0ZXJWYWx1ZTogc3RyaW5nID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuICAgIGNvbnN0IGlnbm9yZUNhc2U6IGJvb2xlYW4gPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlQ2FzZTtcbiAgICBjb25zdCByZWdFeEZsYWdzOiBzdHJpbmcgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlQ2FzZVxuICAgICAgPyAnbWknXG4gICAgICA6ICdtJztcbiAgICBjb25zdCBlc2NhcGVkVmFsdWU6IHN0cmluZyA9IEZpbHRlckNvbXBhcmF0b3IuZXNjYXBlUmVnRXhwKGZpbHRlclZhbHVlKTtcbiAgICBjb25zdCBwdW5jdHVhdGlvbjogc3RyaW5nID0gJyx8Onw7fFxcXFxbfFxcXFxdfFxcXFx7fFxcXFx9fFxcXFwofFxcXFwpfFxcJ3xcInwoXFxcXC5cXFxcLlxcXFwuKXwoXFxcXC5cXFxcLlxcXFwuXFxcXC4pfCjigKYpfChcXFxcPyl8IXxcXFxcLnwtfOKAlHxAfCN8XFxcXCR8JXxcXFxcXnwmfFxcXFwqfF98XFxcXCt8PXwvfD58PHxgfH58KCdcbiAgICArIEZpbHRlckNvbXBhcmF0b3IuZXNjYXBlUmVnRXhwKCdcXFxcJykgKyAnKXwoJyArIEZpbHRlckNvbXBhcmF0b3IuZXNjYXBlUmVnRXhwKCd8JykgKyAnKSc7XG4gICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgJygnICsgZXNjYXBlZFZhbHVlICsgJyQpfCgnICsgZXNjYXBlZFZhbHVlICsgJyhcXFxcc3wnICsgcHVuY3R1YXRpb24gKyAnKSknLFxuICAgICAgcmVnRXhGbGFnc1xuICAgICk7XG5cbiAgICBmaWx0ZXJWYWx1ZSA9IGlnbm9yZUNhc2UgPyBmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIDogZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXgudGVzdCh2YWwpO1xuXG4gICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICBpZiAobWF0Y2hDb3VudCA9PT0gcmVxdWlyZWRNYXRjaGVzKSB7XG4gICAgICAgICAgZW5kc1dpdGhTdHJpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVuZHNXaXRoU3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIFdPUkRfRE9FU19OT1RfRU5EX1dJVEgoXG4gICAgdmFsdWU6IGFueSxcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBhcnJheT86IGFueVtdXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG5cbiAgICBjb25zdCBudW1PZlZhbHVlczogbnVtYmVyID0gdmFscy5sZW5ndGg7XG4gICAgY29uc3QgcmVxdWlyZWRNYXRjaGVzOiBudW1iZXIgPVxuICAgICAgRmlsdGVyQ29tcGFyYXRvci5nZXRSZXF1aXJlZE1hdGNoZXMobnVtT2ZWYWx1ZXMpO1xuICAgIGxldCBtYXRjaENvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCBkb2VzTm90RW5kV2l0aFN0cmluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBsZXQgZmlsdGVyVmFsdWU6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5maWx0ZXJWYWx1ZTtcbiAgICBjb25zdCBpZ25vcmVDYXNlOiBib29sZWFuID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZUNhc2U7XG4gICAgY29uc3QgcmVnRXhGbGFnczogc3RyaW5nID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZUNhc2VcbiAgICAgID8gJ21pJ1xuICAgICAgOiAnbSc7XG4gICAgY29uc3QgZXNjYXBlZFZhbHVlOiBzdHJpbmcgPSBGaWx0ZXJDb21wYXJhdG9yLmVzY2FwZVJlZ0V4cChmaWx0ZXJWYWx1ZSk7XG4gICAgY29uc3QgcHVuY3R1YXRpb246IHN0cmluZyA9ICcsfDp8O3xcXFxcW3xcXFxcXXxcXFxce3xcXFxcfXxcXFxcKHxcXFxcKXxcXCd8XCJ8KFxcXFwuXFxcXC5cXFxcLil8KFxcXFwuXFxcXC5cXFxcLlxcXFwuKXwo4oCmKXwoXFxcXD8pfCF8XFxcXC58LXzigJR8QHwjfFxcXFwkfCV8XFxcXF58JnxcXFxcKnxffFxcXFwrfD18L3w+fDx8YHx+fCgnXG4gICAgKyBGaWx0ZXJDb21wYXJhdG9yLmVzY2FwZVJlZ0V4cCgnXFxcXCcpICsgJyl8KCcgKyBGaWx0ZXJDb21wYXJhdG9yLmVzY2FwZVJlZ0V4cCgnfCcpICsgJyknO1xuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICcoJyArIGVzY2FwZWRWYWx1ZSArICckKXwoJyArIGVzY2FwZWRWYWx1ZSArICcoXFxcXHN8JyArIHB1bmN0dWF0aW9uICsgJykpJyxcbiAgICAgIHJlZ0V4RmxhZ3NcbiAgICApO1xuXG4gICAgZmlsdGVyVmFsdWUgPSBpZ25vcmVDYXNlID8gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSA6IGZpbHRlclZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBmb3VuZCA9IHJlZ2V4LnRlc3QodmFsKTtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBkb2VzTm90RW5kV2l0aFN0cmluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZG9lc05vdEVuZFdpdGhTdHJpbmc7XG4gIH1cblxuICBzdGF0aWMgRVFVQUxTKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyLCBhcnJheT86IGFueVtdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGVxdWFsczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBsZXQgZmlsdGVyVmFsdWU6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5maWx0ZXJWYWx1ZTtcbiAgICBjb25zdCBpZ25vcmVDYXNlOiBib29sZWFuID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZUNhc2U7XG5cbiAgICBmaWx0ZXJWYWx1ZSA9XG4gICAgICBDb21wYXJhdG9yLmlzU3RyaW5nKGZpbHRlclZhbHVlKSAmJiBpZ25vcmVDYXNlXG4gICAgICAgID8gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICA6IGZpbHRlclZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICB2YWwgPVxuICAgICAgICBDb21wYXJhdG9yLmlzU3RyaW5nKHZhbCkgJiYgaWdub3JlQ2FzZVxuICAgICAgICAgID8gdmFsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIDogdmFsO1xuXG4gICAgICBpZiAodmFsID09IGZpbHRlclZhbHVlKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIGVxdWFscyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZXF1YWxzO1xuICB9XG5cbiAgc3RhdGljIE5PVF9FUVVBTCh2YWx1ZTogYW55LCBpbmRleD86IG51bWJlciwgYXJyYXk/OiBhbnlbXSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7IFxuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTsgXG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IG5vdEVxdWFsczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBsZXQgZmlsdGVyVmFsdWU6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5maWx0ZXJWYWx1ZTtcbiAgICBjb25zdCBpZ25vcmVDYXNlOiBib29sZWFuID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZUNhc2U7XG5cbiAgICBmaWx0ZXJWYWx1ZSA9XG4gICAgICBDb21wYXJhdG9yLmlzU3RyaW5nKGZpbHRlclZhbHVlKSAmJiBpZ25vcmVDYXNlIFxuICAgICAgICA/IGZpbHRlclZhbHVlLnRvTG93ZXJDYXNlKCkgXG4gICAgICAgIDogZmlsdGVyVmFsdWU7IFxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKCBcbiAgICAgICAgdmFsLFxuICAgICAgICBjdXJyZW50RmlsdGVyT3B0aW9ucyEudmFyaWFibGVNYXBwZXJzISwgXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIHZhbCA9XG4gICAgICAgIENvbXBhcmF0b3IuaXNTdHJpbmcodmFsKSAmJiBpZ25vcmVDYXNlXG4gICAgICAgICAgPyB2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgOiB2YWw7XG5cbiAgICAgICAgXG4gICAgICBpZiAodmFsICE9IGZpbHRlclZhbHVlKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBub3RFcXVhbHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdEVxdWFscztcbiAgfVxuXG4gIHN0YXRpYyBTVFJJQ1RfRVFVQUxTKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgZXF1YWxzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCBjdXJyZW50RmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBudWxsID0gQ29tcGFyYXRvci5nZXRDdXJyZW50RmlsdGVyT3B0aW9ucygpO1xuICAgIGlmICghY3VycmVudEZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vRmlsdGVyT3B0aW9uc0Vycm9yKCk7XG4gICAgfVxuICAgIGxldCBmaWx0ZXJWYWx1ZTogc3RyaW5nID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuICAgIGNvbnN0IGlnbm9yZUNhc2U6IGJvb2xlYW4gPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlQ2FzZTtcblxuICAgIGZpbHRlclZhbHVlID1cbiAgICAgIENvbXBhcmF0b3IuaXNTdHJpbmcoZmlsdGVyVmFsdWUpICYmIGlnbm9yZUNhc2VcbiAgICAgICAgPyBmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIDogZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIHZhbCA9XG4gICAgICAgIENvbXBhcmF0b3IuaXNTdHJpbmcodmFsKSAmJiBpZ25vcmVDYXNlXG4gICAgICAgICAgPyB2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgOiB2YWw7XG5cbiAgICAgIGlmICh2YWwgPT09IGZpbHRlclZhbHVlKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIGVxdWFscyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZXF1YWxzO1xuICB9XG5cbiAgc3RhdGljIE5PVF9TVFJJQ1RfRVFVQUxTKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgbm90U3RyaWN0RXF1YWxzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCBjdXJyZW50RmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBudWxsID0gQ29tcGFyYXRvci5nZXRDdXJyZW50RmlsdGVyT3B0aW9ucygpO1xuICAgIGlmICghY3VycmVudEZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vRmlsdGVyT3B0aW9uc0Vycm9yKCk7XG4gICAgfVxuICAgIGxldCBmaWx0ZXJWYWx1ZTogc3RyaW5nID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuICAgIGNvbnN0IGlnbm9yZUNhc2U6IGJvb2xlYW4gPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlQ2FzZTtcblxuICAgIGZpbHRlclZhbHVlID1cbiAgICAgIENvbXBhcmF0b3IuaXNTdHJpbmcoZmlsdGVyVmFsdWUpICYmIGlnbm9yZUNhc2VcbiAgICAgICAgPyBmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIDogZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIHZhbCA9XG4gICAgICAgIENvbXBhcmF0b3IuaXNTdHJpbmcodmFsKSAmJiBpZ25vcmVDYXNlXG4gICAgICAgICAgPyB2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgOiB2YWw7XG5cbiAgICAgIGlmICh2YWwgIT09IGZpbHRlclZhbHVlKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIG5vdFN0cmljdEVxdWFscyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm90U3RyaWN0RXF1YWxzO1xuICB9XG5cbiAgc3RhdGljIExFU1NfVEhBTih2YWx1ZTogYW55LCBpbmRleD86IG51bWJlciwgYXJyYXk/OiBhbnlbXSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG5cbiAgICBjb25zdCBudW1PZlZhbHVlczogbnVtYmVyID0gdmFscy5sZW5ndGg7XG4gICAgY29uc3QgcmVxdWlyZWRNYXRjaGVzOiBudW1iZXIgPVxuICAgICAgRmlsdGVyQ29tcGFyYXRvci5nZXRSZXF1aXJlZE1hdGNoZXMobnVtT2ZWYWx1ZXMpO1xuICAgIGxldCBtYXRjaENvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCBsZXNzVGhhbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBjb25zdCBmaWx0ZXJWYWx1ZTogc3RyaW5nID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgfCBudW1iZXIgPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICB2YWwgPSBOdW1iZXIodmFsKTtcblxuICAgICAgaWYgKHZhbCA8IE51bWJlcihmaWx0ZXJWYWx1ZSkpIHtcbiAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICBpZiAobWF0Y2hDb3VudCA9PT0gcmVxdWlyZWRNYXRjaGVzKSB7XG4gICAgICAgICAgbGVzc1RoYW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlc3NUaGFuO1xuICB9XG5cbiAgc3RhdGljIEdSRUFURVJfVEhBTihcbiAgICB2YWx1ZTogYW55LFxuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGFycmF5PzogYW55W11cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGdyZWF0ZXJUaGFuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCBjdXJyZW50RmlsdGVyT3B0aW9uczogSUZpbHRlck9wdGlvbnMgfCBudWxsID0gQ29tcGFyYXRvci5nZXRDdXJyZW50RmlsdGVyT3B0aW9ucygpO1xuICAgIGlmICghY3VycmVudEZpbHRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vRmlsdGVyT3B0aW9uc0Vycm9yKCk7XG4gICAgfVxuICAgIGNvbnN0IGZpbHRlclZhbHVlOiBzdHJpbmcgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuZmlsdGVyVmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IHN0cmluZyB8IG51bWJlciA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIHZhbCA9IE51bWJlcih2YWwpO1xuXG4gICAgICBpZiAodmFsID4gTnVtYmVyKGZpbHRlclZhbHVlKSkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBncmVhdGVyVGhhbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZ3JlYXRlclRoYW47XG4gIH1cblxuICBzdGF0aWMgTEVTU19USEFOX09SX0VRVUFMKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgbGVzc1RoYW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgY29uc3QgZmlsdGVyVmFsdWU6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5maWx0ZXJWYWx1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZWYWx1ZXM7IGkrKykge1xuICAgICAgbGV0IHZhbDogc3RyaW5nIHwgbnVtYmVyID0gdmFsc1tpXTtcbiAgICAgIHZhbCA9IEZpbHRlckNvbXBhcmF0b3IuZ2V0TW9kaWZpZWRWYWx1ZShcbiAgICAgICAgdmFsLFxuICAgICAgICBjdXJyZW50RmlsdGVyT3B0aW9ucyEudmFyaWFibGVNYXBwZXJzISxcbiAgICAgICAgaVxuICAgICAgKTtcblxuICAgICAgdmFsID0gTnVtYmVyKHZhbCk7XG5cbiAgICAgIGlmICh2YWwgPD0gTnVtYmVyKGZpbHRlclZhbHVlKSkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBsZXNzVGhhbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGVzc1RoYW47XG4gIH1cblxuICBzdGF0aWMgR1JFQVRFUl9USEFOX09SX0VRVUFMKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgZ3JlYXRlclRoYW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgY29uc3QgZmlsdGVyVmFsdWU6IHN0cmluZyA9IGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5maWx0ZXJWYWx1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZWYWx1ZXM7IGkrKykge1xuICAgICAgbGV0IHZhbDogc3RyaW5nIHwgbnVtYmVyID0gdmFsc1tpXTtcbiAgICAgIHZhbCA9IEZpbHRlckNvbXBhcmF0b3IuZ2V0TW9kaWZpZWRWYWx1ZShcbiAgICAgICAgdmFsLFxuICAgICAgICBjdXJyZW50RmlsdGVyT3B0aW9ucyEudmFyaWFibGVNYXBwZXJzISxcbiAgICAgICAgaVxuICAgICAgKTtcblxuICAgICAgdmFsID0gTnVtYmVyKHZhbCk7XG5cbiAgICAgIGlmICh2YWwgPj0gTnVtYmVyKGZpbHRlclZhbHVlKSkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBncmVhdGVyVGhhbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZ3JlYXRlclRoYW47XG4gIH1cblxuICBzdGF0aWMgSVNfQUZURVJfREFURShcbiAgICB2YWx1ZTogYW55LFxuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGFycmF5PzogYW55W11cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGFmdGVyRGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBsZXQgZmlsdGVyVmFsdWU6IERhdGUgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuZmlsdGVyVmFsdWU7XG5cbiAgICBpZiAoY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZVRpbWVPZkRheSkge1xuICAgICAgZmlsdGVyVmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXJWYWx1ZSk7XG4gICAgICBmaWx0ZXJWYWx1ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IERhdGUgPSBuZXcgRGF0ZSh2YWxzW2ldKTtcbiAgICAgIHZhbCA9IEZpbHRlckNvbXBhcmF0b3IuZ2V0TW9kaWZpZWRWYWx1ZShcbiAgICAgICAgdmFsLFxuICAgICAgICBjdXJyZW50RmlsdGVyT3B0aW9ucyEudmFyaWFibGVNYXBwZXJzISxcbiAgICAgICAgaVxuICAgICAgKTtcblxuICAgICAgaWYgKGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVUaW1lT2ZEYXkpIHtcbiAgICAgICAgdmFsID0gbmV3IERhdGUodmFsKTtcbiAgICAgICAgdmFsLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsLmdldFRpbWUoKSA+IGZpbHRlclZhbHVlLmdldFRpbWUoKSkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBhZnRlckRhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFmdGVyRGF0ZTtcbiAgfVxuXG4gIHN0YXRpYyBJU19CRUZPUkVfREFURShcbiAgICB2YWx1ZTogYW55LFxuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGFycmF5PzogYW55W11cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGJlZm9yZURhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgbGV0IGZpbHRlclZhbHVlOiBEYXRlID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuXG4gICAgaWYgKGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVUaW1lT2ZEYXkpIHtcbiAgICAgIGZpbHRlclZhbHVlID0gbmV3IERhdGUoZmlsdGVyVmFsdWUpO1xuICAgICAgZmlsdGVyVmFsdWUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBEYXRlID0gbmV3IERhdGUodmFsc1tpXSk7XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIGlmIChjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlVGltZU9mRGF5KSB7XG4gICAgICAgIHZhbCA9IG5ldyBEYXRlKHZhbCk7XG4gICAgICAgIHZhbC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbC5nZXRUaW1lKCkgPCBmaWx0ZXJWYWx1ZS5nZXRUaW1lKCkpIHtcbiAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICBpZiAobWF0Y2hDb3VudCA9PT0gcmVxdWlyZWRNYXRjaGVzKSB7XG4gICAgICAgICAgYmVmb3JlRGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmVmb3JlRGF0ZTtcbiAgfVxuXG4gIHN0YXRpYyBEQVRFX0lTKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyLCBhcnJheT86IGFueVtdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGJlZm9yZURhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgbGV0IGZpbHRlclZhbHVlOiBEYXRlID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuXG4gICAgaWYgKGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVUaW1lT2ZEYXkpIHtcbiAgICAgIGZpbHRlclZhbHVlID0gbmV3IERhdGUoZmlsdGVyVmFsdWUpO1xuICAgICAgZmlsdGVyVmFsdWUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBEYXRlID0gbmV3IERhdGUodmFsc1tpXSk7XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIGlmIChjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlVGltZU9mRGF5KSB7XG4gICAgICAgIHZhbCA9IG5ldyBEYXRlKHZhbCk7XG4gICAgICAgIHZhbC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbC5nZXRUaW1lKCkgPT09IGZpbHRlclZhbHVlLmdldFRpbWUoKSkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBiZWZvcmVEYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBiZWZvcmVEYXRlO1xuICB9XG5cbiAgc3RhdGljIERBVEVfSVNfTk9UKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyLCBhcnJheT86IGFueVtdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGlzTm90RGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBsZXQgZmlsdGVyVmFsdWU6IERhdGUgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuZmlsdGVyVmFsdWU7XG5cbiAgICBpZiAoY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZVRpbWVPZkRheSkge1xuICAgICAgZmlsdGVyVmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXJWYWx1ZSk7XG4gICAgICBmaWx0ZXJWYWx1ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IERhdGUgPSBuZXcgRGF0ZSh2YWxzW2ldKTtcbiAgICAgIHZhbCA9IEZpbHRlckNvbXBhcmF0b3IuZ2V0TW9kaWZpZWRWYWx1ZShcbiAgICAgICAgdmFsLFxuICAgICAgICBjdXJyZW50RmlsdGVyT3B0aW9ucyEudmFyaWFibGVNYXBwZXJzISxcbiAgICAgICAgaVxuICAgICAgKTtcblxuICAgICAgaWYgKGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVUaW1lT2ZEYXkpIHtcbiAgICAgICAgdmFsID0gbmV3IERhdGUodmFsKTtcbiAgICAgICAgdmFsLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsLmdldFRpbWUoKSAhPT0gZmlsdGVyVmFsdWUuZ2V0VGltZSgpKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIGlzTm90RGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXNOb3REYXRlO1xuICB9XG5cbiAgc3RhdGljIElTX09OX09SX0FGVEVSX0RBVEUoXG4gICAgdmFsdWU6IGFueSxcbiAgICBpbmRleD86IG51bWJlcixcbiAgICBhcnJheT86IGFueVtdXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG5cbiAgICBjb25zdCBudW1PZlZhbHVlczogbnVtYmVyID0gdmFscy5sZW5ndGg7XG4gICAgY29uc3QgcmVxdWlyZWRNYXRjaGVzOiBudW1iZXIgPVxuICAgICAgRmlsdGVyQ29tcGFyYXRvci5nZXRSZXF1aXJlZE1hdGNoZXMobnVtT2ZWYWx1ZXMpO1xuICAgIGxldCBtYXRjaENvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCBhZnRlckRhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG4gICAgbGV0IGZpbHRlclZhbHVlOiBEYXRlID0gY3VycmVudEZpbHRlck9wdGlvbnMhLmZpbHRlclZhbHVlO1xuXG4gICAgaWYgKGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVUaW1lT2ZEYXkpIHtcbiAgICAgIGZpbHRlclZhbHVlID0gbmV3IERhdGUoZmlsdGVyVmFsdWUpO1xuICAgICAgZmlsdGVyVmFsdWUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZlZhbHVlczsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBEYXRlID0gbmV3IERhdGUodmFsc1tpXSk7XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIGlmIChjdXJyZW50RmlsdGVyT3B0aW9ucyEuaWdub3JlVGltZU9mRGF5KSB7XG4gICAgICAgIHZhbCA9IG5ldyBEYXRlKHZhbCk7XG4gICAgICAgIHZhbC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbC5nZXRUaW1lKCkgPj0gZmlsdGVyVmFsdWUuZ2V0VGltZSgpKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIGFmdGVyRGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYWZ0ZXJEYXRlO1xuICB9XG5cbiAgc3RhdGljIElTX09OX09SX0JFRk9SRV9EQVRFKFxuICAgIHZhbHVlOiBhbnksXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgYXJyYXk/OiBhbnlbXVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWxzOiBhbnlbXSA9XG4gICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5nZXRGaWx0ZXJWYWx1ZXNGcm9tUHJvcGVydHlJbmRlbnRpZmllcnMoXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuXG4gICAgY29uc3QgbnVtT2ZWYWx1ZXM6IG51bWJlciA9IHZhbHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlcXVpcmVkTWF0Y2hlczogbnVtYmVyID1cbiAgICAgIEZpbHRlckNvbXBhcmF0b3IuZ2V0UmVxdWlyZWRNYXRjaGVzKG51bU9mVmFsdWVzKTtcbiAgICBsZXQgbWF0Y2hDb3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgYmVmb3JlRGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cbiAgICBsZXQgZmlsdGVyVmFsdWU6IERhdGUgPSBjdXJyZW50RmlsdGVyT3B0aW9ucyEuZmlsdGVyVmFsdWU7XG5cbiAgICBpZiAoY3VycmVudEZpbHRlck9wdGlvbnMhLmlnbm9yZVRpbWVPZkRheSkge1xuICAgICAgZmlsdGVyVmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXJWYWx1ZSk7XG4gICAgICBmaWx0ZXJWYWx1ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IERhdGUgPSBuZXcgRGF0ZSh2YWxzW2ldKTtcbiAgICAgIHZhbCA9IEZpbHRlckNvbXBhcmF0b3IuZ2V0TW9kaWZpZWRWYWx1ZShcbiAgICAgICAgdmFsLFxuICAgICAgICBjdXJyZW50RmlsdGVyT3B0aW9ucyEudmFyaWFibGVNYXBwZXJzISxcbiAgICAgICAgaVxuICAgICAgKTtcblxuICAgICAgaWYgKGN1cnJlbnRGaWx0ZXJPcHRpb25zIS5pZ25vcmVUaW1lT2ZEYXkpIHtcbiAgICAgICAgdmFsID0gbmV3IERhdGUodmFsKTtcbiAgICAgICAgdmFsLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsLmdldFRpbWUoKSA8PSBmaWx0ZXJWYWx1ZS5nZXRUaW1lKCkpIHtcbiAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICBpZiAobWF0Y2hDb3VudCA9PT0gcmVxdWlyZWRNYXRjaGVzKSB7XG4gICAgICAgICAgYmVmb3JlRGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmVmb3JlRGF0ZTtcbiAgfVxuXG4gIHN0YXRpYyBJU19UUlVFKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyLCBhcnJheT86IGFueVtdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGlzVHJ1ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IGJvb2xlYW4gPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICBpZiAodmFsID09PSB0cnVlKSB7XG4gICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgaWYgKG1hdGNoQ291bnQgPT09IHJlcXVpcmVkTWF0Y2hlcykge1xuICAgICAgICAgIGlzVHJ1ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXNUcnVlO1xuICB9XG5cbiAgc3RhdGljIElTX0ZBTFNFKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyLCBhcnJheT86IGFueVtdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGlzRmFsc2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IGJvb2xlYW4gPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICBpZiAodmFsID09PSBmYWxzZSkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBpc0ZhbHNlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpc0ZhbHNlO1xuICB9XG5cbiAgc3RhdGljIElTX1RSVVRIWSh2YWx1ZTogYW55LCBpbmRleD86IG51bWJlciwgYXJyYXk/OiBhbnlbXSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHM6IGFueVtdID1cbiAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmdldEZpbHRlclZhbHVlc0Zyb21Qcm9wZXJ0eUluZGVudGlmaWVycyhcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG5cbiAgICBjb25zdCBudW1PZlZhbHVlczogbnVtYmVyID0gdmFscy5sZW5ndGg7XG4gICAgY29uc3QgcmVxdWlyZWRNYXRjaGVzOiBudW1iZXIgPVxuICAgICAgRmlsdGVyQ29tcGFyYXRvci5nZXRSZXF1aXJlZE1hdGNoZXMobnVtT2ZWYWx1ZXMpO1xuICAgIGxldCBtYXRjaENvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCBpc1RydXRoeTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VycmVudEZpbHRlck9wdGlvbnM6IElGaWx0ZXJPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudEZpbHRlck9wdGlvbnMoKTtcbiAgICBpZiAoIWN1cnJlbnRGaWx0ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLnRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZWYWx1ZXM7IGkrKykge1xuICAgICAgbGV0IHZhbDogYm9vbGVhbiA9IHZhbHNbaV07XG4gICAgICB2YWwgPSBGaWx0ZXJDb21wYXJhdG9yLmdldE1vZGlmaWVkVmFsdWUoXG4gICAgICAgIHZhbCxcbiAgICAgICAgY3VycmVudEZpbHRlck9wdGlvbnMhLnZhcmlhYmxlTWFwcGVycyEsXG4gICAgICAgIGlcbiAgICAgICk7XG5cbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICBpZiAobWF0Y2hDb3VudCA9PT0gcmVxdWlyZWRNYXRjaGVzKSB7XG4gICAgICAgICAgaXNUcnV0aHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzVHJ1dGh5O1xuICB9XG5cbiAgc3RhdGljIElTX0ZBTFNZKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyLCBhcnJheT86IGFueVtdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0RmlsdGVyVmFsdWVzRnJvbVByb3BlcnR5SW5kZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IG51bU9mVmFsdWVzOiBudW1iZXIgPSB2YWxzLmxlbmd0aDtcbiAgICBjb25zdCByZXF1aXJlZE1hdGNoZXM6IG51bWJlciA9XG4gICAgICBGaWx0ZXJDb21wYXJhdG9yLmdldFJlcXVpcmVkTWF0Y2hlcyhudW1PZlZhbHVlcyk7XG4gICAgbGV0IG1hdGNoQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGlzRmFsc3k6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXJPcHRpb25zOiBJRmlsdGVyT3B0aW9ucyB8IG51bGwgPSBDb21wYXJhdG9yLmdldEN1cnJlbnRGaWx0ZXJPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50RmlsdGVyT3B0aW9ucykge1xuICAgICAgdGhpcy50cmlnZ2VyTm9GaWx0ZXJPcHRpb25zRXJyb3IoKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mVmFsdWVzOyBpKyspIHtcbiAgICAgIGxldCB2YWw6IGJvb2xlYW4gPSB2YWxzW2ldO1xuICAgICAgdmFsID0gRmlsdGVyQ29tcGFyYXRvci5nZXRNb2RpZmllZFZhbHVlKFxuICAgICAgICB2YWwsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXJPcHRpb25zIS52YXJpYWJsZU1hcHBlcnMhLFxuICAgICAgICBpXG4gICAgICApO1xuXG4gICAgICBpZiAoIXZhbCkge1xuICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgIGlmIChtYXRjaENvdW50ID09PSByZXF1aXJlZE1hdGNoZXMpIHtcbiAgICAgICAgICBpc0ZhbHN5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpc0ZhbHN5O1xuICB9XG5cbiAgc3RhdGljIHRyaWdnZXJOb0ZpbHRlck9wdGlvbnNFcnJvcigpIHtcbiAgICB0aHJvdyBFcnJvcihgUGxlYXNlIHN1cHBseSBhIEZpbHRlck9wdGlvbnMgb2JqZWN0IHRvIGZpbHRlciB5b3VyIGFycmF5IGJ5LmApO1xuICB9XG59XG4iXX0=