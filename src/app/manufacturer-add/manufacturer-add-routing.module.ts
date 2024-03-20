import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufacturerAddPage } from './manufacturer-add.page';

const routes: Routes = [
  {
    path: '',
    component: ManufacturerAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturerAddPageRoutingModule {}
