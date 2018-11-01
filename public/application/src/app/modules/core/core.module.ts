import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

// custom imports
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AngularMaterialModule } from './angular-material.module';
import { ConsentBox } from '../../shared/component/modal/consent-box';
import { PromptBox } from '../../shared/component/modal/prompt-box';
import { InductionService } from '../induction/induction.service';

@NgModule({
	declarations: [
		HeaderComponent,
		SidebarComponent,
		ConsentBox,
		PromptBox
	],
	imports: [
		BrowserAnimationsModule,
		HttpModule,
		RouterModule,
		AngularMaterialModule
	],
	entryComponents: [
		ConsentBox,
		PromptBox
  ],
	exports: [
		HeaderComponent,
		SidebarComponent
	],
  providers: [
  	InductionService
  ],
})

export class CoreModule {}