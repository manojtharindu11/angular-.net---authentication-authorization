import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.Validator';
import ValidateForm from 'src/app/helpers/validateForm';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb: FormBuilder,private _activatedRoute:ActivatedRoute,private _resetService: ResetPasswordService,private _router:Router) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    }, {
      validators: ConfirmPasswordValidator('password', 'confirmPassword')
    });

    this._activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code']
      this.emailToken = uriToken.replace(/ /g,'+');
      console.log(this.emailToReset)
      console.log(this.emailToken);
    })
  }

  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this._resetService.resetPassword(this.resetPasswordObj).subscribe({
        next: (res:any) => {
          console.log(res);
          this._router.navigate(['/']);
        },
        error: (err:any) => {
          console.log(err);
        }
      })
    } else {
      ValidateForm.validateAllFormField(this.resetPasswordForm);
    }
  }
}
