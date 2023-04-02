import { Component, OnInit } from '@angular/core';
import { Permission, PLBSCategory } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-plbs-category',
  templateUrl: './plbs-category.page.html',
  styleUrls: ['./plbs-category.page.scss'],
})
export class PLBSCategoryPage implements OnInit {
  isLoading = true;

  PLBSCategories: PLBSCategory[]; 
   perm: Permission
  
  constructor(public finance: FinanceService, public app: AppService) { }

  async ngOnInit() {
    this.PLBSCategories = await this.finance.getAllPLBSCategories();
    console.log(this.PLBSCategories);
    this.isLoading = false;
  }

}
