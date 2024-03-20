import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManufacturerListPageRoutingModule } from './manufacturer-list-routing.module';

import { ManufacturerListPage } from './manufacturer-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufacturerListPageRoutingModule,
  ],
  declarations: [ManufacturerListPage]
})
export class ManufacturerListPageModule {}
