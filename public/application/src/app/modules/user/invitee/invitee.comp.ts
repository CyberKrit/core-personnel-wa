import { Component, OnInit } from '@angular/core';


import { CoreService } from '../../core/core.service';

@Component({
	template: `
		<div class="comp-body">
			<div class="comp-body-null">Get started with inviting a participent for any induction.</div>
		</div>
	`
})

export class InviteeComp implements OnInit {

	constructor(
		private $core: CoreService) {}

	ngOnInit(): void {
		this.$core.removeProgressbar();
	}

}