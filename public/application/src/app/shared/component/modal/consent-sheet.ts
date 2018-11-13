import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	template: `
		<mat-nav-list>
		  <a href="https://keep.google.com/" mat-list-item (click)="openLink($event)">
		    <span mat-line>Yes delect this slide</span>
		    <span mat-line>This action is permanent</span>
		  </a>

		  <a href="https://docs.google.com/" mat-list-item (click)="openLink($event)">
		    <span mat-line>Keep this slide</span>
		  </a>
		</mat-nav-list>
	`
})
export class ConsentSheet {

	constructor(
		private dialogRef: MatDialogRef<ConsentSheet>,
		@Inject(MAT_DIALOG_DATA) public data: any) {console.log(data);}

	openLink(event: MouseEvent): void {
		console.log(event);
    this.dialogRef.close(null);
    event.preventDefault();
  }

}