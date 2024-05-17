import { Comparator } from './comparator';
import { ISortOptions } from './../filter-and-sort.module';

export class SortComparator extends Comparator {
  static DATE(valueA: any, valueB: any): number {
    const values: any[] =
      Comparator.filterSortService!.getSortValuesFromPropertyIdentifiers(
        valueA,
        valueB
      );
    let varA = values[0];
    let varB = values[1];

    const currentSortOptions: ISortOptions | null = Comparator.getCurrentSortOptions();
    if (!currentSortOptions) {
      this.triggerNoSortOptionsError();
    }

    if (currentSortOptions!.ignoreTimeOfDay) {
      varA = new Date(varA);
      varB = new Date(varB);
      varA.setHours(0, 0, 0, 0);
      varB.setHours(0, 0, 0, 0);
    }

    const modifier: Function | null = currentSortOptions!.variableMapper!;
    if (modifier !== null && modifier !== undefined) {
      varA = modifier.apply(null, [varA]);
      varB = modifier.apply(null, [varB]);
    }

    if (varA === varB) {
      return 0;
    }
    return Comparator.filterSortService!.sortDirection === 1
      ? varA - varB
      : varB - varA;
  }

  static NUMERIC(valueA: any, valueB: any): number {
    const values: any[] =
      Comparator.filterSortService!.getSortValuesFromPropertyIdentifiers(
        valueA,
        valueB
      );
    let varA = values[0];
    let varB = values[1];

    const currentSortOptions: ISortOptions | null = Comparator.getCurrentSortOptions();
    if (!currentSortOptions) {
      this.triggerNoSortOptionsError();
    }

    const modifier: Function | null = currentSortOptions!.variableMapper!;
    if (modifier !== null && modifier !== undefined) {
      varA = modifier.apply(null, [varA]);
      varB = modifier.apply(null, [varB]);
    }

    if (varA === varB) {
      return 0;
    }
    return varA > varB
      ? 1 * Comparator.filterSortService!.sortDirection
      : -1 * Comparator.filterSortService!.sortDirection;
  }

  static BOOLEAN(valueA: any, valueB: any): number {
    const values: any[] =
      Comparator.filterSortService!.getSortValuesFromPropertyIdentifiers(
        valueA,
        valueB
      );
    let varA = values[0];
    let varB = values[1];

    const currentSortOptions: ISortOptions | null = Comparator.getCurrentSortOptions();
    if (!currentSortOptions) {
      this.triggerNoSortOptionsError();
    }

    const modifier: Function | null = currentSortOptions!.variableMapper!;
    if (modifier !== null && modifier !== undefined) {
      varA = modifier.apply(null, [varA]);
      varB = modifier.apply(null, [varB]);
    }

    if (varA === varB) {
      return 0;
    }
    return Comparator.filterSortService!.sortDirection === 1
      ? varA - varB
      : varB - varA;
  }

  static TRUTHY(valueA: any, valueB: any): number {
    const values: any[] =
      Comparator.filterSortService!.getSortValuesFromPropertyIdentifiers(
        valueA,
        valueB
      );
    let varA = values[0];
    let varB = values[1];

    const currentSortOptions: ISortOptions | null = Comparator.getCurrentSortOptions();
    if (!currentSortOptions) {
      this.triggerNoSortOptionsError();
    }

    const modifier: Function | null = currentSortOptions!.variableMapper!;
    if (modifier !== null && modifier !== undefined) {
      varA = modifier.apply(null, [varA]);
      varB = modifier.apply(null, [varB]);
    }

    const varAIsFalsy: number = varA ? 1 : 0;
    const varBIsFalsy: number = varB ? 1 : 0;

    if (varAIsFalsy === varBIsFalsy) {
      return 0;
    }
    return Comparator.filterSortService!.sortDirection === 1
      ? varAIsFalsy - varBIsFalsy
      : varBIsFalsy - varAIsFalsy;
  }

  static ALPHABETICAL(valueA: any, valueB: any): number {
    const values: any[] =
      Comparator.filterSortService!.getSortValuesFromPropertyIdentifiers(
        valueA,
        valueB
      );
    let varA = values[0];
    let varB = values[1];

    const currentSortOptions: ISortOptions | null = Comparator.getCurrentSortOptions();
    if (!currentSortOptions) {
      this.triggerNoSortOptionsError();
    }

    const modifier: Function | null = currentSortOptions!.variableMapper!;
    if (modifier !== null && modifier !== undefined) {
      varA = modifier.apply(null, [varA]);
      varB = modifier.apply(null, [varB]);
    }

    if (Comparator.filterSortService!.ignoreCase) {
      if (
        (typeof varA === 'string' || varA instanceof String) &&
        (typeof varB === 'string' || varB instanceof String)
      ) {
        varA = varA.toLowerCase();
        varB = varB.toLowerCase();
      }
    }

    varA = varA.toString();
    varB = varB.toString();

    if (varA == varB || !Comparator.filterSortService!.currentSortOptions) {
      return 0;
    }
    if (Comparator.filterSortService!.currentSortOptions.useLocaleCompare) {
      if (
        Comparator.filterSortService!.currentSortOptions.localeCompareOptions
      ) {
        const locales: string | string[] =
          Comparator.filterSortService!.currentSortOptions
            .localeCompareOptions[0];
        const options: Intl.CollatorOptions | null = Comparator.filterSortService!.currentSortOptions.localeCompareOptions.length > 1 ? Comparator.filterSortService!.currentSortOptions.localeCompareOptions[1] as Intl.CollatorOptions : null;
        if (options) {
          return (
            varA.localeCompare(varB, locales, options) *
            Comparator.filterSortService!.sortDirection
          );
        } else {
          return varA.localeCompare(varB, locales) *
            Comparator.filterSortService!.sortDirection;
        }
      } else {
        return (
          varA.localeCompare(varB) * Comparator.filterSortService!.sortDirection
        );
      }
    } else {
      return varA > varB
        ? Comparator.filterSortService!.sortDirection * 1
        : Comparator.filterSortService!.sortDirection * -1;
    }
  }

  static triggerNoSortOptionsError() {
    throw Error(`Please supply a SortOptions object to sort your array by.`);
  }
}
