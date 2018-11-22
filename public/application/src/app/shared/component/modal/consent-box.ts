import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// custom import
import { IConsentBoxData } from '../../interface/induction.interface';

@Component({
	template: `
		<mat-nav-list class="_consent-sheet_">
		  <a mat-list-item class="_confirm_" (click)="confirm()" cdkFocusInitial>
		    <span mat-line class="_title_">{{ data.confirm?.title }}</span>
		    <span mat-line class="_desc_" *ngIf="data.confirm?.desc">{{ data.confirm?.desc }}</span>
		  </a>

		  <a mat-list-item class="_cancel_" (click)="cancel()">
		    <span mat-line class="_title_">{{ data.cancel?.title }}</span>
		    <span mat-line class="_desc_" *ngIf="data.cancel?.desc">{{ data.cancel?.desc }}</span>
		  </a>
		</mat-nav-list>
		`
})

export class ConsentBox {
	public enableCancelButton: boolean = true;

	constructor(
		public matDialogRef: MatDialogRef<ConsentBox>,
		@Inject(MAT_DIALOG_DATA) public data: IConsentBoxData) {}

	public confirm() {
		this.matDialogRef.close(true);
	}
	public cancel() {
		this.matDialogRef.close(false);
	}

}