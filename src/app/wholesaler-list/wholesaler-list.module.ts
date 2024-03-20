import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WholesalerListPageRoutingModule } from './wholesaler-list-routing.module';

import { WholesalerListPage } from './wholesaler-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WholesalerListPageRoutingModule
  ],
  declarations: [WholesalerListPage]
})
export class WholesalerListPageModule {}
