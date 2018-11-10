import { Component, Input, OnInit } from '@angular/core';

// custom imports
import { ITemplateList } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'induction-single-custom',
	templateUrl: './induction-single-custom.component.html',
	styleUrls: ['./induction-single-custom.component.scss']
})
export class InductionSingleCustomComponent implements OnInit {
	@Input() public templateData: ITemplateList;

	ngOnInit() {
		console.log(this.templateData);
	}
	
}