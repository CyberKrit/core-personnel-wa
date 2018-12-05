import { Component, OnInit } from '@angular/core';


import { CoreService } from '../core/core.service';

@Component({
	template: `
		<div class="comp-body">
			<div class="comp-body-null">Company not found.</div>
		</div>
	`
})

export class CompanyComp implements OnInit {

	constructor(
		private $core: CoreService) {}

	ngOnInit(): void {
		this.$core.removeProgressbar();
	}

}