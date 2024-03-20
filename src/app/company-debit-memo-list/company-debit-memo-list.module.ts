import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyDebitMemoListPageRoutingModule } from './company-debit-memo-list-routing.module';

import { CompanyDebitMemoListPage } from './company-debit-memo-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyDebitMemoListPageRoutingModule
  ],
  declarations: [CompanyDebitMemoListPage]
})
export class CompanyDebitMemoListPageModule {}
