import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyAddPageRoutingModule } from './company-add-routing.module';

import { CompanyAddPage } from './company-add.page';
import { MaskitoModule } from '@maskito/angular';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyAddPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule

  ],
  declarations: [CompanyAddPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA here

})
export class CompanyAddPageModule {}
