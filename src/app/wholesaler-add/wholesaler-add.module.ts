import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WholesalerAddPageRoutingModule } from './wholesaler-add-routing.module';

import { WholesalerAddPage } from './wholesaler-add.page';
import { MaskitoModule } from '@maskito/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WholesalerAddPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule
  ],
  declarations: [WholesalerAddPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA here

})
export class WholesalerAddPageModule {}
