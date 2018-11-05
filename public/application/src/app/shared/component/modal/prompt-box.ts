import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { catchError } from 'rxjs/operators';

// custom import
import { InductionService } from '../../../modules/induction/induction.service';

@Component({
	template: `
		<h2 class="modal-title">{{ data.title }}</h2>
		<div class="modal-input-wrapper">
			<input type="text" value="{{ data.fieldValue }}" #updatedValue cdkFocusInitial>
			<ul class="err-list">
				<li class="err-item" *ngIf="!isInputValid">
					The category name must contain only letters, numbers, and spaces.
				</li>
			</ul>
		</div>
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

export class PromptBox {
	@ViewChild('updatedValue') public updatedValue: ElementRef;
	public enableCancelButton: boolean = true;
	public isInputValid: boolean = true;

	constructor(
		public matDialogRef: MatDialogRef<PromptBox>,
		@Inject(MAT_DIALOG_DATA) public data: { id: string, fieldValue: string, title: string },
		private inductionService: InductionService) {
			matDialogRef.disableClose = true;
	}

	ngOnInit() {
		this.updatedValue.nativeElement.addEventListener('keyup', () => {
			let currentVal = this.updatedValue.nativeElement.value;
			let currentValTest = currentVal.match(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/);
			
			// show error message when field is invalid
			this.isInputValid = currentValTest ? true : false;
		});
	}

	public confirm(confirmButton) {
		let currentVal = this.updatedValue.nativeElement.value;
		let currentValTest = currentVal.match(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/);

		if( currentValTest ) {
			this.enableCancelButton = false;
			confirmButton.classList.add('_lazy_');
			this.inductionService.updateCategory(this.data.id, this.updatedValue.nativeElement.value)
				.subscribe(
					(res) => this.matDialogRef.close(this.updatedValue.nativeElement.value),
					(err) => this.matDialogRef.close()
				);
		} else {
			this.isInputValid = false;
		}
	}

	public exit() {
		this.matDialogRef.close(null);
	}

}