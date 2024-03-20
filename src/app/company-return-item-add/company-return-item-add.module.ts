import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyReturnItemAddPageRoutingModule } from './company-return-item-add-routing.module';

import { CompanyReturnItemAddPage } from './company-return-item-add.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MaskitoModule } from '@maskito/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyReturnItemAddPageRoutingModule,
    BsDatepickerModule.forRoot(),
    MaskitoModule,
    ReactiveFormsModule,


  ],
  declarations: [CompanyReturnItemAddPage]
})
export class CompanyReturnItemAddPageModule {}
