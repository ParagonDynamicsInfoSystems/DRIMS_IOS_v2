import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyDebitMemoAddPage } from './company-debit-memo-add.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyDebitMemoAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyDebitMemoAddPageRoutingModule {}
