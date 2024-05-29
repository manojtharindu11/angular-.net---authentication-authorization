import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  type:string = 'password';
  isText:boolean = false;
  eyeIcon:string = 'fa-eye-slash'
  loginForm!: FormGroup;

  constructor(private _auth:AuthService, private fb:FormBuilder,private _router : Router, private _userStore:UserStoreService) {}

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        username: ['',Validators.required],
        password: ['',Validators.required]
      })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText? this.type = 'text' : this.type = 'password';
  }

  onLogin() {
    if (this.loginForm.valid) {
      this._auth.login(this.loginForm.value).subscribe({
        next: (res:any) => {
          this._auth.storeToken(res.token);
          const tokenPayload = this._auth.decodedToken();
          this._userStore.setFullNameForStore(tokenPayload.unique_name);
          this._userStore.setRoleForStore(tokenPayload.role);
          console.log(res);
          this.loginForm.reset();
          this._router.navigate(['dashboard']);
        },
        error: (err:any) => {
          console.log(err);
        }
      })
    } else {
      console.log("Form is not valid.")
    }
  }

  private validateAllFormFields(formGroup:FormGroup) {

  }
}
