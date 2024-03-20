import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManufacturerAddPageRoutingModule } from './manufacturer-add-routing.module';

import { ManufacturerAddPage } from './manufacturer-add.page';
import { MaskitoModule } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufacturerAddPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule

  
  ],
  declarations: [ManufacturerAddPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA here

})
export class ManufacturerAddPageModule {}
