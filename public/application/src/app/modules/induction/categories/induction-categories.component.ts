import { Component } from '@angular/core';
import { InductionService } from '../induction.service';

@Component({
	selector: 'induction-categories',
	templateUrl: './induction-categories.component.html',
	styleUrls: ['./induction-categories.component.scss']
})

export class InductionCategories {

	constructor(
		private inductionService: InductionService) {}

	public addCategoryForm(data) {
		//console.log(data.value);
		let { newCategoryName } = data.value;
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

		console.log(slug);
		this.inductionService.createCategory(req)
			.subscribe(
				(res) => console.log(res),
				(err) => console.log(err)
			);
	}

}