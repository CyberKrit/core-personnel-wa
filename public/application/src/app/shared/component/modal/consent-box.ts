import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { catchError } from 'rxjs/operators';

// custom import
import { InductionService } from '../../../modules/induction/induction.service';

@Component({
	template: `
		<h2 class="modal-title">{{ data.title }}</h2>
		<div class="modal-button-group">
			<button class="_btn-confirm_" (click)="confirm(confirmButton)" #confirmButton [disabled]="!enableCancelButton" cdkFocusInitial>
				<span class="button-text">Confirm</span>
				<span class="button-lazy">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="animation-play-state:running;animation-delay:0s;background:0 0"><circle cx="50" cy="50" fill="none" stroke-linecap="round" r="40" stroke-width="8" stroke="#fff" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(288.79 50 50)" style="animation-play-state:running;animation-delay:0s"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></circle></svg>
				</span>
			</button>
			<button class="_btn-cancel_" (click)="exit()" *ngIf="enableCancelButton">Cancel</button>
		<div>
		`
})

export class ConsentBox {
	public enableCancelButton: boolean = true;

	constructor(
		public matDialogRef: MatDialogRef<ConsentBox>,
		@Inject(MAT_DIALOG_DATA) public data: { id: string, title: string },
		private inductionService: InductionService) {
			matDialogRef.disableClose = true;
	}

	public confirm(confirmButton) {
		this.enableCancelButton = false;
		confirmButton.classList.add('_lazy_');
		this.inductionService.removeCategory(this.data.id)
			.subscribe(res => {
				this.matDialogRef.close(this.data.id);
			});
	}
	public exit() {
		this.matDialogRef.close(null);
	}

}