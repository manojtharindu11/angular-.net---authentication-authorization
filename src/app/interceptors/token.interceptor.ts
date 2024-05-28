import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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
            console.log("token is expired. login again")
            this._router.navigate(['login']);
          }
        }
        return throwError(()=> new Error("Some other error occur"));
      })
    );
  }
}
