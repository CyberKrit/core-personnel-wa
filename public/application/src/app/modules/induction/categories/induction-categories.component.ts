import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';

// custom import
import { InductionService } from '../induction.service';
import { InductionListComp } from '../list/induction-list.component';


@Component({
	selector: 'induction-categories',
	templateUrl: './induction-categories.component.html',
	styleUrls: ['./induction-categories.component.scss']
})

export class InductionCategories implements OnInit {
	@ViewChild('createCatFormActionBtn') createCatFormActionBtn: ElementRef;
	public categories: Array<any> = [];
	public createCatFormSubmit: boolean = false;
	public catNameDefaultVal: string = '';

	constructor(
		public inductionService: InductionService,
		public dialog: MatDialog) {}

	ngOnInit() {
		this.listCat();
	}

	public addCategoryForm(createCatForm: NgForm) {
		// change button visual state to busy
		this.createCatFormActionBtn.nativeElement.classList.add('_busy_');
		// disable button from template
		this.createCatFormSubmit = true;

		let { newCategoryName } = createCatForm.value;
		let slug = newCategoryName.toString().toLowerCase()
								.replace(/\s+/g, '-')           // Replace spaces with -
						    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
						    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
						    .replace(/^-+/, '')             // Trim - from start of text
						    .replace(/-+$/, '');            // Trim - from end of text

		const req = {
			name: newCategoryName.trim(),
			slug
		};

		console.log(createCatForm);

		this.inductionService.createCategory(req)
			.subscribe(
				(res) => {
					// change button visual state to idle
					this.createCatFormActionBtn.nativeElement.classList.remove('_busy_');
					// disable button from template
					this.createCatFormSubmit = false;
					// reset category name input value
					createCatForm.reset();
					// repopulate category list
					this.listCat();
				},
				(err) => console.log(err)
			);
	}

	listCat() {
		this.inductionService.listCategory()
			.subscribe(
				(res: Array<any>)  => {
					this.categories = res;
				},
				(err) => console.error(err)
			);
	}

	public openDialog() {
		let dialogRef = this.dialog.open(InductionListComp);
	}

}