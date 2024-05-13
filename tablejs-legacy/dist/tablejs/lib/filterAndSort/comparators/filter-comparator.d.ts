import { Comparator } from './comparator';
export declare class FilterComparator extends Comparator {
    private static getRequiredMatches;
    private static escapeRegExp;
    static getModifiedValue(value: any, variableMappers: Function | (Function | null)[] | null, index: number): any;
    static CONTAINS_STRING(value: any, index?: number, array?: any[]): boolean;
    static DOES_NOT_CONTAIN_STRING(value: any, index?: number, array?: any[]): boolean;
    static CONTAINS_WORD(value: any, index?: number, array?: any[]): boolean;
    static DOES_NOT_CONTAIN_WORD(value: any, index?: number, array?: any[]): boolean;
    static STARTS_WITH(value: any, index?: number, array?: any[]): boolean;
    static DOES_NOT_START_WITH(value: any, index?: number, array?: any[]): boolean;
    static ENDS_WITH(value: any, index?: number, array?: any[]): boolean;
    static DOES_NOT_END_WITH(value: any, index?: number, array?: any[]): boolean;
    static WORD_STARTS_WITH(value: any, index?: number, array?: any[]): boolean;
    static WORD_DOES_NOT_START_WITH(value: any, index?: number, array?: any[]): boolean;
    static WORD_ENDS_WITH(value: any, index?: number, array?: any[]): boolean;
    static WORD_DOES_NOT_END_WITH(value: any, index?: number, array?: any[]): boolean;
    static EQUALS(value: any, index?: number, array?: any[]): boolean;
    static NOT_EQUAL(value: any, index?: number, array?: any[]): boolean;
    static STRICT_EQUALS(value: any, index?: number, array?: any[]): boolean;
    static NOT_STRICT_EQUALS(value: any, index?: number, array?: any[]): boolean;
    static LESS_THAN(value: any, index?: number, array?: any[]): boolean;
    static GREATER_THAN(value: any, index?: number, array?: any[]): boolean;
    static LESS_THAN_OR_EQUAL(value: any, index?: number, array?: any[]): boolean;
    static GREATER_THAN_OR_EQUAL(value: any, index?: number, array?: any[]): boolean;
    static IS_AFTER_DATE(value: any, index?: number, array?: any[]): boolean;
    static IS_BEFORE_DATE(value: any, index?: number, array?: any[]): boolean;
    static DATE_IS(value: any, index?: number, array?: any[]): boolean;
    static DATE_IS_NOT(value: any, index?: number, array?: any[]): boolean;
    static IS_ON_OR_AFTER_DATE(value: any, index?: number, array?: any[]): boolean;
    static IS_ON_OR_BEFORE_DATE(value: any, index?: number, array?: any[]): boolean;
    static IS_TRUE(value: any, index?: number, array?: any[]): boolean;
    static IS_FALSE(value: any, index?: number, array?: any[]): boolean;
    static IS_TRUTHY(value: any, index?: number, array?: any[]): boolean;
    static IS_FALSY(value: any, index?: number, array?: any[]): boolean;
    static triggerNoFilterOptionsError(): void;
}
//# sourceMappingURL=filter-comparator.d.ts.map