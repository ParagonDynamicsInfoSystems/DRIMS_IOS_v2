import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DruginfoAddPage } from './druginfo-add.page';

const routes: Routes = [
  {
    path: '',
    component: DruginfoAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DruginfoAddPageRoutingModule {}
