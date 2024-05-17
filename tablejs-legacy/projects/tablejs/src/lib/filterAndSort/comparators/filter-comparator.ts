import { Comparator } from './comparator';
import { MatchType } from './match-type';
import { IFilterOptions } from './../filter-and-sort.module';

export class FilterComparator extends Comparator {
  private static getRequiredMatches(numOfValues: number): number {
    if (!Comparator.filterSortService!.currentFilterOptions) {
      return 1;
    } else {
      return Comparator.filterSortService!.currentFilterOptions.matchType ===
      MatchType.ANY
      ? 1
      : numOfValues;
    }
  }

  private static escapeRegExp(str: string): string {
    const regExp = /[.*+?^${}()|[\]\\]/g;
    return str.replace(regExp, '\\$&'); // $& means the whole matched string
  }

  public static getModifiedValue(
    value: any,
    variableMappers: Function | (Function | null)[] | null,
    index: number
  ): any {
    if (Array.isArray(variableMappers)) {
      if (index > variableMappers.length - 1) {
        throw Error(`${value} does not have a variable mapper assigned to it.`);
      }
    }
    let modifier: Function | null;
    modifier = Array.isArray(variableMappers)
      ? variableMappers[index]
      : variableMappers;
    if (modifier !== null && modifier !== undefined) {
      return modifier.apply(null, [value]);
    }
    return value;
  }

  static CONTAINS_STRING(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let containsString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string =  currentFilterOptions!.filterValue;
    const ignoreCase: boolean =  currentFilterOptions!.ignoreCase;

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
         currentFilterOptions!.variableMappers!,
        i
      );

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

  static DOES_NOT_CONTAIN_STRING(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      ); 

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues); 
    let matchCount: number = 0;
    let doesNotContainString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string =  currentFilterOptions!.filterValue;
    const ignoreCase: boolean =  currentFilterOptions!.ignoreCase;

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
         currentFilterOptions!.variableMappers!,
        i
      );

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

  static CONTAINS_WORD(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );
    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let startsWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;
    const regExFlags: string = currentFilterOptions!.ignoreCase
      ? 'mi'
      : 'm';

    const punctuation: string = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
    + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
    const startsWithOrSpace: string = '(?:^|\\s|' + punctuation + ')';
    const escapedValue: string = FilterComparator.escapeRegExp(filterValue);

    const regex = new RegExp(
      startsWithOrSpace +
      '(' +
      escapedValue +
      '$|' +
      escapedValue +
      '(\\s|' +
      punctuation +
      '))',
      regExFlags
    );

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static DOES_NOT_CONTAIN_WORD(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );
    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let doesNotContainWord: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;
    const regExFlags: string = currentFilterOptions!.ignoreCase
      ? 'mi'
      : 'm';

    const punctuation: string = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
    + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
    const startsWithOrSpace: string = '(?:^|\\s|' + punctuation + ')';
    const escapedValue: string = FilterComparator.escapeRegExp(filterValue);

    const regex = new RegExp(
      startsWithOrSpace +
      '(' +
      escapedValue +
      '$|' +
      escapedValue +
      '(\\s|' +
      punctuation +
      '))',
      regExFlags
    );

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static STARTS_WITH(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let startsWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static DOES_NOT_START_WITH(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let doesNotStartWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static ENDS_WITH(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let endsWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      val = ignoreCase ? val.toLowerCase() : val;

      if (
        val
          .toString()
          .substr(val.length - filterValue.length, filterValue.length) ===
        filterValue
      ) {
        matchCount++;
        if (matchCount === requiredMatches) {
          endsWithString = true;
        }
      }
    }

    return endsWithString;
  }

  static DOES_NOT_END_WITH(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let doesNotEndWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      val = ignoreCase ? val.toLowerCase() : val;

      if (
        val
          .toString()
          .substr(val.length - filterValue.length, filterValue.length) !==
        filterValue
      ) {
        matchCount++;
        if (matchCount === requiredMatches) {
          doesNotEndWithString = true;
        }
      }
    }

    return doesNotEndWithString;
  }

  static WORD_STARTS_WITH(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let startsWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;
    const regExFlags: string = currentFilterOptions!.ignoreCase
      ? 'mi'
      : 'm';
    const escapedValue: string = FilterComparator.escapeRegExp(filterValue);
    const punctuation: string = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
    + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
    const startsWithOrSpace: string = '(?:^|\\s|' + punctuation + ')';
    const regex = new RegExp(startsWithOrSpace + escapedValue, regExFlags);

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static WORD_DOES_NOT_START_WITH(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let doesNotStartsWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;
    const regExFlags: string = currentFilterOptions!.ignoreCase
      ? 'mi'
      : 'm';
    const escapedValue: string = FilterComparator.escapeRegExp(filterValue);
    const punctuation: string = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
    + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
    const startsWithOrSpace: string = '(?:^|\\s|' + punctuation + ')';
    const regex = new RegExp(startsWithOrSpace + escapedValue, regExFlags);

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static WORD_ENDS_WITH(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let endsWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;
    const regExFlags: string = currentFilterOptions!.ignoreCase
      ? 'mi'
      : 'm';
    const escapedValue: string = FilterComparator.escapeRegExp(filterValue);
    const punctuation: string = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
    + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
    const regex = new RegExp(
      '(' + escapedValue + '$)|(' + escapedValue + '(\\s|' + punctuation + '))',
      regExFlags
    );

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static WORD_DOES_NOT_END_WITH(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let doesNotEndWithString: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;
    const regExFlags: string = currentFilterOptions!.ignoreCase
      ? 'mi'
      : 'm';
    const escapedValue: string = FilterComparator.escapeRegExp(filterValue);
    const punctuation: string = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
    + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
    const regex = new RegExp(
      '(' + escapedValue + '$)|(' + escapedValue + '(\\s|' + punctuation + '))',
      regExFlags
    );

    filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static EQUALS(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let equals: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;

    filterValue =
      Comparator.isString(filterValue) && ignoreCase
        ? filterValue.toLowerCase()
        : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static NOT_EQUAL(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      ); 

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues); 
    let matchCount: number = 0;
    let notEquals: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;

    filterValue =
      Comparator.isString(filterValue) && ignoreCase 
        ? filterValue.toLowerCase() 
        : filterValue; 

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue( 
        val,
        currentFilterOptions!.variableMappers!, 
        i
      );

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

  static STRICT_EQUALS(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let equals: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;

    filterValue =
      Comparator.isString(filterValue) && ignoreCase
        ? filterValue.toLowerCase()
        : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static NOT_STRICT_EQUALS(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let notStrictEquals: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: string = currentFilterOptions!.filterValue;
    const ignoreCase: boolean = currentFilterOptions!.ignoreCase;

    filterValue =
      Comparator.isString(filterValue) && ignoreCase
        ? filterValue.toLowerCase()
        : filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static LESS_THAN(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let lessThan: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    const filterValue: string = currentFilterOptions!.filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string | number = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static GREATER_THAN(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let greaterThan: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    const filterValue: string = currentFilterOptions!.filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string | number = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static LESS_THAN_OR_EQUAL(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let lessThan: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    const filterValue: string = currentFilterOptions!.filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string | number = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static GREATER_THAN_OR_EQUAL(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let greaterThan: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    const filterValue: string = currentFilterOptions!.filterValue;

    for (let i = 0; i < numOfValues; i++) {
      let val: string | number = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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

  static IS_AFTER_DATE(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let afterDate: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: Date = currentFilterOptions!.filterValue;

    if (currentFilterOptions!.ignoreTimeOfDay) {
      filterValue = new Date(filterValue);
      filterValue.setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: Date = new Date(vals[i]);
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (currentFilterOptions!.ignoreTimeOfDay) {
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

  static IS_BEFORE_DATE(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let beforeDate: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: Date = currentFilterOptions!.filterValue;

    if (currentFilterOptions!.ignoreTimeOfDay) {
      filterValue = new Date(filterValue);
      filterValue.setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: Date = new Date(vals[i]);
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (currentFilterOptions!.ignoreTimeOfDay) {
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

  static DATE_IS(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let beforeDate: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: Date = currentFilterOptions!.filterValue;

    if (currentFilterOptions!.ignoreTimeOfDay) {
      filterValue = new Date(filterValue);
      filterValue.setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: Date = new Date(vals[i]);
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (currentFilterOptions!.ignoreTimeOfDay) {
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

  static DATE_IS_NOT(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let isNotDate: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: Date = currentFilterOptions!.filterValue;

    if (currentFilterOptions!.ignoreTimeOfDay) {
      filterValue = new Date(filterValue);
      filterValue.setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: Date = new Date(vals[i]);
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (currentFilterOptions!.ignoreTimeOfDay) {
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

  static IS_ON_OR_AFTER_DATE(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let afterDate: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: Date = currentFilterOptions!.filterValue;

    if (currentFilterOptions!.ignoreTimeOfDay) {
      filterValue = new Date(filterValue);
      filterValue.setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: Date = new Date(vals[i]);
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (currentFilterOptions!.ignoreTimeOfDay) {
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

  static IS_ON_OR_BEFORE_DATE(
    value: any,
    index?: number,
    array?: any[]
  ): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let beforeDate: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }
    let filterValue: Date = currentFilterOptions!.filterValue;

    if (currentFilterOptions!.ignoreTimeOfDay) {
      filterValue = new Date(filterValue);
      filterValue.setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: Date = new Date(vals[i]);
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (currentFilterOptions!.ignoreTimeOfDay) {
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

  static IS_TRUE(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let isTrue: boolean = false;
    
    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: boolean = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (val === true) {
        matchCount++;
        if (matchCount === requiredMatches) {
          isTrue = true;
        }
      }
    }

    return isTrue;
  }

  static IS_FALSE(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let isFalse: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: boolean = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (val === false) {
        matchCount++;
        if (matchCount === requiredMatches) {
          isFalse = true;
        }
      }
    }

    return isFalse;
  }

  static IS_TRUTHY(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let isTruthy: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: boolean = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

      if (val) {
        matchCount++;
        if (matchCount === requiredMatches) {
          isTruthy = true;
        }
      }
    }

    return isTruthy;
  }

  static IS_FALSY(value: any, index?: number, array?: any[]): boolean {
    const vals: any[] =
      Comparator.filterSortService!.getFilterValuesFromPropertyIndentifiers(
        value
      );

    const numOfValues: number = vals.length;
    const requiredMatches: number =
      FilterComparator.getRequiredMatches(numOfValues);
    let matchCount: number = 0;
    let isFalsy: boolean = false;

    const currentFilterOptions: IFilterOptions | null = Comparator.getCurrentFilterOptions();
    if (!currentFilterOptions) {
      this.triggerNoFilterOptionsError();
    }

    for (let i = 0; i < numOfValues; i++) {
      let val: boolean = vals[i];
      val = FilterComparator.getModifiedValue(
        val,
        currentFilterOptions!.variableMappers!,
        i
      );

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
