import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufacturerReturnPolicyPage } from './manufacturer-return-policy.page';

const routes: Routes = [
  {
    path: '',
    component: ManufacturerReturnPolicyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturerReturnPolicyPageRoutingModule {}
