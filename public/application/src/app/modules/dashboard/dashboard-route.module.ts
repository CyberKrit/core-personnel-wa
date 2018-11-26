import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// custom imports
import { DashboardComponent }   from './dashboard.component';

const DashboardRoutes: Routes = [
	{ 
		path: '', 
		component: DashboardComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(DashboardRoutes)
	],
	exports: [
		RouterModule
	]
})

export class DashboardRouteModule {}