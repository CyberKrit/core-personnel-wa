import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

// custom import
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';
import { ISingleInductionViewData } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'induction-single-view',
	templateUrl: './induction-single-view.component.html',
	styleUrls: ['./induction-single-view.component.scss']
})
export class InductionSingleViewComponent implements OnInit {
	public isPreloaded: boolean = false;
	private inductionSingleData: ISingleInductionViewData;

	constructor(
		private router: ActivatedRoute,
		private inductionService: InductionService,
		private coreService: CoreService) {}

	ngOnInit() {
		this.router.data
			.subscribe(
				(data: Data) => {
					this.inductionSingleData = data.inductionSingle;
					this.coreService.removeProgressbar();
					this.isPreloaded = true;
				}
			);
	}

}