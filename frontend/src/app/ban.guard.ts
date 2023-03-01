import { Injectable } from '@angular/core';
import { CanActivateChild, Router} from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BanGuard implements CanActivateChild {

  constructor(private authService: AuthService, private router: Router) { }

  async canActivateChild() {

    if (!window.localStorage.getItem('token')){
      return true
    }

    let isBanned: String;
    await this.authService.isBanned().then(data => {
      isBanned = data.banned
    })

    if (isBanned) {
      window.alert("Your account has been banned")
      window.localStorage.clear()
      this.router.navigate(['login'])
      return false
    }
    return true
  }

}
