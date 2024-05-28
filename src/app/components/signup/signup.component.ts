import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  type:string = 'password';
  isText:boolean = false;
  eyeIcon:string = 'fa-eye-slash'
  signUpForm!:FormGroup;

  constructor(private fb:FormBuilder, private _auth: AuthService, private _router: Router) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstname : ['',Validators.required],
      lastname : ['',Validators.required],
      email : ['',Validators.required],
      username: ['',Validators.required],
      password: ['',Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText? this.type = 'text' : this.type = 'password';
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value)
      this._auth.signUp(this.signUpForm.value).subscribe({
        next: (res:any) => {
          console.log(res)
          this.signUpForm.reset();
          this._router.navigate(["login"]);
        },
        error: (err:any) => {
          console.log(err);
        }
      })
    } else {
      ValidateForm.validateAllFormField(this.signUpForm);
      alert("Your form is invalid!")
    }
  }
}
