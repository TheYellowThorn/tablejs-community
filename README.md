Tablejs
========


Tablejs is an open-source solution for displaying complex grid content in Angular.   Tablejs provides **high performance** grids supporting millions of rows of content and enables **easy integration** into familiar HTML, CSS, and Javascript concepts.  Look below for an example of a grid with several features enabled.

![Grid Example](https://github.com/transunion-ui/tablejs/blob/master/readmes/grid.png?raw=)

Please visit our [GitHub](https://github.com/transunion-ui/tablejs) for more resources:<br/>
[Demo](https://transunionui.github.io/tablejs/demo/)<br/>
[API Documentation](https://transunionui.github.io/tablejs/api/)<br/>
[Examples](https://transunionui.github.io/tablejs/examples/)


Instructions for using Tablejs.

Grid Features
-------------


1. Infinite scrolling
2. Resizable columns
3. Reorderable columns
4. Nested headers
5. Utilizes standard HTML tables
6. Expandable Rows
7. Linked table resizing
8. Easy resize and reorder event handling
9. Custom filtering
10. Cell editing
11. CSS styling
12. Nested Tables in expandable rows
13. Screen reader compatible
14. Print fidelity


Usage
-----

### How to Install

```
npm install --save @transunion-ui/tablejs
```

### Import Module

```javascript
import { TablejsModule } from '@transunion-ui/tablejs'
```

### Enable grid Functionality

Wrap the `tablejs-grid` component around your table data:

```html
<tablejs-grid>
	<table>
		…
	</table>
</tablejs-grid>
```

Designate the grid’s rows by adding the `tablejsGridRow` directive to the table’s rows (tr):

```html
<tablejs-grid>
	<table>
		<thead>
			<tr tablejsGridRow>
				…
			</tr>
		</thead>
	</table>
</tablejs-grid>
```

### Resize Column Functionality

Designate which elements you would like to use as your resizable grip/handle by adding the `resizableGrip` directive:

```html
<tablejs-grid>
	<table>
		<thead>
			<tr tablejsGridRow>
				<th resizableGrip><div>Header 1</div></th>
					…
				</th>
				<th>
					<div resizableGrip></div>
					<div>Header 2</div>
				</th>
			</tr>
		</thead>
	</table>
</tablejs-grid>
```

*Note: The entire header can be used as a resizable element, but keep in mind that if you would like to enable sorting based on clicking the header, you may want to create an icon inside the header specifically for resize functionality*

The grid relies on tying classes together for resize functionality.  The `tablejsDataColClasses` directive designates which columns a header columns should have width control over.  This would be a th or td tag.  Notice you can include a list of classes for header columns that span multiple columns. See the example below:

`Header 1` below resizes both `Sub Header 1` and `Sub Header 2` columns proportionately.  To tie the table body column cells to the headers, the `tablejsDataColClass` directive is added.  In the example below, `Header 1` resizes columns with `tablejsDataColClass` set to `class1` and `class2`.  `Sub Header 1` only changes the width of the columns containing `class1` and `Sub Header 2` only changes the width of the column containing `class2`.  *For greatly improved perfomance, include an `initialWidth` directive on each column containing the `tablejsDataColClass` directive so that the `tablejsGrid` directive does not need to access the DOM for widths on instantiation.*

```html
<tablejs-grid>
	<table>
		<thead>
			<tr tablejsGridRow>
				<th tablejsDataColClasses="class1, class2" colspan="2" >
					<div resizableGrip></div>
					<div>Header 1</div>
				</th>
			</tr>
			<tr tablejsGridRow>
				<th tablejsDataColClasses="class1">
					<div resizableGrip></div>
					<div>Sub Header 1</div>
				</th>
				<th tablejsDataColClasses="class2">
					<div resizableGrip></div>
					<div>Sub Header 2</div>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr tablejsGridRow>
				<td><div tablejsDataColClass="class1" initialWidth="300">Content in cell 1</div></td>
				<td><div tablejsDataColClass="class2" initialWidth="300">Content in cell 2</div></td>
		</tbody>
	</table>
</tablejs-grid>
```

For proper resizing of the infinite scrolling component, include the `tablejsInfiniteScroll` directive on your `cdk-virtual-scroll-viewport` component:

```html
<cdk-virtual-scroll-viewport class="tall-viewport" tablejsInfiniteScroll autosize>
	…
</cdk-virtual-scroll-viewport>
```

### Reorder Column Functionality

To add column reorderability to a column, add the `reorderCol` directive:

```html
<tablejs-grid>
	<table>
		<thead>
			<tr tablejsGridRow>
				<th reorderCol><div>Header 1</div></th>
					…
				</th>
			</tr>
		</thead>
	</table>
</tablejs-grid>
```

Next, create a handle for the user to pull on in order to reorder the column by adding the `reorderGrip` directive:

```html
<tablejs-grid>
	<table>
		<thead>
			<tr tablejsGridRow>
				<th reorderCol>
					<div reorderGrip></div> 
					<div>Header 1</div>
				</th>
			</tr>
		</thead>
	</table>
</tablejs-grid>
```

A ghost drag and drop object is displayed while dragging to reorder a column.  Sometimes you may not want to show the entire column header object to display.  You can filter out selected elements by passing a filter function via the dragAndDropGhostFilter directive.

```html
<tablejs-grid [dragAndDropGhostFilter]="dragDropFilter">
	<table>
		<thead>
			<tr tablejsGridRow>
				<th reorderCol>
					<div reorderGrip></div> 
					<div>Header 1</div>
				</th>
			</tr>
		</thead>
	</table>
</tablejs-grid>
```

In your component, you would write the `dragDropFilter` function you supplied.  This example filters out all `i tags`.

```javascript
dragDropFilter(el: HTMLElement) {
    return (el.tagName !== 'I');
}
```

#### Disabling selected rows from reordering

The reordering relies on the css grid functionality.  To disable a row from reordering, simply set the `grid-column-start` and `grid-column-end` styles on the `td` or `th` tags.  This is especially useful for expandable and collapsible rows.

```html
<tablejs-grid [dragAndDropGhostFilter]="dragDropFilter">
	<table>
		<tbody>
			<tr tablejsGridRow>
				<td reorderCol style=”grid-column-start: 1; grid-column-end: 11;“>
					…
				</td>
			</tr>
		</tbody>
	</table>
</tablejs-grid>
```