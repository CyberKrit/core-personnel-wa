import { NgModule } from '@angular/core';

import {
  MatProgressBarModule,
	MatDialogModule,
	MatButtonModule,
  MatSelectModule,
  MatSlideToggleModule
} from '@angular/material';

@NgModule({
  imports: [
    MatProgressBarModule,
  	MatDialogModule,
  	MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  exports: [
    MatProgressBarModule,
  	MatDialogModule,
  	MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule
  ]
})

export class AngularMaterialModule {}