import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpResponse, HttpEventType} from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';

// custom imports
import { FormService } from '../../../shared/service/form.service';
import { InductionService } from '../induction.service';
import { MediaService } from '../../../shared/service/media.service';
import { IInductionSingleResolve, ITemplateList } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'editor-image-only',
	template: `
		<form novalidate autocomplete="false" 
			[formGroup]="imageOnlyEditorForm" (ngSubmit)="imageOnlyEditorFormSubmit(imageOnlyEditorForm)">
			<div class="comp-aside _clr_">
				<div class="_end_">
					<span class="save-as-text">{{ saveAs }}</span> <mat-slide-toggle formControlName="publish"></mat-slide-toggle>
				</div>
			</div>

			<div class="file-upload-wrapper">
				<label>
					Upload an image
					<span class="desc">Click the gray box below to upload your image</span>
				</label>

				<div class="file-upload-wrapper-ctrl">
					<div [ngClass]="{ 'has-file': fileSrc && progress === 100, 'on-progress': progress && progress !== 100 }"
						class="image-upload-placeholder"
						matRipple (click)="fileInput.click()">

						<div class="_loading_" *ngIf="progress === 100 && fileSrc">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="animation-play-state:running;animation-delay:0s;background:0 0"><circle cx="50" cy="50" fill="none" stroke-linecap="round" r="40" stroke-width="7" stroke="#bab8b9" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(288.79 50 50)" style="animation-play-state:running;animation-delay:0s"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></circle></svg>
						</div>

						<div 
							class="_image-upload-placeholder_"
							[ngStyle]="{ 'background-image': 'url(' + fileSrc + ')'}"
							*ngIf="fileSrc">
						</div>

						<mat-progress-bar 
							mode="determinate" 
							[value]="progress" 
							*ngIf="progress && progress !== 100"></mat-progress-bar>
					</div>
					<ul class="err-list">
						<li class="err-item" *ngIf="isFileUploadActionFailed">
							Upload has failed. Please upload a valid image format.
						</li>
						<li class="err-item" *ngIf="!fileSrc && lazyForm">
							Please upload an image.
						</li>
						<li class="err-item" *ngIf="submitWarning && !lazyForm">
							Please upload an image.
						</li>
					</ul>

					<div class="btn-grp">
						<button class="btn-remove" type="button" mat-icon-button 
							(click)="removeFile()"
							*ngIf="fileSrc && lazyForm === false">
					    <mat-icon aria-label="discard file">cancel</mat-icon>
					  </button>

						<input class="_visuallyhidden_" type="file" (change)="changEvt($event)" #fileInput>

						<button mat-button class="btn-outline" type="button" *ngIf="fileSrc">Edit image</button>

						<button mat-button class="btn-outline" type="button" *ngIf="!fileSrc">Select from gallery</button>

						<button class="primary-action-btn" type="submit">
							<div class="idle" *ngIf="!lazyForm">
								<span *ngIf="imageOnlyEditorForm.get('publish').value === true">Publish Slide</span>
								<span *ngIf="imageOnlyEditorForm.get('publish').value === false">Save as Draft</span>
							</div>
							<span class="lazy" *ngIf="lazyForm">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="animation-play-state:running;animation-delay:0s;background:0 0"><circle cx="50" cy="50" fill="none" stroke-linecap="round" r="40" stroke-width="8" stroke="#fff" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(288.79 50 50)" style="animation-play-state:running;animation-delay:0s"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></circle></svg>
							</span>
						</button>
					</div>
				</div>
			</div>
		</form>
	`,
	styleUrls: ['./editor.component.scss']
})
export class EditorImageOnly implements OnInit, OnDestroy {
  // file
	public selectedFiles: File = null;
  public progress: number = 0;
  public fileSrc: string = null;
  public fileId: string = null;
  public isFileUploadActionFailed: boolean = false;
  public detectChangesSubscription: any;

  // form
  public imageOnlyEditorForm: FormGroup;
	private saveAsOptions: string[] = [ 'Draft', 'Publish' ];
	public saveAs: string = this.saveAsOptions[1];
	public lazyForm: boolean = false;
	@ViewChild('fileInput') public fileInput: ElementRef;
	private form$: Subscription;
	public submitWarning: boolean = false;

	// input
	@Input('slideTitle') public slideTitle: string;
	@Input('variation') public variation: string;
	@Input('inductionData') public inductionData: IInductionSingleResolve;
	@Input('templateData') public templateData: ITemplateList;

	constructor(
		private $media: MediaService,
		private fb: FormBuilder,
		private $induction: InductionService,
		private $form: FormService) {}


	ngOnInit() {
		this.detectChangesSubscription = this.$induction.imageOnlyEditorChanges$
			.subscribe(
				(data: string) => {
					this.fileSrc = data;
				}
			);

		if( this.inductionData.media ) {
			this.publicLoadFile(this.inductionData.media);
		}

		let { status } = this.inductionData.slide;
		let { createdAt, updatedAt } = this.inductionData.slide;

		// convert slide save status into binary
		let publishData: boolean = ( this.$induction.singleTempDataFn().status === 'publish' ) ? true : false;
		// calculate slide publish state
		let startDate = moment(createdAt);
		let endDate = moment(updatedAt);
		let dateDiff = moment.duration(endDate.diff(startDate));
		if( dateDiff.asSeconds() < 1 ) {
			publishData = true;
		}

		this.imageOnlyEditorForm = this.fb.group({
			publish: [publishData]
		});

		this.imageOnlyEditorForm.get('publish').valueChanges
			.subscribe(
				value => {
					if( value ) {
						this.saveAs = this.saveAsOptions[1];
					} else {
						this.saveAs = this.saveAsOptions[0];
					}
				}
			);

		// save data temporarily
		this.form$ = this.imageOnlyEditorForm.valueChanges
			.subscribe(
				value => {
					this.$induction.singleTempData.status = value.publish ? 'publish' : 'draft';
				}
			);
	}

	// laod data if image source exists
	publicLoadFile(media: { _id: string, src: string }): void {
		this.$induction.singleTempData.imageOnlySrc = media.src;
		// this.progress = 100;
		this.$induction.imageOnlyEditorChangesFn();
	}

	public changEvt(event) {
		try {
    	this.selectedFiles = <File>event.target.files[0];
    	if( this.selectedFiles ) this.uploadData();
		} catch(err) {
			// reset input field, because user may reupload a file immediate after deleting it
			this.fileInput.nativeElement.value = '';
		}
	}

	public uploadData() {

 		try {
			this.progress = 0;

	    this.$media.upload(this.selectedFiles).subscribe(
	    	event => {
	    		this.isFileUploadActionFailed = false;

		    	if( event.type === HttpEventType.UploadProgress ) {
		    		this.progress = Math.round(100 * event.loaded / event.total);
		    	} else if ( event.type === HttpEventType.Response ) {
		    		console.log('=====================');
		    		console.log(this.$induction.singleTempData.imageOnlySrc);
		    		console.log(event.body.src);
		    		console.log('=====================');
		    		if( this.$induction.singleTempData.imageOnlySrc !== event.body.src ) {
			        this.$induction.singleTempData.imageOnlySrc = event.body.src;
			        // reflect changes to filesrc variable
			        this.$induction.imageOnlyEditorChangesFn();
			        this.fileId = event.body._id;
		    		}
		      }
	      },
	      catchError => {
	      	this.isFileUploadActionFailed = true;
		    	this.fileSrc = null;
		    	// reset file upload form field
		    	this.fileInput.nativeElement.value = '';
	      }
	    );
 		} catch (err) {
 			console.log('upload failed: ', err);
 		}

	}

	public removeFile() {
		this.fileSrc = null;
		this.lazyForm = false;
		this.changEvt(null);
	}

	public imageOnlyEditorFormSubmit({ value, valid }: { value: any, valid: boolean }): void {

		if( valid && !this.lazyForm && this.fileSrc ) {console.log('imageOnlyEditorFormSubmit');
			let filteredValue = this.$form.whiteSpaceControl(value);

			this.imageOnlyEditorForm.disable();
			this.lazyForm = true;
			this.submitWarning = false;

			// build req object
			let isPublished = ( filteredValue.publish ) ? 'publish' : 'draft';
			let buildSlide;
			
			if( this.fileId ) {
				buildSlide = {
					inductionId: this.inductionData._id,
					slideIndex: this.inductionData.slideIndex,
					slideData: {
						template: this.templateData._id,
						name: this.slideTitle,
						variation: this.variation,
						header: null,
						resource: {
							type: 'image',
							source: this.fileId,
							caption: null,
							alt: null,
							desc: null,
							position: null,
							size: null
						},
						status: isPublished
					}
				};
			} else {
				buildSlide = {
					inductionId: this.inductionData._id,
					slideIndex: this.inductionData.slideIndex,
					slideData: {
						template: this.templateData._id,
						name: this.slideTitle,
						variation: this.variation,
						header: null,
						resource: null,
						status: isPublished
					}
				};
			}

			this.$induction.update(buildSlide)
				.subscribe(
					(res: Response) => {
						this.imageOnlyEditorForm.enable();
						this.lazyForm = false;
						this.$induction.slideUpdateFn();
					}
				);
		} else {
			this.imageOnlyEditorForm.enable();
			this.lazyForm = false;
			this.submitWarning = true;
		}
	}

	ngOnDestroy() {
		this.form$.unsubscribe();
		this.detectChangesSubscription.unsubscribe();
	}

}