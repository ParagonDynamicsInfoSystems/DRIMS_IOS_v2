import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WholesalerListPage } from './wholesaler-list.page';

const routes: Routes = [
  {
    path: '',
    component: WholesalerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WholesalerListPageRoutingModule {}
