import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';


@Component({
  selector: 'app-link',
  templateUrl: './link.page.html',
  styleUrls: ['./link.page.scss'],
})
export class LinkPage implements OnInit {
  isLoading = true;
  selectedRoleID = 0;
  selectedPermissionID = 0;
  selectedGroupID = 0;
  selectedUserID = 0;
  selectedType: 'permissionToRole' | 'roleToGroup' | 'roleToUser' = 'permissionToRole';
  constructor(public lang: LanguageService, public authz: AuthzService, public app: AppService, public router: Router) { 
    /*if (!(this.authz.canDo('READ', 'Permission', []) || this.authz.canDo('MANAGE', 'Permission', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Permission', []) || this.authz.canDo('MANAGE', 'Permission', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    await this.authz.getAll();
  }


  async link() {
   
    await this.app.presentLoading();
    try {
  

      await this.authz.link({
        type: this.selectedType,
        userID: this.selectedUserID,
        groupID: this.selectedGroupID,
        permissionID: this.selectedPermissionID,
        roleID: this.selectedRoleID
      });
      if(this.lang.selectedLang == "en"){
        await this.app.presentAlert('Success ~', 'The link has been successfully completed.', 'errorAlert');
  
      }else{
        await this.app.presentAlert('', 'تمت عملية الربط بنجاح', 'errorAlert');

      }
      await this.app.dismissLoading();

    } catch (error) {
      if(this.lang.selectedLang == "en"){
        await this.app.presentAlert('Sorry ~', 'The link has been  uncompleted.', 'errorAlert');
  
      }else{
        await this.app.presentAlert('.خطأ ~', 'لم يكتمل الارتباط', 'errorAlert');

      }
      await this.app.dismissLoading();

    }
      

      }
    } 
  


