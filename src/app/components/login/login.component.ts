import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
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
  resetPasswordEmail!:string;
  public isValidEmail!:boolean;

  constructor(private _auth:AuthService, private fb:FormBuilder,private _router : Router, private _userStore:UserStoreService,private _resetPassword:ResetPasswordService) {}

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
          // this._auth.storeToken(res.token);
          this._auth.storeToken(res.accessToken);
          this._auth.storeRefreshToken(res.refreshToken)
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

  checkValidEmail(event:string){
    const value = event;
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    const buttonRef = document.getElementById("closeButton");

    if (this.checkValidEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);

      this._resetPassword.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
        next:(res:any) => {
          this.resetPasswordEmail="";
          buttonRef?.click();
        },
        error:(err:any) => {
          console.log(err)
        }
      })
    }
  }
}
