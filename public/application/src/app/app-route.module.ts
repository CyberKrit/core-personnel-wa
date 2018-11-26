import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// custom imports
import { AppComponent } from './app.component';
import { AppAuthCanctivate } from './app-auth.canActivate';

const AppRoute: Routes = [
	{ 
		path: 'dashboard',
		loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
		canActivate: [ AppAuthCanctivate ]
	},
	{ 
		path: 'induction',
		loadChildren: './modules/induction/induction.module#InductionModule',
		canActivate: [ AppAuthCanctivate ]
	},
	{ 
		path: 'login',
		redirectTo: '/login', 
		pathMatch: 'full'
	},
	{ 
		path: '**', 
		redirectTo: '/dashboard', 
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(AppRoute, 
			{ 
				preloadingStrategy: PreloadAllModules,
				onSameUrlNavigation: 'reload'
			})
	],
	exports: [
		RouterModule
	],
	providers: [ AppAuthCanctivate ]
})

export class AppRouteModule {}