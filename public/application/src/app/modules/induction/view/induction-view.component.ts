import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

// custom import
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';
import { ISingleInductionViewData } from '../../../shared/interface/induction.interface';

@Component({
	templateUrl: './induction-view.component.html',
	styleUrls: ['./induction-view.component.scss']
})
export class InductionViewComponent implements OnInit {
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