import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// custom imports
import { DashboardComp } from './dashboard';
import { DashboardService } from './dashboard.service';
import { DashboardRoutes } from './dashboard.route';

@NgModule({
	declarations: [
		DashboardComp
	],
	imports: [
		CommonModule,
		RouterModule.forChild(DashboardRoutes)
	],
	providers: [
		DashboardService
	]
})

export class DashboardModule {}