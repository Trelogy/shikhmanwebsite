import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
import { AuthService } from './auth.service'


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  private token = localStorage.getItem('token')

  intercept(req, next) {
    if (req.url.includes('localhost:4000')) {

      let tokenizeReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }

      })
      return next.handle(tokenizeReq);
    }
    return next.handle(req)
  }

}
