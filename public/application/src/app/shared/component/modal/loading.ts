import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { catchError } from 'rxjs/operators';

// custom import
import { CoreService } from '../../../modules/core/core.service';

@Component({
	template: `
		<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="animation-play-state:running;animation-delay:0s;background:0 0"><circle cx="50" cy="50" fill="none" stroke-linecap="round" r="40" stroke-width="8" stroke="#ed1c24" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(288.79 50 50)" style="animation-play-state:running;animation-delay:0s"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></circle></svg>
		`
})

export class FullScreenLoading {

	constructor(
		private $core: CoreService,
		public matDialogRef: MatDialogRef<FullScreenLoading>,
		@Inject(MAT_DIALOG_DATA) public data) {
			matDialogRef.disableClose = true;
			this.$core.enableProgressbar();
	}

	ngOnInit() {
		this.data.fn()
			.subscribe(
				(res: any) => {
					this.$core.fullScreenLoadingSubFn();
				},
				catchError => {
					this.$core.removeProgressbar();
					this.matDialogRef.close(null);
				}
			);
	}

	public exit() {
	}

}