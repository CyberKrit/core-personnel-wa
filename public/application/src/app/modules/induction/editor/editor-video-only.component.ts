import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpResponse, HttpEventType} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

// import service
import { FormService } from '../../../shared/service/form.service';
import { InductionService } from '../induction.service';
import { MediaService } from '../../../shared/service/media.service';
// import interface
import { ICompareValuesImageOnly, IGenEditorPostAction, IEditorImageOnlyFormData } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'editor-video-only',
	template: `
		<form 
			novalidate autocomplete="false" 
			[formGroup]="imageWithCaptionForm" (ngSubmit)="formSubmit(imageWithCaptionForm)">

				<div class="file-upload-wrapper">
					<label>
						Upload an video
						<span class="desc">Click the gray box below to upload your image</span>
					</label>

					<input 
						class="_visuallyhidden_" type="file" 
						formControlName="uploadFile" #fileInput
						(change)="uploadFileHasChanged($event)">

					<div class="file-upload-wrapper-ctrl">
						<div class="image-upload-placeholder" matRipple (click)="fileInput.click()">
							<div 
								class="_image-upload-placeholder_"
								[ngStyle]="{ 'background-image': 'url(' + fileSrc + ')'}"
								*ngIf="fileSrc">
							</div>

							<mat-progress-bar 
								mode="determinate" 
								[value]="progress" *ngIf="progress && progress !== 100"></mat-progress-bar>

							<div class="_loading_" *ngIf="progress === 100 && fileSrc">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="animation-play-state:running;animation-delay:0s;background:0 0"><circle cx="50" cy="50" fill="none" stroke-linecap="round" r="40" stroke-width="7" stroke="#bab8b9" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(288.79 50 50)" style="animation-play-state:running;animation-delay:0s"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></circle></svg>
							</div>
						</div>

						<div class="btn-grp">
							<button class="btn-remove" type="button" mat-icon-button 
								(click)="removeFile()" *ngIf="fileSrc">
						    <mat-icon aria-label="discard file">cancel</mat-icon>
						  </button>
						</div>

						<ul class="err-list">
							<li class="err-item" *ngIf="!fileSrc && isSubmittedOnce">
								This field is required
							</li>
							<li class="err-item" *ngIf="unknownFormat">
								Upload has failed. Please upload a valid video format.
							</li>
						</ul>
					</div>
				</div>
			
		</form>
	`,
	styleUrls: ['./editor.component.scss']
})
export class EditorVideoOnly implements OnInit, OnDestroy, OnChanges {
  // get data from parent
	@Input() public action: string;
	@Input() public slide: any;
	@Input() public slideName: string;
	@Input() public inductionId: string;
	@Input() public templateId: string;
	@Input() public saveAs: boolean;
	@Output() public detectChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public formData: EventEmitter<Observable<any>> = new EventEmitter<Observable<any>>();
	@ViewChild('fileInput') fileInput: ElementRef;

	// form
	public imageWithCaptionForm: FormGroup;
	private subFormSubmit: Subscription;
	private formValueChanges: Subscription;
	private subFormSubmitSuccess: Subscription;
	public progress: number = 0;
	public fileSrc: string | null = null;
	public fileId: string | null = null;
	public unknownFormat: boolean = false;
	public isSubmittedOnce: boolean = false;

	// compare values
	private previousValueSet: ICompareValuesImageOnly = {};
	private currentValueSet: ICompareValuesImageOnly = {};

	constructor(
		private fb: FormBuilder,
		private $form: FormService,
		private $induction: InductionService,
		private $media: MediaService) {}

	public ngOnInit(): void {
		this.detectChange.emit(false);
		// define value for formControl

		if( this.slide ) {
			if( 'name' in this.slide ) 
				this.previousValueSet['name'] = this.slideName;
				this.previousValueSet['uploadFile'] = this.slide.resource[0].source.src;
				this.fileSrc = this.slide.resource[0].source.src || null;
				this.fileId = this.slide.resource[0].source._id || null;
				this.previousValueSet['status'] = this.saveAs ? 'publish' : 'draft';
		}

		this.imageWithCaptionForm = this.fb.group({
			uploadFile: null
		});

		// track changes
		this.formValueChanges = this.imageWithCaptionForm.valueChanges
			.subscribe(
				(res: ICompareValuesImageOnly) => {
					this.currentValueSet['uploadFile'] = res.uploadFile;
					this.detectChange.emit(true);
				}
			);

		// fetch form data to parent component for intended action
		this.subFormSubmit = this.$induction.editorFormSubmitReq$
			.subscribe(() => {
				this.isSubmittedOnce = true;
				this.formSubmit(this.imageWithCaptionForm);
			});

		// after submit enable form
		this.subFormSubmitSuccess = this.$induction.editorFormSubmitComplete$
			.subscribe(() => {
				this.imageWithCaptionForm.enable();
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

	public uploadFileHasChanged(event): void {
		try {
    	let thisFile = <File>event.target.files[0];
    	if( thisFile ) this.uploadData(thisFile);
		} catch(err) {
			// reset input field, because user may reupload a file immediate after deleting it
			this.imageWithCaptionForm.get('uploadFile').setValue(null);
		}
	}

	public uploadData(file) {
		this.progress = 0;

 		try {
	    this.$media.upload(file).subscribe(
	    	event => {
	      	this.unknownFormat = false;

		    	if( event.type === HttpEventType.UploadProgress ) {
		    		this.progress = Math.round(100 * event.loaded / event.total);
		    	} else if ( event.type === HttpEventType.Response ) {
		    		this.fileSrc = event.body.src;
		    		this.fileId = event.body._id;
		      }
	      },
	      catchError => {
	      	this.unknownFormat = true;
		    	this.fileSrc = null;
		    	// reset file upload form field
					this.imageWithCaptionForm.get('uploadFile').setValue(null);
	      }
	    );
 		} catch (err) {
 			console.log('upload failed: ', err);
 		}
	}

	public removeFile() {
		this.fileSrc = null;
		this.imageWithCaptionForm.get('uploadFile').setValue(null);
	}

	public formSubmit({ value, valid }: { value: any, valid: boolean }): void {
		if( valid && this.fileSrc && this.fileId ) {
			let filteredValue = this.$form.whiteSpaceControl(value);
			this.imageWithCaptionForm.disable();

			// set data from aprent
			filteredValue['name'] = this.slideName;
			filteredValue['template'] = this.templateId;
			filteredValue['status'] = this.saveAs ? 'publish' : 'draft';
			filteredValue['mediaId'] = this.fileId;

			this.formData.emit(this.emitEvent(filteredValue));
		} else {
			this.imageWithCaptionForm.enable();
		}
	}

	private emitEvent(value: IEditorImageOnlyFormData): Observable<IGenEditorPostAction> {
		let slideId:string = '';
		try {
			slideId = this.slide._id;
		} catch (err) {}
		return this.$induction.editorImageOnly(value, this.inductionId, slideId);
	}

	public ngOnDestroy(): void {
		this.subFormSubmit.unsubscribe();
		this.formValueChanges.unsubscribe();
		this.subFormSubmitSuccess.unsubscribe();
	}

}