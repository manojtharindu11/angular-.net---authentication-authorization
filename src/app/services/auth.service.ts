import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = "https://localhost:7043/api/User/"
  private userPayload:any;
  constructor(private _http: HttpClient, private _router: Router) { 
    this.userPayload = this.decodedToken();
  }

  signUp(userObj:any) {
    return this._http.post<any>(`${this.baseUrl}register`,userObj);
  }

  login(loginObj:any) {
    return this._http.post<any>(`${this.baseUrl}authenticate`,loginObj);
  }

  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue);
  }

  storeRefreshToken(tokenValue:string){
    localStorage.setItem('refreshToken',tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn():boolean {
    return !!localStorage.getItem('token');
  }

  signOut() {
    localStorage.clear();
    this._router.navigate(['login']);
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken(){
    if(this.userPayload)
      return this.userPayload.unique_name;
  }

  getRoleFromToken(){
    if(this.userPayload)
      return this.userPayload.role;
  }

  renewToken(tokenApi: TokenApiModel){
    return this._http.post<any>(`${this.baseUrl}refresh`,tokenApi);
  }
}
