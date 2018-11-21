import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

// import services
import { InductionService } from '../induction.service';

// import interface
import { IQuizCreateReq, IQuizCreateRes } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'editor-quiz',
	template: `
		<form [formGroup]="quizForm" (ngSubmit)="quizFormSubmit(quizForm)" novalidate autocomplete="false">Quiz
			<button type="submit">Save</button>
		</form>
	`,
	styleUrls: ['./editor.component.scss']
})
export class EditorQuizComponent implements OnInit {
	// form
	public quizForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private $induction: InductionService) {}

	public ngOnInit(): void {
		this.quizForm = this.fb.group({});
	}

	public quizFormSubmit({ value, valid }: { value: any, valid: boolean }) {
		this.$induction.saveQuiz(value)
			.subscribe(
				(res: IQuizCreateRes) => {}
			);
	}

}