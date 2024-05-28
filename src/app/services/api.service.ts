import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl:string = "https://localhost:7043/api/User/"

  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get<any>(`${this.baseUrl}`);
  }
}
