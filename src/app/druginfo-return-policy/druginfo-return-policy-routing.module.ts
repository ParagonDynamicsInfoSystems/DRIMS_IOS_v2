import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DruginfoReturnPolicyPage } from './druginfo-return-policy.page';

const routes: Routes = [
  {
    path: '',
    component: DruginfoReturnPolicyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DruginfoReturnPolicyPageRoutingModule {}
