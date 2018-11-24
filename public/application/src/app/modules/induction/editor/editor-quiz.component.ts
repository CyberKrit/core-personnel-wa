import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// custom imports
import { FormService } from '../../../shared/service/form.service';
import { InductionService } from '../induction.service';
import { CoreService } from '../../core/core.service';
import { IEditorQuizFormData, IGenEditorPostAction, ICompareQuiz } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'editor-quiz',
	template: `
		<form 
			novalidate autocomplete="false" 
			[formGroup]="sectionEditorForm">
			<div class="_editor-section_">
				<div class="control-wrapper">
					<label for="sectionTitle">Your Question</label>
					<input type="text" id="sectionTitle" formControlName="question">
					<ul class="err-list" *ngIf="sectionEditorForm.get('question').touched">
						<li 
							class="err-item"
							*ngIf="sectionEditorForm.get('question').errors?.required">
							This field is required
						</li>
					</ul>
				</div>
			</div>
		</form>

		<div class="control-wrapper control-wrapper-quiz-answers">
			<label for="addOption">Possible answers</label>
			<div class="display-option-ctrls">
				<div class="display-option-ctrl" *ngFor="let option of quizOptions, let i = index">
					<button type="button" 
						(click)="validOption(i)" 
						class="btn-select btn-select-{{ option.isTrue }}">
					</button>
					<button 
						class="btn-remove" 
						mat-icon-button 
						matTooltip="Remove"
						matTooltipPosition="above">
				    <mat-icon aria-label="Clone Slide"
				    (click)="removeOption(i)">delete_forever</mat-icon>
				  </button>
					{{ option.option }}
				</div>
			</div>
			<div class="entry-an-option">
				<input type="text" id="addOption" [(ngModel)]="listenOption" #inputOption (ngModelChange)="optionHasChanged(inputOption.value)">
				<ul class="err-list">
					<li class="err-item" *ngIf="errEmpty">
						Please enter an option first
					</li>
					<li class="err-item" *ngIf="errRepeat">
						This option is already in use
					</li>
				</ul>
				<div class="file-upload-wrapper-ctrl">
					<button class="btn-outline" type="button" (click)="addOptions(inputOption)">Add an Option</button>
				</div>
			</div>
		</div>
	`,
	styleUrls: ['./editor.component.scss']
})
export class EditorQuizComponent implements OnInit, OnChanges, OnDestroy {
	// get data from parent
	@Input() public action: string;
	@Input() public slide: any;
	@Input() public slideName: string;
	@Input() public inductionId: string;
	@Input() public templateId: string;
	@Input() public saveAs: boolean;
	@Output() public detectChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public formData: EventEmitter<Observable<any>> = new EventEmitter<Observable<any>>();

	// form
	public sectionEditorForm: FormGroup;
	public question: string | null = null;
	public subFormSubmit: Subscription;
	public subFormSubmitSuccess: Subscription;
	private formValueChanges: Subscription;

	// compare values
	private previousValueSet: ICompareQuiz = {};
	private currentValueSet: ICompareQuiz = {};

	// quiz
	public listenOption: string | null = null;
	public quizOptions: Array<{ option: string, isTrue: boolean }> = [];
	public errRepeat: boolean = false;
	public errEmpty: boolean = false;

	constructor(
		private fb: FormBuilder,
		private $induction: InductionService,
		private $core: CoreService,
		private $form: FormService) {}

	public ngOnInit(): void {
		this.detectChange.emit(false);

		// define value for formControl
		if( this.slide ) {
			if( 'name' in this.slide ) 
				this.question = this.slide.quiz.question;
				this.slide.quiz.options.map(({ option, isTrue }) => {
					this.quizOptions.push({ option, isTrue });
				});
				this.previousValueSet['name'] = this.slideName;
				this.previousValueSet['question'] = this.slide.quiz.question;
				this.previousValueSet['option'] = this.quizOptions;
				this.previousValueSet['status'] = this.saveAs ? 'publish' : 'draft';
		}

		// configure form
		this.sectionEditorForm = this.fb.group({
			question: [this.question, [Validators.required]]
		});

		// track changes
		this.formValueChanges = this.sectionEditorForm.valueChanges
			.subscribe(
				(res: { question: string }) => {
					this.currentValueSet['question'] = res.question;
					this.detectChange.emit(true);
				}
			);

		// fetch form data to parent component for intended action
		this.subFormSubmit = this.$induction.editorFormSubmitReq$
			.subscribe(() => this.sectionEditorFormSubmit(this.sectionEditorForm));

		// after submit enable form
		this.subFormSubmitSuccess = this.$induction.editorFormSubmitComplete$
			.subscribe(() => {
				this.sectionEditorForm.enable();
				this.detectChange.emit(false);
			});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if( changes.hasOwnProperty('slideName') ) {
			this.currentValueSet['name'] = changes.slideName.currentValue;
			this.detectChange.emit(true);
		}

		if( changes.hasOwnProperty('saveAs') ) {
			this.currentValueSet['status'] = changes.saveAs.currentValue ? 'publish' : 'draft';
			this.detectChange.emit(true);
		}
	}

	public optionHasChanged(value): void {
		this.errRepeat = false;
		this.errEmpty = false;
	}

	public addOptions(input): void {
		if( !input.value ) {
			this.errEmpty = true;
			return;
		}

		let checkAvability: Array<any>;
		checkAvability = this.quizOptions.filter(item => item.option === input.value);

		if( checkAvability.length ) {
			this.errRepeat = true;
			return;
		}

		this.quizOptions.push({ 
			option: input.value,
			isTrue: false 
		});

		input.value = null;

		this.currentValueSet['option'] = this.quizOptions;
		this.detectChange.emit(true);
	}

	public validOption(index): void {
		if( typeof index !== 'number' ) return;

		this.quizOptions.map((item, getIndex) => {
			if( getIndex !==  index) {
				this.quizOptions[getIndex].isTrue = false;
			}
		});

		this.quizOptions[index].isTrue = true;
		this.currentValueSet['option'] = this.quizOptions;
		this.detectChange.emit(true);
	}

	public removeOption(index): void {
		if( typeof index !== 'number' ) return;

		this.quizOptions.splice(index, 1);
		this.currentValueSet['option'] = this.quizOptions;
		this.detectChange.emit(true);
	}

	public sectionEditorFormSubmit({ value, valid }: { value: any, valid: boolean }) {
		if( valid && this.quizOptions ) {
			let filteredValue = this.$form.whiteSpaceControl(value);
			this.sectionEditorForm.disable();
			filteredValue['name'] = this.slideName;
			filteredValue['template'] = this.templateId;
			filteredValue['status'] = this.saveAs ? 'publish' : 'draft';
			filteredValue['quiz'] = {
				question: filteredValue.question,
				options: this.quizOptions,
				control: 'reveal'
			};

			this.formData.emit(this.emitEvent(filteredValue));
		} else {
			this.sectionEditorForm.enable();
			this.sectionEditorForm.get('question').markAsTouched();
		}
	}

	private emitEvent(value: IEditorQuizFormData): Observable<IGenEditorPostAction> {
		let slideId:string = '';
		try {
			slideId = this.slide._id;
		} catch (err) {}
		return this.$induction.editorQuiz(value, this.inductionId, slideId);
	}

	ngOnDestroy(): void {
		this.subFormSubmit.unsubscribe();
		this.subFormSubmitSuccess.unsubscribe();
		this.formValueChanges.unsubscribe();
	}

}