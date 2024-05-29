import { TokenApiModel } from './../models/token-api.model';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private _auth:AuthService,private _router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this._auth.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${myToken}`}
      })
    }

    return next.handle(request).pipe(
      catchError((err:any)=> {
        if (err instanceof HttpErrorResponse){
          if(err.status == 401) {
            // console.log("token is expired. login again")
            // this._router.navigate(['login']);

            //handle
            return this.handleUnAuthorizeError(request,next)
          }
        }
        return throwError(()=> new Error("Some other error occur"));
      })
    );
  }

  handleUnAuthorizeError(req: HttpRequest<any>, next: HttpHandler) {

    let tokenApiModel = new TokenApiModel();

    tokenApiModel.accessToken = this._auth.getToken()!;
    tokenApiModel.refreshToken = this._auth.getRefreshToken()!;

    return this._auth.renewToken(tokenApiModel).pipe(
      switchMap((data:TokenApiModel) => {
        this._auth.storeRefreshToken(data.refreshToken);
        this._auth.storeToken(data.accessToken);
        req = req.clone({
          setHeaders: {Authorization:`Bearer ${data.accessToken}`}
        })
        return next.handle(req)
      }),
      catchError((err)=> {
        return throwError(()=> {
            console.log("token is expired. login again")
            this._router.navigate(['login']);
        })
      })
    )

  }
}
