import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

// custom import
import { CoreService } from '../../core/core.service';
import { IEditInductionResolve } from '../../../shared/interface/induction.interface';

@Component({
	templateUrl: './induction-edit.component.html',
	styleUrls: ['./induction-edit.component.scss']
})
export class InductionEditComponent implements OnInit {
	public isPreloaded: boolean = false;
	private editResolveData: IEditInductionResolve;

	constructor(
		private route: ActivatedRoute,
		private coreService: CoreService) {}

	ngOnInit() {
		this.route.data
			.subscribe(
				(data: Data) => {
					console.log(data.editData);
					this.editResolveData = data.editData;
					this.coreService.removeProgressbar();
					this.isPreloaded = true;
				}
			);
	}

}