import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyListPageRoutingModule } from './company-list-routing.module';

import { CompanyListPage } from './company-list.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyListPageRoutingModule,
    MaskitoModule
  ],
  declarations: [CompanyListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA] 
})
export class CompanyListPageModule {}
