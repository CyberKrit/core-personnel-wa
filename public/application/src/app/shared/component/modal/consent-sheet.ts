import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// custom import
import { IConsentSheetData } from '../../interface/induction.interface';
import { CoreService } from '../../../modules/core/core.service';
import { InductionService } from '../../../modules/induction/induction.service';

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
export class ConsentSheet {
	private isRemoveLazy: boolean = false;

	constructor(
		private dialogRef: MatDialogRef<ConsentSheet>,
		@Inject(MAT_DIALOG_DATA) public data: IConsentSheetData,
		private router: Router,
		private $core: CoreService,
		private $induction: InductionService) {}

  public confirm() {
  	if( this.isRemoveLazy ) return;

  	this.isRemoveLazy = true;
  	this.$core.enableProgressbar();
  	if( this.data.confirm.fn ) {
	  	this.data.confirm.fn()
	  		.subscribe(
	  			( res: Response ) => {
	  				if( this.data.confirm.willClose ) {
	  					this.$core.removeProgressbar();
		  				this.dialogRef.close('confirm');

		  				if( this.data.confirm.navigate ) {
		  					this.router.navigate([this.data.confirm.navigate]);
		  				}
	  				} else {
	  					if( this.data.confirm.navigate ) {
		  					this.router.navigate([this.data.confirm.navigate], {
		  						queryParams: {
		  							reload: true,
		  							dialogRes: 'confirm'
		  						}
		  					});
		  				}
	  				}
	  			},
	  			catchError => {
  					this.$core.removeProgressbar();
	  				this.dialogRef.close('confirm');
	  			}
	  		);
  	} else {
  		this.dialogRef.close('confirm');
  	}
  }

  public cancel() {
  	if( this.isRemoveLazy ) return;

  	this.isRemoveLazy = true;
  	if( this.data.cancel.fn ) {
	  	this.data.cancel.fn()
	  		.subscribe(
	  			( res: Response ) => {
	  				if( this.data.cancel.willClose ) {
	  					this.dialogRef.close('cancel');

		  				if( this.data.cancel.navigate ) {
		  					this.router.navigate([this.data.cancel.navigate]);
		  				}
	  				} else {
	  					if( this.data.cancel.navigate ) {
		  					this.router.navigate([this.data.confirm.navigate], {
		  						queryParams: {
		  							reload: true,
		  							dialogRes: 'cancel'
		  						}
		  					});
		  				}
	  				}
	  			},
	  			catchError => {
	  				this.dialogRef.close('cancel');
	  			}
	  		);
  	} else {
  		this.dialogRef.close('cancel');
  	}
  }

}