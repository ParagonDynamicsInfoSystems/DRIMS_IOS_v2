import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DruginfoReturnPolicyPageRoutingModule } from './druginfo-return-policy-routing.module';

import { DruginfoReturnPolicyPage } from './druginfo-return-policy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DruginfoReturnPolicyPageRoutingModule,
    ReactiveFormsModule,

  ],
  declarations: [DruginfoReturnPolicyPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA here

})
export class DruginfoReturnPolicyPageModule {}
