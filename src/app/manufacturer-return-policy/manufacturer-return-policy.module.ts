import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManufacturerReturnPolicyPageRoutingModule } from './manufacturer-return-policy-routing.module';

import { ManufacturerReturnPolicyPage } from './manufacturer-return-policy.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufacturerReturnPolicyPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule
  ],
  declarations: [ManufacturerReturnPolicyPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA here

})
export class ManufacturerReturnPolicyPageModule {}
