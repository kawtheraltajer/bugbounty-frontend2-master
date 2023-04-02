import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewDocPage } from './preview-doc.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewDocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewDocPageRoutingModule {}
