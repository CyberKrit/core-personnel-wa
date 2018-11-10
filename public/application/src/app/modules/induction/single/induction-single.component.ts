import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

// custom import
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';
import { IEditInductionResolve, ISingleQueryParams, ITemplateList } from '../../../shared/interface/induction.interface';

@Component({
	templateUrl: './induction-single.component.html',
	styleUrls: ['./induction-single.component.scss']
})
export class inductionSingleComponent implements OnInit {
	public isPreloaded: boolean = false;
	private routeData: any;
	private queryParams: ISingleQueryParams;
	private inductionId: string;

	// template
	private templateCollection: ITemplateList[];
	private showTemplateCollection: boolean = false;
	private selectedTemplateData: ITemplateList;

	// component title
	private slideTitle: string = 'Image Only';
	
	constructor(
		private route: ActivatedRoute,
		private coreService: CoreService,
		private inductionService: InductionService) {}

	ngOnInit() {
		let { index, slideType } = this.route.snapshot.queryParams;

		this.queryParams = { index: parseInt(index), slideType };
		this.inductionId = this.route.snapshot.url.pop().path;

		if( this.queryParams.slideType === 'custom' ) {
			this.inductionService.customSlideRouteData(this.inductionId, index)
				.subscribe(
					(data: any) => {
						this.templateCollection = data[0];
						this.isPreloaded = true;
						this.coreService.removeProgressbar();
					}
				);
		}

	} //ngOnInit

	private pickTemplate(): void {
		this.showTemplateCollection = true;
	}

	// backto edit view without selecting a template
	private goBack(): void {
		this.showTemplateCollection = false;
	}

	// pass data to the child custom slide component
	private selectedTemplate(template): void {
		this.showTemplateCollection = false;
		this.selectedTemplateData = template;
		this.slideTitle = template.name;
	}

}