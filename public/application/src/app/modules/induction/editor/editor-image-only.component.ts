import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';

// custom imports
import { InductionService } from '../induction.service';
import { MediaService } from '../../../shared/service/media.service';

@Component({
	selector: 'editor-image-only',
	template: `
		<form novalidate autocomplete="false">
			<input type="file" (change)="changEvt($event)" #fileInput>
			<button type="buttton" (click)="fileInput.click()">Upload</button>
			<button type="submit">Save</button>
		</form>
		{{ progress }}
		<img src="http://localhost:3000/uploads/{{ storedFileName }}" alt="image" *ngIf="storedFileName">
	`
})
export class EditorImageOnly implements OnInit {
	public selectedFiles: File = null;
  public progress: number = 0;
  public storedFileName: string;

	constructor(
		private $media: MediaService) {}

	ngOnInit() {
	}

	public changEvt(event) {
    this.selectedFiles = <File>event.target.files[0];
    this.uploadData();
	}

	public uploadData() {

		this.progress = 0;
 
    this.$media.upload(this.selectedFiles).subscribe(event => {
    	if( event.type === HttpEventType.UploadProgress ) {
    		this.progress = Math.round(100 * event.loaded / event.total);
    	} else if ( event.type === HttpEventType.Response ) {
        this.storedFileName = event.body.storedFileName;
      }
    });

	}

}