import { Component, ViewEncapsulation } from '@angular/core';
export class ReorderGripComponent {
    constructor() { }
}
ReorderGripComponent.decorators = [
    { type: Component, args: [{
                selector: 'tablejs-reorder-grip',
                template: "<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>",
                host: { class: 'col-dots-container' },
                encapsulation: ViewEncapsulation.None,
                styles: ["@charset \"UTF-8\";.col-dots-container{cursor:move;cursor:grab;position:absolute;display:block;left:0px;top:0px;height:100%;width:30px;z-index:5}.col-dots-container .dots-3{display:inline-block;opacity:.5}th:hover .dots-3{display:inline-block;opacity:1}.dots-3{position:relative;top:50%;width:4px;display:inline-block;overflow:hidden;transform:translateY(-50%)}.dots-3:after{content:\"\\2807\";font-size:14px}\n"]
            },] }
];
ReorderGripComponent.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVvcmRlci1ncmlwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9jb21wb25lbnRzL3Jlb3JkZXItZ3JpcC9yZW9yZGVyLWdyaXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFTckUsTUFBTSxPQUFPLG9CQUFvQjtJQUUvQixnQkFBZ0IsQ0FBQzs7O1lBVGxCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQywwSUFBNEM7Z0JBRTVDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtnQkFDckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3RhYmxlanMtcmVvcmRlci1ncmlwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3Jlb3JkZXItZ3JpcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Jlb3JkZXItZ3JpcC5jb21wb25lbnQuc2NzcyddLFxuICBob3N0OiB7IGNsYXNzOiAnY29sLWRvdHMtY29udGFpbmVyJyB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFJlb3JkZXJHcmlwQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG59XG4iXX0=