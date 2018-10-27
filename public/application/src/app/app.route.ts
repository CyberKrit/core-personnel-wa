import { Routes } from '@angular/router';

// custom imports
import { AppComponent } from './app.component';

export const AppRoute: Routes = [
	{ path: 'dashboard', component: AppComponent },
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
	// { path: '', redirectTo: '/', pathMatch: 'full' },
	//{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];