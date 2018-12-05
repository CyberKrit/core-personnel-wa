import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// custom imports
import { InviteeComp } from './invitee.comp';

const inviteeRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: InviteeComp
			}
		]
	}
];

@NgModule({
	declarations: [
		InviteeComp
	],
	imports: [
		CommonModule,
		RouterModule.forChild(inviteeRoutes)
	],
	providers: []
})
export class InviteeModule {}