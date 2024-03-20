import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyDebitMemoAddPageRoutingModule } from './company-debit-memo-add-routing.module';

import { CompanyDebitMemoAddPage } from './company-debit-memo-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyDebitMemoAddPageRoutingModule,
    ReactiveFormsModule,
    
  ],
  declarations: [CompanyDebitMemoAddPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompanyDebitMemoAddPageModule {}
