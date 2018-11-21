import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

// interface
import { ITemplateResolveRes, ITemplateResolveResData } from '../../../shared/interface/induction.interface';
import { CoreService } from '../../core/core.service';

@Component({
	selector: 'induction-temp',
	templateUrl: './induction-template.component.html',
	styleUrls: ['./induction-template.component.scss']
})
export class InductionTemplateComponent implements OnInit {
	public isPreloaded: boolean = false;
	private nativeData: ITemplateResolveRes;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private $core: CoreService) {}

	ngOnInit() {
		this.route.data
			.subscribe(
				(resolve: Data) => {
					this.nativeData = resolve.data;
					this.$core.removeProgressbar();
					this.isPreloaded = true;
				}
			);
	}

	private templateSelectFn(template: ITemplateResolveResData): void {
		this.router.navigate(['/induction', 'editor'], {
			queryParams: {
				ind: this.nativeData.inductionId,
				tmp: template._id,
				slide: '',
				action: this.nativeData.action
			}
		});
	}

}