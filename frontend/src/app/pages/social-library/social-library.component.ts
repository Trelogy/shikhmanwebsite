import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-social-library',
  templateUrl: './social-library.component.html',
  styleUrls: ['./social-library.component.css']
})
export class SocialLibraryComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  user = {
    role: '',
    _id: '',
    name: '',
    lastName: '',
  }

  public members = []


  socialMedia = [
    { name: 'Facebook', link: '', placeholder: 'Facebook profile link' },
    { name: 'Instagram', link: 'https://instagram.com/', placeholder: 'Instagram username' },
    { name: 'Twitter', link: 'https://twitter.com/', placeholder: 'Twitter username' },
    { name: 'YouTube', link: '', placeholder: 'Youtube channel link' },
    { name: 'Skype', link: null, placeholder: 'Skype username' },
    { name: 'Quora', link: '', placeholder: 'Quora profile link' },
    { name: 'Snapchat', link: null, placeholder: 'Snapchat username' },
    { name: 'TikTok', link: 'https://tiktok.com/@', placeholder: 'TikTok username' },
    { name: 'Telegram', link: null, placeholder: 'Telegram number' },
    { name: 'Linkedin', link: '', placeholder: 'LinkedIn profile link' },
    { name: 'Reddit', link: 'https://reddit.com/u/', placeholder: 'Reddit username' },
    { name: 'Product Hunt', link: 'https://producthunt.com/@', placeholder: 'Product Hunt username' },
    { name: 'Tumblr', link: 'https://tumblr.com/', placeholder: 'Tumblr username' },
    { name: 'Pinterest', link: 'https://pinterest.com/', placeholder: 'Pinterest username' },
    { name: 'Viber', link: null, placeholder: 'Viber number' },
    { name: 'WhatsApp', link: null, placeholder: 'WhatsApp number' },
    { name: 'Line', link: null, placeholder: 'Line number' },
    { name: 'Discord', link: null, placeholder: 'Discord username' },
    { name: 'Wikipedia', link: 'https://wikipedia.org/wiki/User:', placeholder: 'Wikipedia username' },
    { name: 'Vsco', link: 'https://vsco.com/', placeholder: 'Vsco username' }
  ]


  ngOnInit(): void {
    this.authService.getUser().subscribe(data => this.user = data)
    this.authService.library().subscribe(data => {
      for (let user of data) {
        this.members.push(user)
      }
    })
  }

  addMedia() {
    this.input = ''
    const socialWindow = document.querySelector(".site-select") as HTMLElement
    const cover = document.querySelector(".cover") as HTMLElement

    cover.style.visibility = "visible"
    socialWindow.style.visibility = "visible"
  }

  deleteMedia(siteIndex, accountIndex) {
    this.authService.delSocialMedia(siteIndex, accountIndex).subscribe(data => { })
    window.alert("Social media account deleted")
    window.location.reload()
  }

  needsLink: Boolean;

  changeAccount(site) {
    this.socialForm.site = site.name
    const socialSite = document.querySelector(".social-site") as HTMLElement
    const cover = document.querySelector(".cover") as HTMLElement
    const input = document.querySelector(".account-link") as HTMLInputElement
    this.siteLink = site.link


    this.needsLink = typeof site.link == 'string'
    input.placeholder = site.placeholder
    cover.style.visibility = "hidden"
    socialSite.innerHTML = site.name
  }

  socialForm = {
    site: '',
    link: '',
    user: ''
  }

  username = ''
  siteLink: ''
  input: string

  saveChanges() {
    this.closeWindow()
    this.input = this.input.replace(/@/g, '')
    if (this.needsLink) {
      this.username = this.input
      this.socialForm.link = `${this.siteLink}${this.input}`
      this.confirmUser()

    } else {
      this.socialForm.user = this.input.length > 0 ? this.input : this.username

      this.authService.addSocialMedia(this.socialForm).subscribe({
        complete: () => {
          window.location.reload()
        }
      }
      )
    }

  }

  confirmUser() {
    this.input = ''
    const formWindow = document.querySelector(".username-box") as HTMLElement
    this.needsLink = false

    formWindow.style.display = "flex"
  }

  closeWindow() {
    const socialWindow = document.querySelector(".ban-box") as HTMLElement
    const formWindow = document.querySelector(".username-box") as HTMLElement
    const cover = document.querySelector(".cover") as HTMLElement

    formWindow.style.display = "none"
    cover.style.visibility = "hidden"
    socialWindow.style.visibility = "hidden"
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