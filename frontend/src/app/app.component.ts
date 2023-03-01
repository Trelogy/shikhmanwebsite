import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
//import 'rxjs/add/operator/filter';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Subscription } from 'rxjs-compat/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  private _router: Subscription | undefined;
  @ViewChild(NavbarComponent)
  navbar!: NavbarComponent;

  constructor( private renderer : Renderer2, private router: Router, @Inject(DOCUMENT,) private document: any, private element : ElementRef, public location: Location) {}
  ngOnInit() {
      var navbar : HTMLElement = this.element.nativeElement.children[0].children[0];
      
      this.renderer.listen('window', 'scroll', (event) => {
          const number = window.scrollY;
          if (number > 0 || window.pageYOffset > 0) {
              // add logic
              navbar.classList.add('menu-fixed');
              navbar.classList.remove('nav-bar');
          } else {
              // remove logic
              navbar.classList.remove('menu-fixed');
              navbar.classList.add('nav-bar');
          }
      });  
  }

};
