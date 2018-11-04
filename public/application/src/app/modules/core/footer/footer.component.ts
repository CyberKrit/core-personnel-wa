import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

// custom import
import { CoreService } from '../core.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

	constructor(
		public snackBar: MatSnackBar,
		private coreService: CoreService) {}

	ngOnInit() {

		this.coreService.ripple$
			.subscribe(
				data => {
					if( data.message.client ) {
				    this.snackBar.open(data.message.client, 'Close', {
				      duration: 3000,
				      panelClass: 'ripple-' + data.type
				    });
					}
				}
			);

	} // ngOnInit

}