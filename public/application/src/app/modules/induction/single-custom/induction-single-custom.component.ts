import { Component, Input, OnInit } from '@angular/core';

// custom imports
import { ITemplateList } from '../../../shared/interface/induction.interface';

// editor
import { EditorSectionComponent } from '../editor/editor-section.component';
import { IInductionSingleResolve } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'induction-single-custom',
	templateUrl: './induction-single-custom.component.html',
	styleUrls: ['./induction-single-custom.component.scss']
})
export class InductionSingleCustomComponent implements OnInit {
	@Input() public templateData: ITemplateList;
	@Input() public inductionData: IInductionSingleResolve;
	@Input() public slideTitle: string;

	private currentTempSlug: any;

	ngOnInit() {
		this.currentTempSlug = this.templateData.slug;
	}
	
}