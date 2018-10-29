import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// custom imports
import { AppComponent } from './app.component';

const AppRoute: Routes = [
	{ path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule' },
	{ path: 'induction', loadChildren: './modules/induction/induction.module#InductionModule' },
	{ path: '', redirectTo: '/', pathMatch: 'full' },
	{ path: 'login', redirectTo: '/login', pathMatch: 'full' },
	{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
	imports: [
		RouterModule.forRoot(AppRoute, { preloadingStrategy: PreloadAllModules })
	],
	exports: [
		RouterModule
	]
})

export class AppRouteModule {}