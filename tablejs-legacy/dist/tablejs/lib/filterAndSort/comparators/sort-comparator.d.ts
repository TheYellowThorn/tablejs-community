import { Comparator } from './comparator';
export declare class SortComparator extends Comparator {
    static DATE(valueA: any, valueB: any): number;
    static NUMERIC(valueA: any, valueB: any): number;
    static BOOLEAN(valueA: any, valueB: any): number;
    static TRUTHY(valueA: any, valueB: any): number;
    static ALPHABETICAL(valueA: any, valueB: any): number;
    static triggerNoSortOptionsError(): void;
}
//# sourceMappingURL=sort-comparator.d.ts.map