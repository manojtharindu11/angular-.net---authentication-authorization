import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users:any[] = [];

  constructor(private _auth:AuthService,private _api:ApiService) {}

  ngOnInit(): void {
      this._api.getUsers().subscribe({
        next: res => this.users = res
      })
  }

  signOut() {
    this._auth.signOut();
  }
}
