import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyReturnItemListPage } from './company-return-item-list.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyReturnItemListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyReturnItemListPageRoutingModule {}
