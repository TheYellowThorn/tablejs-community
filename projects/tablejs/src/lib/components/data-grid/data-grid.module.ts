import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataGridComponent } from './data-grid.component';
import { TablejsModule } from '@transunion-ui/tablejs';
@NgModule({
    declarations: [
        DataGridComponent
    ],
    exports: [
        DataGridComponent
    ],
    imports: [
        CommonModule,
        TablejsModule
    ],
    providers: []
})
export class DataGridModule {}
