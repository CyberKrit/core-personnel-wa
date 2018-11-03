import { NgModule } from '@angular/core';

import {
  MatProgressBarModule,
	MatDialogModule,
	MatButtonModule
} from '@angular/material';

@NgModule({
  imports: [
    MatProgressBarModule,
  	MatDialogModule,
  	MatButtonModule
  ],
  exports: [
    MatProgressBarModule,
  	MatDialogModule,
  	MatButtonModule
  ]
})

export class AngularMaterialModule {}