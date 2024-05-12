import { TemplateRef } from '@angular/core';
import { TemplateRefContext } from './template-ref-context';
import { SortOptions } from '@transunion-ui/tablejs';

export interface IColumnConfig {
  id?: string;
  name: string;
  dataClass: string;
  width: string;
  resizable?: boolean;
  reorderable?: boolean;
  sortOptions?: SortOptions;
  tableHeaderTemplateRef?: TemplateRef<any>;
  tableHeaderContext?: TemplateRefContext;
  tableDataTemplateRef?: TemplateRef<any>;
  tableDataContext?: TemplateRefContext;
}
