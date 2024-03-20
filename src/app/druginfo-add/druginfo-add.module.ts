import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DruginfoAddPageRoutingModule } from './druginfo-add-routing.module';

import { DruginfoAddPage } from './druginfo-add.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DruginfoAddPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule

  ],
  declarations: [DruginfoAddPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA here

})
export class DruginfoAddPageModule {}
