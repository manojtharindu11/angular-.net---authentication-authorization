import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users:any[] = [];
  fullName:string = "";
  role:string = ""

  constructor(private _auth:AuthService,private _api:ApiService,private _userStore:UserStoreService) {}

  ngOnInit(): void {
      this._api.getUsers().subscribe({
        next: res => this.users = res
      })

      this._userStore.getFullNameFromStore().subscribe(
        (val) => {
          const fullNameFromToken = this._auth.getFullNameFromToken();
          this.fullName = val || fullNameFromToken;
      });

      this._userStore.getRoleFromStore().subscribe(
        (val) => {
          const roleFromToken = this._auth.getRoleFromToken();
          this.role = val || roleFromToken;
        }
      )
  }

  signOut() {
    this._auth.signOut();
  }
}
