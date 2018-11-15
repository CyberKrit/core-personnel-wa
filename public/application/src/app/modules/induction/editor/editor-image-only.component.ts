import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpEventType} from '@angular/common/http';
import { catchError } from 'rxjs/operators';

// custom imports
import { InductionService } from '../induction.service';
import { MediaService } from '../../../shared/service/media.service';

@Component({
	selector: 'editor-image-only',
	template: `
		<form novalidate autocomplete="false">
			<div class="file-upload-wrapper">
				<label>
					Upload an image
					<span class="desc">Click the gray box below to upload your image</span>
				</label>
				<div class="file-upload-wrapper-ctrl">
					<div [ngClass]="{ 'has-file': fileSrc, 'on-progress': progress && progress !== 100 }"
						class="image-upload-placeholder"
						matRipple (click)="fileInput.click()">
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
					<ul class="err-list" *ngIf="isFileUploadActionFailed">
						<li class="err-item">
							Upload has failed. Please upload a valid image format.
						</li>
					</ul>
					<div class="btn-grp">
						<button class="btn-remove" type="button" mat-icon-button 
							(click)="removeFile()"
							*ngIf="fileSrc">
					    <mat-icon aria-label="discard file">cancel</mat-icon>
					  </button>
						<input class="_visuallyhidden_" type="file" (change)="changEvt($event)" #fileInput>
						<button mat-button class="btn-outline" type="button" *ngIf="fileSrc">Edit image</button>
						<button mat-button class="btn-outline" type="button" *ngIf="!fileSrc">Select from gallery</button>
					</div>
				</div>
			</div>
		</form>
	`,
	styleUrls: ['./editor.component.scss']
})
export class EditorImageOnly implements OnInit {
	public selectedFiles: File = null;
  public progress: number = 0;
  public fileSrc: string = null;
  public isFileUploadActionFailed: boolean = false;

	constructor(
		private $media: MediaService) {}

	ngOnInit() {
	}

	public changEvt(event) {
    this.selectedFiles = <File>event.target.files[0];
    if( this.selectedFiles ) this.uploadData();
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
		        this.fileSrc = event.body.fileSrc;
		      }
	      },
	      catchError => {
	      	this.isFileUploadActionFailed = true;
		    	this.fileSrc = null;
	      }
	    );
 		} catch (err) {
 			console.log('upload failed: ', err);
 		}

	}

	public removeFile() {
		this.fileSrc = null;
	}

}