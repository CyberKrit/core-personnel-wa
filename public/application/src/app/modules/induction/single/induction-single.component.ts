import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

// custom import
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';
import { IEditInductionResolve, ISingleQueryParams, ITemplateList, IInductionSingleResolve } from '../../../shared/interface/induction.interface';

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
	private defaultTemplateNameList: string[] = [''];

	// component title
	private slideTitle: string = 'Image Only';

	// inductionData
	private inductionData: IInductionSingleResolve; 
	
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private coreService: CoreService,
		private inductionService: InductionService) {}

	ngOnInit() {
		let { index, slideType } = this.route.snapshot.queryParams;

		this.queryParams = { index: parseInt(index), slideType };
		this.inductionId = this.route.snapshot.url.pop().path;

		this.route.data
			.subscribe(
				(res: Data) => {
					this.inductionData = res.singleData;
					this.selectedTemplateData = this.inductionData.defaultTemplate;
					
					// cache data to temp state which will be in use in editor
					this.inductionService.singleTempData.header = this.inductionData.slide.header;
					this.inductionService.singleTempData.content = this.inductionData.slide.content;
					this.inductionService.singleTempData.status = this.inductionData.slide.status;

					try {
						this.slideTitle = this.inductionData.slide.name || '';
					} catch (err) {
						this.router.navigate(['/induction']);
					}
				});

		if( this.queryParams.slideType === 'custom' ) {
			this.inductionService.customSlideRouteData(this.inductionId, index)
				.subscribe(
					(data: any) => {
						this.templateCollection = data[0];
						this.isPreloaded = true;
						this.coreService.removeProgressbar();

						this.templateCollection.map(({ name, byDefault }) => {
							this.defaultTemplateNameList.push(name.toLowerCase());

							if( byDefault === true ) {
								try {
									this.slideTitle = this.inductionData.slide.name || name || '';
								} catch (err) {}
							}
						});
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

		if( this.defaultTemplateNameList.indexOf(this.slideTitle.toLowerCase()) >= 0 ) {
			this.slideTitle = template.name;
		}
	}

}