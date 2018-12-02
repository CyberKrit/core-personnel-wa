import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// custom imports
import { ProfileComponent } from './profile.comp';
import { ProfileService } from './profile.service';
import { ProfileResolve } from './profile-resolve.service';

const profileRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ProfileComponent,
				resolve: { data: ProfileResolve }
			}
		]
	}
];

@NgModule({
	declarations: [
		ProfileComponent
	],
	imports: [
		RouterModule.forChild(profileRoutes)
	],
	providers: [
		ProfileService,
		ProfileResolve
	]
})
export class ProfileModule {}