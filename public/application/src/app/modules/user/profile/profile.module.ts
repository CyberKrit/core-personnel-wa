import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// custom imports
import { ProfileComponent } from './profile.comp';
import { ProfileService } from './profile.service';
import { ProfileResolve } from './profile-resolve.service';
import { FormService } from '../../../shared/service/form.service';

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
		CommonModule,
		ReactiveFormsModule,
		RouterModule.forChild(profileRoutes)
	],
	providers: [
		ProfileService,
		ProfileResolve,
		FormService
	]
})
export class ProfileModule {}