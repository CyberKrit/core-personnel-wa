import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// custom imports
import { FormService } from '../../../shared/service/form.service';
import { InductionService } from '../induction.service';
import { CoreService } from '../../core/core.service';
import { IEditorTextOnlyFormData, IGenEditorPostAction, ICompareValuesTextOnly } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'editor-text-only',
	template: `
		<form 
			novalidate autocomplete="false" 
			[formGroup]="sectionEditorForm" (ngSubmit)="sectionEditorFormSubmit(sectionEditorForm)">
			<div class="_editor-section_">
				<div class="control-wrapper">
					<label for="sectionTitle">Enter content here</label>
					<textarea type="text" id="sectionTitle" formControlName="content"></textarea>
					<ul class="err-list" *ngIf="sectionEditorForm.get('content').touched">
						<li 
							class="err-item"
							*ngIf="sectionEditorForm.get('content').errors?.required">
							This field is required
						</li>
					</ul>
				</div>
			</div>
		</form>
	`,
	styleUrls: ['./editor.component.scss']
})
export class EditorTextOnlyComponent implements OnInit, OnChanges, OnDestroy {
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
	public content: string | null = null;
	public subFormSubmit: Subscription;
	public subFormSubmitSuccess: Subscription;
	private formValueChanges: Subscription;

	// compare values
	private previousValueSet: ICompareValuesTextOnly = {};
	private currentValueSet: ICompareValuesTextOnly = {};

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
				this.content = this.slide.content;
				this.previousValueSet['name'] = this.slideName;
				this.previousValueSet['content'] = this.slide.content;
				this.previousValueSet['status'] = this.saveAs ? 'publish' : 'draft';
		}

		// configure form
		this.sectionEditorForm = this.fb.group({
			content: [this.content, [Validators.required]]
		});

		// track changes
		this.formValueChanges = this.sectionEditorForm.valueChanges
			.subscribe(
				(res: { content: string }) => {
					this.currentValueSet['content'] = res.content;
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

	public sectionEditorFormSubmit({ value, valid }: { value: any, valid: boolean }) {
		if( valid ) {
			let filteredValue = this.$form.whiteSpaceControl(value);
			this.sectionEditorForm.disable();
			filteredValue['name'] = this.slideName;
			filteredValue['template'] = this.templateId;
			filteredValue['status'] = this.saveAs ? 'publish' : 'draft';
			this.formData.emit(this.emitEvent(filteredValue));
		} else {
			this.sectionEditorForm.enable();
			this.sectionEditorForm.get('content').markAsTouched();
		}
	}

	private emitEvent(value: IEditorTextOnlyFormData): Observable<IGenEditorPostAction> {
		let slideId:string = '';
		try {
			slideId = this.slide._id;
		} catch (err) {}
		return this.$induction.editorTextOnly(value, this.inductionId, slideId);
	}

	ngOnDestroy(): void {
		this.subFormSubmit.unsubscribe();
		this.subFormSubmitSuccess.unsubscribe();
		this.formValueChanges.unsubscribe();
	}

}