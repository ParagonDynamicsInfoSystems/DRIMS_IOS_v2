import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyReturnItemListPageRoutingModule } from './company-return-item-list-routing.module';

import { CompanyReturnItemListPage } from './company-return-item-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyReturnItemListPageRoutingModule
  ],
  declarations: [CompanyReturnItemListPage]
})
export class CompanyReturnItemListPageModule {}
