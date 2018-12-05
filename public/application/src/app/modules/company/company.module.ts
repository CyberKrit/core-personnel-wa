import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// custom imports
import { CompanyComp } from './company.comp';

const companyRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: CompanyComp
			}
		]
	}
];

@NgModule({
	declarations: [
		CompanyComp
	],
	imports: [
		CommonModule,
		RouterModule.forChild(companyRoutes)
	],
	providers: []
})
export class CompanyModule {}