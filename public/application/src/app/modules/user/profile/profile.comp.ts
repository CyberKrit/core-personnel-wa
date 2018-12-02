import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

// custom imports
import { CoreService } from '../../core/core.service';

@Component({
	templateUrl: './profile.comp.html',
	styleUrls: ['./profile.comp.scss']
})
export class ProfileComponent implements OnInit {
	private userData: any;

	constructor(
		private route: ActivatedRoute,
		private $core: CoreService) {}

	ngOnInit(): void {console.log('ProfileComponent');
		this.route.data
			.subscribe(
				(res: Data) => {
					this.userData = res.data;
					this.$core.removeProgressbar();
					console.log(this.userData);
				}
			);
	}
}