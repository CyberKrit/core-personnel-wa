import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

// custom import
import { ITemplateList } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'induction-temp',
	templateUrl: './induction-template.component.html',
	styleUrls: ['./induction-template.component.scss']
})
export class InductionTemplateComponent implements OnInit {
	@Input() public templateCollection: ITemplateList;
	@Output() public selectedTemplate: EventEmitter<ITemplateList> = new EventEmitter<ITemplateList>();

	constructor() {}

	ngOnInit() {}

	private thisTemplate(template) {
		this.selectedTemplate.emit(template);
	}

}