import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

// custom import
import { CoreService } from '../../core/core.service';
import { ICategoryBrief } from '../../../shared/interface/induction.interface';

@Component({
	templateUrl: './induction-create.component.html',
	styleUrls: ['./induction-create.component.scss']
})
export class InductionCreateComponent implements OnInit {
	public isPreloaded: boolean = false;
	private inductionCreateForm: FormGroup;
	private getCategories: ICategoryBrief[];

	constructor(
		private coreService: CoreService,
		private route: ActivatedRoute,
		private fb: FormBuilder) {}

	ngOnInit() {
		this.route.data
			.subscribe((res: Data) => {
				// hide progressbar
				this.coreService.removeProgressbar();
				// make view visible
				this.isPreloaded = true;
				this.getCategories = res.categories;
				console.log(res.categories);
			});

		this.inductionCreateForm = this.fb.group({
			'inductionName': [null, [ Validators.required, this.inductionTitleFormat ]],
			'inductionCat': [null, [Validators.required]]
		});
	}

	private createInductionFormSubmit(form: FormGroup) {
		console.log(form);
	}

	private inductionTitleFormat(control: FormControl): { [key: string]: boolean } | null {
		if(!control.value) return null;

		if (control.value.match(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/)) {
      return null;
    } else {
      return { 'invalidTitlePattern': true };
    }
	}

}