import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private baseUrl:string ='https://localhost:7043/api/User/'
  constructor(private _http:HttpClient) { }

  sendResetPasswordLink(email:string){
    return this._http.post(`${this.baseUrl}send-rest-email/${email}`,{});
  }

  resetPassword(resetPasswordObj:ResetPassword){
    return this._http.post(`${this.baseUrl}reset-password`,resetPasswordObj);
  }
}
