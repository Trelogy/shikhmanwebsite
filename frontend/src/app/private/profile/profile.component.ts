import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService, private workService: WorkService, private activatedRoute: ActivatedRoute, private router: Router) { }

  isLoaded = false
  public profile;
  editingRole = false
  works = []

  async getProfile() {
    this.authService.getProfile(this.activatedRoute.snapshot.params['id']).subscribe({

      next: (data) => {
        this.profile = data;
        this.workService.works({ filters: { authors: data._id } }).subscribe({
          next: (works) => this.works = works
        })
      },
      error: (err: HttpErrorResponse) => this.router.navigate(['/Shikhman']),

      complete: () => this.isLoaded = true
    })

  }

  edit(type: string) {
    const window = document.querySelector(`#change-${type}`) as HTMLElement

    window.style.display = "flex"
  }

  closePop(){
    const closing = document.querySelector(".no-access1") as HTMLElement;
    const closingit = document.querySelector(".no-access-pop") as HTMLElement;

    closing.style.display="none";
    closingit.style.display="none";
  }

  save(type: string) {
    this.authService.updateUser({ category: this.profile.category, description: this.profile.description }).subscribe({
      complete() {
        const window = document.querySelector(`#change-${type}`) as HTMLElement

        window.style.visibility = "hidden"
      },
    })
  }

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

  requestExists(work: string, id: string, item: Object, locked: Boolean) {
    this.authService.requestExists().subscribe({
      error: () => {
        const window = document.querySelector('#pending-request') as HTMLElement

        window.style.visibility = 'visible'
      },

      complete: () => {
        this.accessItem(work, id, item, locked)
      }
    })
  }

  closeAlert() {
    const window = document.querySelector('#pending-request') as HTMLElement

    window.style.visibility = 'hidden'
  }


  async accessItem(type: string, id: string, item: Object, locked: Boolean) {
    const requestWindow = document.querySelector(".no-access") as HTMLElement;
    let role: String;
    await this.authService.getRole().then(data => {
      role = data.role
      if (locked) {
        this.requestForm.item = item
        requestWindow.style.display = "flex";
      } else {
        this.router.navigate([`${type}/${id}`])
      }
    })
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


  ngOnInit() {
    this.getProfile()
    this.loggedIn();
  }

  userLogged = this.authService.loggedIn();

  loggedIn() {
    return !!localStorage.getItem('token');
  }
}