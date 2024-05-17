import { Comparator } from './comparator';
export class SortComparator extends Comparator {
    static DATE(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        if (currentSortOptions.ignoreTimeOfDay) {
            varA = new Date(varA);
            varB = new Date(varB);
            varA.setHours(0, 0, 0, 0);
            varB.setHours(0, 0, 0, 0);
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        if (varA === varB) {
            return 0;
        }
        return Comparator.filterSortService.sortDirection === 1
            ? varA - varB
            : varB - varA;
    }
    static NUMERIC(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        if (varA === varB) {
            return 0;
        }
        return varA > varB
            ? 1 * Comparator.filterSortService.sortDirection
            : -1 * Comparator.filterSortService.sortDirection;
    }
    static BOOLEAN(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        if (varA === varB) {
            return 0;
        }
        return Comparator.filterSortService.sortDirection === 1
            ? varA - varB
            : varB - varA;
    }
    static TRUTHY(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        const varAIsFalsy = varA ? 1 : 0;
        const varBIsFalsy = varB ? 1 : 0;
        if (varAIsFalsy === varBIsFalsy) {
            return 0;
        }
        return Comparator.filterSortService.sortDirection === 1
            ? varAIsFalsy - varBIsFalsy
            : varBIsFalsy - varAIsFalsy;
    }
    static ALPHABETICAL(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        if (Comparator.filterSortService.ignoreCase) {
            if ((typeof varA === 'string' || varA instanceof String) &&
                (typeof varB === 'string' || varB instanceof String)) {
                varA = varA.toLowerCase();
                varB = varB.toLowerCase();
            }
        }
        varA = varA.toString();
        varB = varB.toString();
        if (varA == varB || !Comparator.filterSortService.currentSortOptions) {
            return 0;
        }
        if (Comparator.filterSortService.currentSortOptions.useLocaleCompare) {
            if (Comparator.filterSortService.currentSortOptions.localeCompareOptions) {
                const locales = Comparator.filterSortService.currentSortOptions
                    .localeCompareOptions[0];
                const options = Comparator.filterSortService.currentSortOptions.localeCompareOptions.length > 1 ? Comparator.filterSortService.currentSortOptions.localeCompareOptions[1] : null;
                if (options) {
                    return (varA.localeCompare(varB, locales, options) *
                        Comparator.filterSortService.sortDirection);
                }
                else {
                    return varA.localeCompare(varB, locales) *
                        Comparator.filterSortService.sortDirection;
                }
            }
            else {
                return (varA.localeCompare(varB) * Comparator.filterSortService.sortDirection);
            }
        }
        else {
            return varA > varB
                ? Comparator.filterSortService.sortDirection * 1
                : Comparator.filterSortService.sortDirection * -1;
        }
    }
    static triggerNoSortOptionsError() {
        throw Error(`Please supply a SortOptions object to sort your array by.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1jb21wYXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2ZpbHRlckFuZFNvcnQvY29tcGFyYXRvcnMvc29ydC1jb21wYXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHMUMsTUFBTSxPQUFPLGNBQWUsU0FBUSxVQUFVO0lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBVyxFQUFFLE1BQVc7UUFDbEMsTUFBTSxNQUFNLEdBQ1YsVUFBVSxDQUFDLGlCQUFrQixDQUFDLG9DQUFvQyxDQUNoRSxNQUFNLEVBQ04sTUFBTSxDQUNQLENBQUM7UUFDSixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJCLE1BQU0sa0JBQWtCLEdBQXdCLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ25GLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUN2QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztTQUNsQztRQUVELElBQUksa0JBQW1CLENBQUMsZUFBZSxFQUFFO1lBQ3ZDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzNCO1FBRUQsTUFBTSxRQUFRLEdBQW9CLGtCQUFtQixDQUFDLGNBQWUsQ0FBQztR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VSxDQUFDLGlCQUFrQixDQUFDLGFBQWEsQ0FDdkUsQ0FBQzthQUNIO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sSUFBSSxHQUFHLElBQUk7Z0JBQ2hCLENBQUMsQ0FBQyxVQUFVLENBQUMsaUJBQWtCLENBQUMsYUFBYSxHQUFHLENBQUM7Z0JBQ2pELENBQUMsQ0FBQyxVQUFVLENBQUMsaUJBQWtCLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3REO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyx5QkFBeUI7UUFDOUIsTUFBTSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wYXJhdG9yIH0gZnJvbSAnLi9jb21wYXJhdG9yJztcbmltcG9ydCB7IElTb3J0T3B0aW9ucyB9IGZyb20gJy4vLi4vZmlsdGVyLWFuZC1zb3J0Lm1vZHVsZSc7XG5cbmV4cG9ydCBjbGFzcyBTb3J0Q29tcGFyYXRvciBleHRlbmRzIENvbXBhcmF0b3Ige1xuICBzdGF0aWMgREFURSh2YWx1ZUE6IGFueSwgdmFsdWVCOiBhbnkpOiBudW1iZXIge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0U29ydFZhbHVlc0Zyb21Qcm9wZXJ0eUlkZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZUEsXG4gICAgICAgIHZhbHVlQlxuICAgICAgKTtcbiAgICBsZXQgdmFyQSA9IHZhbHVlc1swXTtcbiAgICBsZXQgdmFyQiA9IHZhbHVlc1sxXTtcblxuICAgIGNvbnN0IGN1cnJlbnRTb3J0T3B0aW9uczogSVNvcnRPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudFNvcnRPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50U29ydE9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vU29ydE9wdGlvbnNFcnJvcigpO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50U29ydE9wdGlvbnMhLmlnbm9yZVRpbWVPZkRheSkge1xuICAgICAgdmFyQSA9IG5ldyBEYXRlKHZhckEpO1xuICAgICAgdmFyQiA9IG5ldyBEYXRlKHZhckIpO1xuICAgICAgdmFyQS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIHZhckIuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kaWZpZXI6IEZ1bmN0aW9uIHwgbnVsbCA9IGN1cnJlbnRTb3J0T3B0aW9ucyEudmFyaWFibGVNYXBwZXIhO1xuICAgIGlmIChtb2RpZmllciAhPT0gbnVsbCAmJiBtb2RpZmllciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXJBID0gbW9kaWZpZXIuYXBwbHkobnVsbCwgW3ZhckFdKTtcbiAgICAgIHZhckIgPSBtb2RpZmllci5hcHBseShudWxsLCBbdmFyQl0pO1xuICAgIH1cblxuICAgIGlmICh2YXJBID09PSB2YXJCKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLnNvcnREaXJlY3Rpb24gPT09IDFcbiAgICAgID8gdmFyQSAtIHZhckJcbiAgICAgIDogdmFyQiAtIHZhckE7XG4gIH1cblxuICBzdGF0aWMgTlVNRVJJQyh2YWx1ZUE6IGFueSwgdmFsdWVCOiBhbnkpOiBudW1iZXIge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0U29ydFZhbHVlc0Zyb21Qcm9wZXJ0eUlkZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZUEsXG4gICAgICAgIHZhbHVlQlxuICAgICAgKTtcbiAgICBsZXQgdmFyQSA9IHZhbHVlc1swXTtcbiAgICBsZXQgdmFyQiA9IHZhbHVlc1sxXTtcblxuICAgIGNvbnN0IGN1cnJlbnRTb3J0T3B0aW9uczogSVNvcnRPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudFNvcnRPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50U29ydE9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vU29ydE9wdGlvbnNFcnJvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGlmaWVyOiBGdW5jdGlvbiB8IG51bGwgPSBjdXJyZW50U29ydE9wdGlvbnMhLnZhcmlhYmxlTWFwcGVyITtcbiAgICBpZiAobW9kaWZpZXIgIT09IG51bGwgJiYgbW9kaWZpZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyQSA9IG1vZGlmaWVyLmFwcGx5KG51bGwsIFt2YXJBXSk7XG4gICAgICB2YXJCID0gbW9kaWZpZXIuYXBwbHkobnVsbCwgW3ZhckJdKTtcbiAgICB9XG5cbiAgICBpZiAodmFyQSA9PT0gdmFyQikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB2YXJBID4gdmFyQlxuICAgICAgPyAxICogQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuc29ydERpcmVjdGlvblxuICAgICAgOiAtMSAqIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLnNvcnREaXJlY3Rpb247XG4gIH1cblxuICBzdGF0aWMgQk9PTEVBTih2YWx1ZUE6IGFueSwgdmFsdWVCOiBhbnkpOiBudW1iZXIge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0U29ydFZhbHVlc0Zyb21Qcm9wZXJ0eUlkZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZUEsXG4gICAgICAgIHZhbHVlQlxuICAgICAgKTtcbiAgICBsZXQgdmFyQSA9IHZhbHVlc1swXTtcbiAgICBsZXQgdmFyQiA9IHZhbHVlc1sxXTtcblxuICAgIGNvbnN0IGN1cnJlbnRTb3J0T3B0aW9uczogSVNvcnRPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudFNvcnRPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50U29ydE9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vU29ydE9wdGlvbnNFcnJvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGlmaWVyOiBGdW5jdGlvbiB8IG51bGwgPSBjdXJyZW50U29ydE9wdGlvbnMhLnZhcmlhYmxlTWFwcGVyITtcbiAgICBpZiAobW9kaWZpZXIgIT09IG51bGwgJiYgbW9kaWZpZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyQSA9IG1vZGlmaWVyLmFwcGx5KG51bGwsIFt2YXJBXSk7XG4gICAgICB2YXJCID0gbW9kaWZpZXIuYXBwbHkobnVsbCwgW3ZhckJdKTtcbiAgICB9XG5cbiAgICBpZiAodmFyQSA9PT0gdmFyQikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5zb3J0RGlyZWN0aW9uID09PSAxXG4gICAgICA/IHZhckEgLSB2YXJCXG4gICAgICA6IHZhckIgLSB2YXJBO1xuICB9XG5cbiAgc3RhdGljIFRSVVRIWSh2YWx1ZUE6IGFueSwgdmFsdWVCOiBhbnkpOiBudW1iZXIge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0U29ydFZhbHVlc0Zyb21Qcm9wZXJ0eUlkZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZUEsXG4gICAgICAgIHZhbHVlQlxuICAgICAgKTtcbiAgICBsZXQgdmFyQSA9IHZhbHVlc1swXTtcbiAgICBsZXQgdmFyQiA9IHZhbHVlc1sxXTtcblxuICAgIGNvbnN0IGN1cnJlbnRTb3J0T3B0aW9uczogSVNvcnRPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudFNvcnRPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50U29ydE9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vU29ydE9wdGlvbnNFcnJvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGlmaWVyOiBGdW5jdGlvbiB8IG51bGwgPSBjdXJyZW50U29ydE9wdGlvbnMhLnZhcmlhYmxlTWFwcGVyITtcbiAgICBpZiAobW9kaWZpZXIgIT09IG51bGwgJiYgbW9kaWZpZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyQSA9IG1vZGlmaWVyLmFwcGx5KG51bGwsIFt2YXJBXSk7XG4gICAgICB2YXJCID0gbW9kaWZpZXIuYXBwbHkobnVsbCwgW3ZhckJdKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YXJBSXNGYWxzeTogbnVtYmVyID0gdmFyQSA/IDEgOiAwO1xuICAgIGNvbnN0IHZhckJJc0ZhbHN5OiBudW1iZXIgPSB2YXJCID8gMSA6IDA7XG5cbiAgICBpZiAodmFyQUlzRmFsc3kgPT09IHZhckJJc0ZhbHN5KSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLnNvcnREaXJlY3Rpb24gPT09IDFcbiAgICAgID8gdmFyQUlzRmFsc3kgLSB2YXJCSXNGYWxzeVxuICAgICAgOiB2YXJCSXNGYWxzeSAtIHZhckFJc0ZhbHN5O1xuICB9XG5cbiAgc3RhdGljIEFMUEhBQkVUSUNBTCh2YWx1ZUE6IGFueSwgdmFsdWVCOiBhbnkpOiBudW1iZXIge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPVxuICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuZ2V0U29ydFZhbHVlc0Zyb21Qcm9wZXJ0eUlkZW50aWZpZXJzKFxuICAgICAgICB2YWx1ZUEsXG4gICAgICAgIHZhbHVlQlxuICAgICAgKTtcbiAgICBsZXQgdmFyQSA9IHZhbHVlc1swXTtcbiAgICBsZXQgdmFyQiA9IHZhbHVlc1sxXTtcblxuICAgIGNvbnN0IGN1cnJlbnRTb3J0T3B0aW9uczogSVNvcnRPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZ2V0Q3VycmVudFNvcnRPcHRpb25zKCk7XG4gICAgaWYgKCFjdXJyZW50U29ydE9wdGlvbnMpIHtcbiAgICAgIHRoaXMudHJpZ2dlck5vU29ydE9wdGlvbnNFcnJvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGlmaWVyOiBGdW5jdGlvbiB8IG51bGwgPSBjdXJyZW50U29ydE9wdGlvbnMhLnZhcmlhYmxlTWFwcGVyITtcbiAgICBpZiAobW9kaWZpZXIgIT09IG51bGwgJiYgbW9kaWZpZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyQSA9IG1vZGlmaWVyLmFwcGx5KG51bGwsIFt2YXJBXSk7XG4gICAgICB2YXJCID0gbW9kaWZpZXIuYXBwbHkobnVsbCwgW3ZhckJdKTtcbiAgICB9XG5cbiAgICBpZiAoQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuaWdub3JlQ2FzZSkge1xuICAgICAgaWYgKFxuICAgICAgICAodHlwZW9mIHZhckEgPT09ICdzdHJpbmcnIHx8IHZhckEgaW5zdGFuY2VvZiBTdHJpbmcpICYmXG4gICAgICAgICh0eXBlb2YgdmFyQiA9PT0gJ3N0cmluZycgfHwgdmFyQiBpbnN0YW5jZW9mIFN0cmluZylcbiAgICAgICkge1xuICAgICAgICB2YXJBID0gdmFyQS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB2YXJCID0gdmFyQi50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhckEgPSB2YXJBLnRvU3RyaW5nKCk7XG4gICAgdmFyQiA9IHZhckIudG9TdHJpbmcoKTtcblxuICAgIGlmICh2YXJBID09IHZhckIgfHwgIUNvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmN1cnJlbnRTb3J0T3B0aW9ucykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmIChDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5jdXJyZW50U29ydE9wdGlvbnMudXNlTG9jYWxlQ29tcGFyZSkge1xuICAgICAgaWYgKFxuICAgICAgICBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5jdXJyZW50U29ydE9wdGlvbnMubG9jYWxlQ29tcGFyZU9wdGlvbnNcbiAgICAgICkge1xuICAgICAgICBjb25zdCBsb2NhbGVzOiBzdHJpbmcgfCBzdHJpbmdbXSA9XG4gICAgICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuY3VycmVudFNvcnRPcHRpb25zXG4gICAgICAgICAgICAubG9jYWxlQ29tcGFyZU9wdGlvbnNbMF07XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEludGwuQ29sbGF0b3JPcHRpb25zIHwgbnVsbCA9IENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLmN1cnJlbnRTb3J0T3B0aW9ucy5sb2NhbGVDb21wYXJlT3B0aW9ucy5sZW5ndGggPiAxID8gQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuY3VycmVudFNvcnRPcHRpb25zLmxvY2FsZUNvbXBhcmVPcHRpb25zWzFdIGFzIEludGwuQ29sbGF0b3JPcHRpb25zIDogbnVsbDtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdmFyQS5sb2NhbGVDb21wYXJlKHZhckIsIGxvY2FsZXMsIG9wdGlvbnMpICpcbiAgICAgICAgICAgIENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLnNvcnREaXJlY3Rpb25cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YXJBLmxvY2FsZUNvbXBhcmUodmFyQiwgbG9jYWxlcykgKlxuICAgICAgICAgICAgQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuc29ydERpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB2YXJBLmxvY2FsZUNvbXBhcmUodmFyQikgKiBDb21wYXJhdG9yLmZpbHRlclNvcnRTZXJ2aWNlIS5zb3J0RGlyZWN0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YXJBID4gdmFyQlxuICAgICAgICA/IENvbXBhcmF0b3IuZmlsdGVyU29ydFNlcnZpY2UhLnNvcnREaXJlY3Rpb24gKiAxXG4gICAgICAgIDogQ29tcGFyYXRvci5maWx0ZXJTb3J0U2VydmljZSEuc29ydERpcmVjdGlvbiAqIC0xO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0cmlnZ2VyTm9Tb3J0T3B0aW9uc0Vycm9yKCkge1xuICAgIHRocm93IEVycm9yKGBQbGVhc2Ugc3VwcGx5IGEgU29ydE9wdGlvbnMgb2JqZWN0IHRvIHNvcnQgeW91ciBhcnJheSBieS5gKTtcbiAgfVxufVxuIl19