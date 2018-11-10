import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

// custom import
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';
import { IEditInductionResolve, IGETCreateSlide } from '../../../shared/interface/induction.interface';

@Component({
	templateUrl: './induction-edit.component.html',
	styleUrls: ['./induction-edit.component.scss']
})
export class InductionEditComponent implements OnInit {
	public isPreloaded: boolean = false;
	private routeData: IEditInductionResolve;
	private rippleColorCustom: string = 'rgba(237, 28, 36, .05)';
	private rippleColorImport: string = 'rgba(7, 135, 208, .05)';
	private rippleColorQuiz: string = 'rgba(0, 200, 83, .05)';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private coreService: CoreService,
		private inductionService: InductionService) {}

	ngOnInit() {
		this.route.data
			.subscribe(
				(data: Data) => {
					this.routeData = data.editData;
					this.coreService.removeProgressbar();
					this.isPreloaded = true;
				}
			);
	}

	private customSlide(slideType: string): void {
		this.coreService.enableProgressbar();
		this.inductionService.createSlide(this.routeData._id)
			.subscribe(
				( data: IGETCreateSlide ) => {
					if(!data.status) return;
					
					let { slideIndex } = data;
					this.router.navigate(['/induction/single/' + data.slideDeckId], { queryParams: { index: slideIndex, slideType  } });
				}
			);
	}

}