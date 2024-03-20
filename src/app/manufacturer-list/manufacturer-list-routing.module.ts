import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufacturerListPage } from './manufacturer-list.page';

const routes: Routes = [
  {
    path: '',
    component: ManufacturerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturerListPageRoutingModule {}
