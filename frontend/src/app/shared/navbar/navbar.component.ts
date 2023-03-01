import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public active: boolean = false

  public activebtn: boolean = false

  constructor(public authService: AuthService, private router: Router) { }
  
  isLoaded = false

  navbarfixed: boolean = false;

  @HostListener('window:scroll', ['$event']) onscrollm(){
    if(window.scrollY > 0){
      this.navbarfixed = true;
    }
    else {
      this.navbarfixed = false;
    }
  }

  ngOnInit() {
    
  }
 
  setActive() : void {
    this.active = !this.active
  }

  setActive2() : void {
    this.activebtn = !this.activebtn
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  userRole() {
    return localStorage.getItem('role')
  }

  avatar(){
    return localStorage.getItem('avatar')
  }

  userLogged = this.authService.loggedIn();



  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
