import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WholesalerAddPage } from './wholesaler-add.page';

const routes: Routes = [
  {
    path: '',
    component: WholesalerAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WholesalerAddPageRoutingModule {}
