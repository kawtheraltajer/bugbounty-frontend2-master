import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { UserService } from 'src/app/services/user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  addForm: FormGroup;
  changePassForm: FormGroup;
  picURL: any

  constructor(public lang: LanguageService, private fb: FormBuilder, public auth: AuthService, public authz: AuthzService, public app: AppService, public user: UserService) {
    this.addForm = fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      bio: [''],
      image: [''],
    });
    this.changePassForm = fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      newPasswordCon: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    let user = this.auth.userData.value;
    this.addForm.setValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      bio: user.bio,
      image: ''
    });
    // this.picURL = user.pictureURL
    this.addForm.get('image').valueChanges.subscribe(dt => {
      this.imageChange(dt.files[0]);
    });
  }
  async imageChange(image) {
    let reader = new FileReader();
    let url = '';
    if (image) {
      let img = await this.app.readFile(image);
      this.picURL = img.url;
    }
  }
  getURL(imgPath: string) {
    return this.user.getProfilePicURL(imgPath);
  }
  async activate(isActive: boolean) {
    await this.app.presentLoading();
    await this.authz.activeteUser(this.auth.userData.value.id, isActive);
    await this.app.dismissLoading();

  }
  async lock(isLocked: boolean) {
    await this.app.presentLoading();
    await this.authz.lockUser(this.auth.userData.value.id, isLocked);
    await this.app.dismissLoading();
  }

  async update() {
    await this.app.presentLoading();
    let { image, ...data } = this.addForm.value;
    let userdt = this.auth.userData.value;
    console.log(image)
    let url;
    try {
      if (image) {
        let img = image.files[0];
        console.log("img")

        console.log(img)
        let uploaded;
        if (img) {
          uploaded = await this.user.uploadPicture(img);

          if (uploaded?.file.filename) {
            url =uploaded?.file.filename;
          }
        } 


        
        console.log("upload file" )

         console.log( url )
      }
    let user = await this.user.updateMe({
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        pictureURL: url ? url : userdt.pictureURL
      });  
      await this.app.presentAlert('OK!', 'Profile has been updated!', 'successAlert');
   
    } catch (e) {
      console.log(e);
    }
    await this.app.dismissLoading();
  
  }

  async changePassword() {
    await this.app.presentLoading();
    if (this.changePassForm.valid) {
      let val = this.changePassForm.value;
      if (val.newPassword == val.newPasswordCon) {
        try {
          await this.user.changePassword(val.oldPassword, val.newPassword);
          await this.app.presentAlert('OK!', 'Password has been changed', 'successAlert')
        } catch (error) {
          console.log(error);
          await this.app.presentAlert('Sorry!', 'Your Current Password is not correct!', 'errorAlert')
        }
      } else {
        await this.app.presentAlert('Sorry!', 'New Password Doesnt Match!', 'errorAlert')
      }
      await this.app.dismissLoading();

    } else {
      await this.app.presentAlert('Sorry!', 'Please fill the required fields', 'errorAlert')
      await this.app.dismissLoading();

    }
  }
}
