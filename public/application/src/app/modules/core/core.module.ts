import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// custom imports
import { FullScreenLoading } from '../../shared/component/modal/loading';
import { LoginComp } from '../user/login/login.comp';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { AngularMaterialModule } from './angular-material.module';
import { InductionService } from '../induction/induction.service';
import { CoreService } from './core.service';
import { ConsentBox } from '../../shared/component/modal/consent-box';
import { ConsentSheet } from '../../shared/component/modal/consent-sheet';
import { PromptBox } from '../../shared/component/modal/prompt-box';
import { AuthInterceptor } from '../../shared/interceptor/auth.interceptor';
import { ResponseHeaderInterceptor } from '../../shared/interceptor/response-header.interceptor';

@NgModule({
	declarations: [
		HeaderComponent,
		SidebarComponent,
		FooterComponent,
		ConsentBox,
		ConsentSheet,
		PromptBox,
		FullScreenLoading,
		LoginComp
	],
	imports: [
		BrowserAnimationsModule,
		HttpClientModule,
		RouterModule,
		FormsModule,
		AngularMaterialModule
	],
	entryComponents: [
		ConsentBox,
		ConsentSheet,
		PromptBox,
		FullScreenLoading
  ],
	exports: [
		HeaderComponent,
		SidebarComponent,
		FooterComponent,
		AngularMaterialModule
	],
	providers: [
		CoreService,
		InductionService,
		{ 
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},
		{ 
			provide: HTTP_INTERCEPTORS,
			useClass: ResponseHeaderInterceptor,
			multi: true
		}
	]
})

export class CoreModule {}