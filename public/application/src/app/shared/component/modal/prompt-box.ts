import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	template: `
		<div mat-dialog-content>
			Are you sure you want to delete this file?
		</div>
		<div mat-dialog-actions>
			<button mat-button (click)="confirm()">Yes</button>
			<button mat-raised-button (click)="exit()">No</button>
		<div mat-dialog-actions>
		`
})

export class PromptBox {

	constructor(
		public matDialogRef: MatDialogRef<PromptBox>,
		@Inject(MAT_DIALOG_DATA) public data: { id: string }) {}

	public confirm() {
		this.matDialogRef.close(this.data.id);
	}
	public exit() {
		this.matDialogRef.close(null);
	}

}