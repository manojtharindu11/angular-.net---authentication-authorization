import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = "https://localhost:7043/api/User/"
  constructor(private _http: HttpClient, private _router: Router) { }

  signUp(userObj:any) {
    return this._http.post<any>(`${this.baseUrl}register`,userObj);
  }

  login(loginObj:any) {
    return this._http.post<any>(`${this.baseUrl}authenticate`,loginObj);
  }

  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn():boolean {
    return !!localStorage.getItem('token');
  }

  signOut() {
    localStorage.clear();
    this._router.navigate(['login']);
  }
}
