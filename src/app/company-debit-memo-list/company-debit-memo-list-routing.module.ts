import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyDebitMemoListPage } from './company-debit-memo-list.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyDebitMemoListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyDebitMemoListPageRoutingModule {}
