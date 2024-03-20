import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DruginfoListPage } from './druginfo-list.page';

const routes: Routes = [
  {
    path: '',
    component: DruginfoListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DruginfoListPageRoutingModule {}
