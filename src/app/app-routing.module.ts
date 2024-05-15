import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'company-add',
    loadChildren: () => import('./company-add/company-add.module').then( m => m.CompanyAddPageModule)
  },
  {
    path: 'company-list',
    loadChildren: () => import('./company-list/company-list.module').then( m => m.CompanyListPageModule)
  },
  {
    path: 'company-debit-memo-list',
    loadChildren: () => import('./company-debit-memo-list/company-debit-memo-list.module').then( m => m.CompanyDebitMemoListPageModule)
  },
  {
    path: 'company-debit-memo-add',
    loadChildren: () => import('./company-debit-memo-add/company-debit-memo-add.module').then( m => m.CompanyDebitMemoAddPageModule)
  },
  {
    path: 'company-return-item-list',
    loadChildren: () => import('./company-return-item-list/company-return-item-list.module').then( m => m.CompanyReturnItemListPageModule)
  },
  {
    path: 'company-return-item-add',
    loadChildren: () => import('./company-return-item-add/company-return-item-add.module').then( m => m.CompanyReturnItemAddPageModule)
  },
  {
    path: 'manufacturer-list',
    loadChildren: () => import('./manufacturer-list/manufacturer-list.module').then( m => m.ManufacturerListPageModule)
  },
  {
    path: 'manufacturer-add',
    loadChildren: () => import('./manufacturer-add/manufacturer-add.module').then( m => m.ManufacturerAddPageModule)
  },
  {
    path: 'manufacturer-return-policy',
    loadChildren: () => import('./manufacturer-return-policy/manufacturer-return-policy.module').then( m => m.ManufacturerReturnPolicyPageModule)
  },
  {
    path: 'wholesaler-list',
    loadChildren: () => import('./wholesaler-list/wholesaler-list.module').then( m => m.WholesalerListPageModule)
  },
  {
    path: 'wholesaler-add',
    loadChildren: () => import('./wholesaler-add/wholesaler-add.module').then( m => m.WholesalerAddPageModule)
  },
  {
    path: 'druginfo-list',
    loadChildren: () => import('./druginfo-list/druginfo-list.module').then( m => m.DruginfoListPageModule)
  },
  {
    path: 'druginfo-add',
    loadChildren: () => import('./druginfo-add/druginfo-add.module').then( m => m.DruginfoAddPageModule)
  },  {
    path: 'druginfo-return-policy',
    loadChildren: () => import('./druginfo-return-policy/druginfo-return-policy.module').then( m => m.DruginfoReturnPolicyPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'sync-data',
    loadChildren: () => import('./sync-data/sync-data.module').then( m => m.SyncDataPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
