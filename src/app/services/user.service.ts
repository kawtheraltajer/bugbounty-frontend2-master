import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { AuthService } from '../auth/auth.service';
import { Employee } from '../interfaces/types';
@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private auth: AuthService, public http: HttpClient) { }


  getProfilePicURL(pic: string) {
    if (pic && pic != '' && pic != 'null') {
      return `${environment.storageURL}/public/uploads/images/${pic}`;
    } else {
      return 'assets/fillers/profile-temp.png';
    }
  }
  async changeProfilePicture(userID: number, img) {
    let formData = new FormData();
    formData.append('image', img, img.name);
    formData.append('userID', String(userID));
    return await this.http.post<{ isUploaded: boolean }>(`${environment.apiUrl}/storage/changeProfilePicture`, formData).toPromise();
  }

  /* async uploadPicture(img) {
    let formData = new FormData();
    formData.append('image', img, img.name);
    return await this.http.post<{
      "fieldname": string,
      "originalname": string,
      "encoding": string,
      "mimetype": string,
      "destination": string,
      "filename": string,
      "path": string,
      "size": number
    }>(`${environment.storageURL}/storage/uploadProfilePicture`, formData).toPromise();
  }*/
  async uploadPicture(img) {
    let formData = new FormData();
    formData.append('File', img, img.name);
    return await this.http.post<{
      "fieldname": string,
      "originalname": string,
      "encoding": string,
      "mimetype": string,
      "destination": string,
      "filename": string,
      "path": string,
      "size": number
    }>(`${environment.apiUrl}/storage/uploadProfilePicture`, formData).toPromise();
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return await this.http.post<{ ok: boolean }>(`${environment.apiUrl}/auth/changePassword`, { oldPassword, newPassword }).toPromise();
  }

  async updateMe(data: { first_name: string, last_name: string, bio: string, pictureURL: string }) {
    return await this.http.post<{ ok: boolean }>(`${environment.apiUrl}/user/updateMe`, data).toPromise();
  }

  // !Employee
  async getEmployees() {
    return await this.http.get<Employee[]>(`${environment.apiUrl}/user/allEmployees`).toPromise();
  }

  async changeUserPassword(userID: number,newPassword: string) {
    return await this.http.post<{ ok: boolean }>(`${environment.apiUrl}/auth/changeUserPassword`, { userID ,newPassword }).toPromise();
  }
}
