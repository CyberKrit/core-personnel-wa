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
		return this.$induction.editorSection(value, this.inductionId, this.action);
	}

}





// export class EditorSectionComponent implements OnInit, OnDestroy {
// 	public sectionForm: FormGroup;
// 	private saveAsOptions: string[] = [ 'Draft', 'Publish' ];
// 	public saveAs: string = this.saveAsOptions[1];
// 	public lazyForm: boolean = false;

// 	private form$: Subscription;

// 	@Input('inductionData') public inductionData: IInductionSingleResolve;
// 	@Input('slideTitle') public slideTitle: string;
// 	@Input('variation') public variation: string;
// 	@Input('templateData') public templateData: ITemplateList;

// 	constructor(
// 		private fb: FormBuilder,
// 		private $form: FormService,
// 		private $induction: InductionService,
// 		private dialog: MatDialog) {}

// 	ngOnInit() {
// 		let { header, status } = this.inductionData.slide;
// 		let { createdAt, updatedAt } = this.inductionData.slide;

// 		// convert slide save status into binary
// 		let publishData: boolean = ( this.$induction.singleTempDataFn().status === 'publish' ) ? true : false;
// 		// calculate slide publish state
// 		let startDate = moment(createdAt);
// 		let endDate = moment(updatedAt);
// 		let dateDiff = moment.duration(endDate.diff(startDate));
// 		if( dateDiff.asSeconds() < 1 ) {
// 			publishData = true;
// 		}

// 		// create form
// 		this.sectionForm = this.fb.group({
// 			sectionTitle: [this.$induction.singleTempDataFn().header, [Validators.required, this.$form.safeString]],
// 			publish: [publishData] // make publish true manually,a s default is in draft mode
// 		});

// 		this.sectionForm.get('publish').valueChanges
// 			.subscribe(
// 				value => {
// 					if( value ) {
// 						this.saveAs = this.saveAsOptions[1];
// 					} else {
// 						this.saveAs = this.saveAsOptions[0];
// 					}
// 				}
// 			);

// 		// save data temporarily
// 		this.form$ = this.sectionForm.valueChanges
// 			.subscribe(
// 				value => {
// 					this.$induction.singleTempData.header = value.sectionTitle;
// 					this.$induction.singleTempData.status = value.publish ? 'publish' : 'draft';
// 				}
// 			);

// 	}

// 	public removeSlide(): void {
// 		// remove fn
// 		let { _id } = this.inductionData;
// 		let slideId = this.inductionData.slide._id;
// 		let removeService = () => {
// 			return this.$induction.deleteSlide(_id, slideId);
// 		}

// 		// open modal
// 		let localDialog = this.dialog.open(ConsentSheet, {
// 			data: { 
// 				confirm: { 
// 					title: 'Yes, delect this slide', 
// 					desc: 'This action is not reversible',
// 					fn: removeService, 
// 					navigate: '/induction/edit/' + _id
// 				},
// 				cancel: { 
// 					title: 'Keep this slide', 
// 					desc: 'The slide is safe',
// 					fn: null, 
// 					navigate: null 
// 				} 
// 			},
// 			autoFocus: true,
// 			disableClose: true
// 		});

// 		localDialog.afterClosed()
// 			.subscribe(res => {});
// 	}

// 	public formSubmit({ value, valid }: { value: any, valid: boolean }): void {
// 		if( valid && !this.lazyForm ) {
// 			let filteredValue = this.$form.whiteSpaceControl(value);

// 			this.sectionForm.disable();
// 			this.lazyForm = true;

// 			// build req object
// 			let isPublished = ( filteredValue.publish ) ? 'publish' : 'draft';

// 			let buildReq = {
// 				inductionId: this.inductionData._id,
// 				slideIndex: this.inductionData.slideIndex,
// 				slideData: {
// 					template: this.templateData._id,
// 					name: this.slideTitle,
// 					variation: this.variation,
// 					header: filteredValue.sectionTitle,
// 					status: isPublished
// 				}
// 			};

// 			this.$induction.update(buildReq)
// 				.subscribe(
// 					(res: Response) => {
// 						this.sectionForm.enable();
// 						this.lazyForm = false;
// 						this.$induction.slideUpdateFn();
// 					}
// 				);
// 		} else {
// 			this.sectionForm.enable();
// 			this.sectionForm.get('sectionTitle').markAsTouched();
// 			this.lazyForm = true;
// 		}
// 	}

// 	ngOnDestroy() {
// 		this.form$.unsubscribe();
// 	}

// }