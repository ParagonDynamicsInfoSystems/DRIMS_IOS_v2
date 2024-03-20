import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyAddPage } from './company-add.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyAddPageRoutingModule {}
