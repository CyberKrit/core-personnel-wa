import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

// custom imports
import { InductionService } from '../induction.service';

@Component({
	selector: 'editor-image-only',
	template: `
		<form 
			[formGroup]="imageOnlyEditor"
			novalidate autocomplete="false"
			(ngSubmit)="saveData(imageOnlyEditor)">
			<input type="file" formControlName="uploadImg" (change)="changEvt($event)">
			<button type="submit">Save</button>
		</form>
	`
})
export class EditorImageOnly implements OnInit {
	public imageOnlyEditor: FormGroup;
	public imageSrc: File = null;

	constructor(
		public fb: FormBuilder,
		private $induction: InductionService) {}

	ngOnInit() {
		this.imageOnlyEditor = this.fb.group({
			uploadImg: []
		});
	}

	public changEvt(event) {
		this.imageSrc = <File>event.target.files[0];
	}

	public saveData({ value, valid }: { value: any, valid: boolean }) {
		const fd = new FormData();
		fd.append('image', this.imageSrc, this.imageSrc.name);
		this.$induction.editorImageOnly(fd)
			.subscribe(
				(res: Response) => {
					console.log(res);
				}
			);
	}

}