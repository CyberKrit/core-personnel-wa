import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { Routes } from '@angular/router';
// import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
// import * as moment from 'moment';

// custom imports
// import { FormService } from '../../../shared/service/form.service';
import { InductionService } from '../induction.service';
import { CoreService } from '../../core/core.service';
import { IEditorSectionFormData, IGenEditorPostAction } from '../../../shared/interface/induction.interface';
// import { ConsentSheet } from '../../../shared/component/modal/consent-sheet';

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
export class EditorSectionComponent implements OnInit {
	// get data from parent
	@Input() public action: string;
	@Input() public slide: any;
	@Input() public slideName: string;
	@Input() public inductionId: string;
	@Input() public templateId: string;
	@Input() public saveAs: boolean;
	@Output() public formData: EventEmitter<Observable<any>> = new EventEmitter<Observable<any>>();

	// form
	public sectionEditorForm: FormGroup;
	public header: string | null;

	constructor(
		private fb: FormBuilder,
		private $induction: InductionService,
		private $core: CoreService) {}

	public ngOnInit(): void {
		// define value for formControl
		if( this.slide ) {
			if( 'name' in this.slide ) 
				this.header = this.slide.header;
		}

		// configure form
		this.sectionEditorForm = this.fb.group({
			header: [this.header, [Validators.required]]
		});

		// fetch form data to parent component for intended action
		this.$induction.editorFormSubmitReq$
			.subscribe(() => this.sectionEditorFormSubmit(this.sectionEditorForm));

		// after submit enable form
		this.$induction.editorFormSubmitComplete$
			.subscribe(() => this.sectionEditorForm.enable());
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

}