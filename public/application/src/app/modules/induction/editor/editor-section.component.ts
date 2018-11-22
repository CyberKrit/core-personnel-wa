import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// custom imports
// import { FormService } from '../../../shared/service/form.service';
import { InductionService } from '../induction.service';
import { CoreService } from '../../core/core.service';
import { IEditorSectionFormData, IGenEditorPostAction, ICompareValuesSection } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'editor-section',
	template: `
		<form 
			novalidate autocomplete="false" 
			[formGroup]="sectionEditorForm" (ngSubmit)="sectionEditorFormSubmit(sectionEditorForm)">
			<div class="_editor-section_">
				<div class="control-wrapper">
					<label for="sectionTitle">Section title</label>
					<input type="text" id="sectionTitle" formControlName="header">
					<ul class="err-list" *ngIf="sectionEditorForm.get('header').touched">
						<li 
							class="err-item"
							*ngIf="sectionEditorForm.get('header').errors?.required">
							This field is required
						</li>
					</ul>
				</div>
			</div>
		</form>
	`,
	styleUrls: ['./editor.component.scss']
})
export class EditorSectionComponent implements OnInit, OnChanges, OnDestroy {
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
	public header: string | null;
	public subFormSubmit: Subscription;
	public subFormSubmitSuccess: Subscription;
	private formValueChanges: Subscription;

	// compare values
	private previousValueSet: ICompareValuesSection = {};
	private currentValueSet: ICompareValuesSection = {};

	constructor(
		private fb: FormBuilder,
		private $induction: InductionService,
		private $core: CoreService) {}

	public ngOnInit(): void {
		this.detectChange.emit(false);

		// define value for formControl
		if( this.slide ) {
			if( 'name' in this.slide ) 
				this.header = this.slide.header;
				this.previousValueSet['name'] = this.slideName;
				this.previousValueSet['header'] = this.slide.header;
				this.previousValueSet['status'] = this.saveAs ? 'publish' : 'draft';
		}

		// configure form
		this.sectionEditorForm = this.fb.group({
			header: [this.header, [Validators.required]]
		});

		// track changes
		this.formValueChanges = this.sectionEditorForm.valueChanges
			.subscribe(
				(res: { header: string }) => {
					this.currentValueSet['header'] = res.header;
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
			this.sectionEditorForm.disable();
			value['name'] = this.slideName;
			value['template'] = this.templateId;
			value['status'] = this.saveAs ? 'publish' : 'draft';
			this.formData.emit(this.emitEvent(value));
		} else {
			this.sectionEditorForm.enable();
			this.sectionEditorForm.get('header').markAsTouched();
		}
	}

	private emitEvent(value: IEditorSectionFormData): Observable<IGenEditorPostAction> {
		let slideId:string = '';
		try {
			slideId = this.slide._id;
		} catch (err) {}
		return this.$induction.editorSection(value, this.inductionId, this.action, slideId);
	}

	ngOnDestroy(): void {
		this.subFormSubmit.unsubscribe();
		this.subFormSubmitSuccess.unsubscribe();
		this.formValueChanges.unsubscribe();
	}

}