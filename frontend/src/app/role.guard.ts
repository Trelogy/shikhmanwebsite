import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route);
  }

  constructor(private authService: AuthService, private router: Router) { }

  private userRole: String;

  async isAuthorized(route: ActivatedRouteSnapshot): Promise<boolean> {
    const requiredRoles = route.data['requiredRoles'];
    const role = this.authService.getRole();
    let hasRole: boolean;

    await role.then(data => {
      this.userRole = data['role'];
    })

    if (requiredRoles[0] == 'restrict') {
      hasRole = !requiredRoles.includes(this.userRole)
    } else {
      hasRole = requiredRoles.includes(this.userRole)
    }

    if(hasRole){
      return true
    }else{
      this.router.navigate([''])
      return false
    }
    
  }
}
