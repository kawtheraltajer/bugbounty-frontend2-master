import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PLBSCategoryPage } from './plbs-category.page';

const routes: Routes = [
  {
    path: '',
    component: PLBSCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PLBSCategoryPageRoutingModule {}
