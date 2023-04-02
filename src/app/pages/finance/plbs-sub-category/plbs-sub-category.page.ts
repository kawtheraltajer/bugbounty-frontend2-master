import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FinanceService } from 'src/app/services/finance.service';
import { Permission, PLBSCategory } from '../../../interfaces/types';

@Component({
  selector: 'app-plbs-sub-category',
  templateUrl: './plbs-sub-category.page.html',
  styleUrls: ['./plbs-sub-category.page.scss'],
})
export class PLBSSubCategoryPage implements OnInit {
  isLoading = true;

  PLBSSubCategories = [];
  perm: Permission
  
  constructor(public finance: FinanceService, public app: AppService) { }

  async ngOnInit() {
    this.PLBSSubCategories = await this.finance.getAllPLBSSubCategories();
    console.log("this.PLBSSubCategories");
    console.log(this.PLBSSubCategories);
    this.isLoading = false;
  }
}
