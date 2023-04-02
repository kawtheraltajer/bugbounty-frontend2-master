import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PLBSSubCategoryPage } from './plbs-sub-category.page';

const routes: Routes = [
  {
    path: '',
    component: PLBSSubCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PLBSSubCategoryPageRoutingModule {}
