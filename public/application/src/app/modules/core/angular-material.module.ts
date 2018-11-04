import { NgModule } from '@angular/core';

import {
  MatProgressBarModule,
	MatDialogModule,
	MatButtonModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule
} from '@angular/material';

@NgModule({
  imports: [
    MatProgressBarModule,
  	MatDialogModule,
  	MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  exports: [
    MatProgressBarModule,
  	MatDialogModule,
  	MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ]
})

export class AngularMaterialModule {}