import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DruginfoListPageRoutingModule } from './druginfo-list-routing.module';

import { DruginfoListPage } from './druginfo-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DruginfoListPageRoutingModule
  ],
  declarations: [DruginfoListPage]
})
export class DruginfoListPageModule {}
