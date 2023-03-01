import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CollectionService } from 'src/app/services/collection.service';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  focus: any;
  focus1: any;

  collectionlink() {
    window.location.href = "Collection";
  }

  constructor(private authService: AuthService, private router: Router, private collectionService: CollectionService, private workService: WorkService) { }

  familyMembers = []

  collections = this.collectionService.demoCollections()
  works = this.collectionService.demoWorks()

  requestForm = {
    user: localStorage.getItem('token'),
    name: '',
    type: 'access',
    email: '',
    organisation: '',
    item: {},
    purpose: '',
    description: ''
  }

  closeAlert(){
    const window = document.querySelector('#pending-request') as HTMLElement

    window.style.visibility = 'hidden'
  }

  async accessItem(type: string, id: string) {
      if (!this.authService.loggedIn()) {
        this.router.navigate(['Login'])
      } else {
        window.location.href = `${type}/${id}`
      }
  }


  showAnimation() {
    const animation = document.querySelector(".animationhome") as HTMLElement;


    animation.style.visibility = "visible";
  }

  requestAccess() {
    const lockWindow = document.querySelector(".no-access-box") as HTMLElement;
    const formWindow = document.querySelector(".request-access") as HTMLElement;

    lockWindow.style.visibility = "hidden";
    formWindow.style.display = "block"
  }

  closeWindow() {
    const window = document.querySelector(".no-access") as HTMLElement;
    const lockWindow = document.querySelector(".no-access-box") as HTMLElement;
    const formWindow = document.querySelector(".request-access") as HTMLElement;

    window.style.display = "none";
    lockWindow.style.visibility = "visible";
    formWindow.style.display = "none";
  }

  sendRequest() {
    this.authService.requestAccess(this.requestForm).subscribe(data => {
      this.closeWindow()
    }, (error: HttpErrorResponse) => {
      window.alert("Please fill the required fields")
      console.log(error)
    })

  }


  ngOnInit(): void {
    this.authService.familyMembers().subscribe(data =>{
      this.familyMembers = data.family
    })
  }

}
