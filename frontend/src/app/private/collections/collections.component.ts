import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CollectionService } from 'src/app/services/collection.service';

function collectionPage() {
  window.alert("Su puta madre angular");
}
@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  collectionlink() {
    window.location.href = "Collection";
  }

  constructor(public authService: AuthService, private router: Router, private collectionService: CollectionService) { }


  private userRole: string;
  canEdit$ = this.checkRole()
  familyMembers = []

  async checkRole() {
    const Role = this.authService.getRole();
    await Role.then(data => {
      this.userRole = data['role']
    })
    return (['Admin', 'Family Member'].includes(this.userRole))
  }

  collections = []
  filters = {
    name: '.'
  }
  capped = false
  skip = 0
  limit = 12

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

  authorFilter(id: string) {
    this.filters['authors'] = id

    this.getCollections()
  }

  async getCollections() {
    this.collectionService.collections({
      filters:
      {
        name: { $regex: this.filters['name'].toLowerCase(), $options: 'i' },
        authors: this.filters['authors']
      },
      skip: 0,
      limit: this.limit
    }).subscribe(data => {
      this.collections = data
      this.limit = 12
    })
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

  downloadMore() {
    this.skip = this.skip < 1 ? this.limit : this.skip + 4
    this.limit = 4
    
    if (this.capped) {
      this.toggle('.capped')
      return
    }

    this.collectionService.collections({
      filters:
      {
        name: { $regex: this.filters['name'].toLowerCase(), $options: 'i' },
        authors: this.filters['authors']
      },
      skip: this.skip,
      limit: this.limit
    }).subscribe(data => {
      for(let item of data){
        this.collections.push(item)
      }

      if (data.length < 4) {
        this.capped = true
        this.toggle('.capped')
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

  toggle(name) {
    const alert = document.querySelector(name) as HTMLElement

    alert.style.visibility = alert.style.visibility == 'hidden' ? 'visible' : 'hidden'
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
    this.getCollections()
    this.authService.familyMembers().subscribe(data => {
      this.familyMembers = data.family
    })
    this.filters.name = ''
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

