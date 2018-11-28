import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// custom imports
import { HTMLPipe } from '../../shared/pipe/html';
import { InductionComponent } from './induction.component';
import { InductionCategories } from './categories/induction-categories.component';
import { InductionListComp } from './list/induction-list.component';
import { InductionCreateComponent } from './create/induction-create.component';
import { InductionViewComponent } from './view/induction-view.component';
import { InductionEditComponent } from './edit/induction-edit.component';
import { InductionTemplateComponent } from './template/induction-template.component';

// editor`
import { EditorComponent } from './editor/editor.component';
import { EditorQuizComponent } from './editor/editor-quiz.component';
import { EditorSectionComponent } from './editor/editor-section.component';
import { EditorImageOnly } from './editor/editor-image-only.component';
import { EditorImageWithCaption } from './editor/editor-image-with-caption.component';
import { EditorTextOnlyComponent } from './editor/editor-text-only';
import { EditorImageNContentRight } from './editor/editor-image-n-content-right';
import { EditorImageNContentLeft } from './editor/editor-image-n-content-left';
import { EditorContentWithThreeImages } from './editor/editor-content-with-three-image';
import { EditorVideoOnly } from './editor/editor-video-only.component';

// services
import { InductionService } from './induction.service';
import { FormService } from '../../shared/service/form.service';
import { MediaService } from '../../shared/service/media.service';

// modules
import { InductionRouteModule } from './induction-route.module';
import { AngularMaterialModule } from '../core/angular-material.module';

@NgModule({
	declarations: [
		HTMLPipe,
		InductionComponent,
		InductionListComp,
		InductionCategories,
		InductionCreateComponent,
		InductionViewComponent,
		InductionEditComponent,
		InductionTemplateComponent,
		// editor
		EditorComponent,
		EditorQuizComponent,
		EditorSectionComponent,
		EditorTextOnlyComponent,
		EditorImageOnly,
		EditorImageWithCaption,
		EditorImageNContentRight,
		EditorImageNContentLeft,
		EditorContentWithThreeImages,
		EditorVideoOnly
	],
	imports: [
		CommonModule,
		InductionRouteModule,
		HttpModule,
		FormsModule,
		ReactiveFormsModule,
		AngularMaterialModule
	],
	providers: [
		InductionService,
		FormService,
		MediaService
	]
})
export class InductionModule {}