import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.css']
})
export class WorksComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private workService: WorkService) {
    this.getWorks()
    this.filters.name = ''
  }

  private userRole: string;
  canEdit$ = this.checkRole();
  familyMembers = []
  capped = false
  skip = 0
  limit = 12
  works = []
  filters = {
    name: '.',
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


  async getWorks() {
    this.workService.works({
      filters: {
        name: { $regex: this.filters['name'].toLowerCase(), $options: 'i' },
        authors: this.filters['authors']
      }
    }).subscribe({
      next: (data) => this.works = data
    }
    )
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

  downloadMore() {
    this.skip = this.skip < 1 ? this.limit : this.skip + 4
    this.limit = 4

    if (this.capped) {
      this.toggle('.capped')
      return
    }

    this.workService.works({
      filters:
      {
        name: { $regex: this.filters['name'].toLowerCase(), $options: 'i' },
        authors: this.filters['authors']
      },
      skip: this.skip,
      limit: this.limit
    }).subscribe(data => {
      for(let item of data){
        this.works.push(item)
      }

      if (data.length < 4) {
        this.capped = true
        this.toggle('.capped')
      }
    })
  }

  toggle(name: string) {
    const alert = document.querySelector(name) as HTMLElement

    alert.style.visibility = alert.style.visibility == 'hidden' ? 'visible' : 'hidden'
  }

  closeAlert(){
    const window = document.querySelector('#pending-request') as HTMLElement

    window.style.visibility = 'hidden'
  }

  requestExists(work: string, id: string, item: Object, locked: Boolean){
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

  authorFilter(id: string) {
    this.filters['authors'] = id

    this.getWorks()
  }

  async checkRole() {
    const Role = this.authService.getRole();

    await Role.then(data => {
      this.userRole = data['role']
    })

    return (['Admin', 'Family Member'].includes(this.userRole))
  }

  ngOnInit(): void {
    this.authService.familyMembers().subscribe(data => {
      this.familyMembers = data.family
    })
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  userLogged = this.authService.loggedIn();

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
