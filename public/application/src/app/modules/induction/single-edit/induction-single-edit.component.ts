import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'induction-single-edit',
	templateUrl: './induction-single-edit.component.html',
	styleUrls: ['./induction-single-edit.component.scss']
})
export class InductionSingleEditComponent implements OnInit {

	constructor() {}

	ngOnInit() {
		console.log('InductionSingleEdit');
	}

}