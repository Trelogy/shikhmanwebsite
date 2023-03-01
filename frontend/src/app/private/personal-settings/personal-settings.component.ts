import { HttpErrorResponse } from '@angular/common/http';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/photos.service';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-personal-settings',
  templateUrl: './personal-settings.component.html',
  styleUrls: ['./personal-settings.component.css']
})
export class PersonalSettingsComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  originalFile: File
  changingAvatar: Boolean

  fileChangeEvent(event: any, avatar: Boolean): void {
    this.imageChangedEvent = event;
    this.originalFile = event.target.files[0]
    this.changingAvatar = avatar
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64
    const file = new File([base64ToFile(event.base64)], this.originalFile.name, { type: this.originalFile.type })

    if (this.changingAvatar) {
      this.file = file
    } else {
      this.banner = file
    }
  }
  imageLoaded() {
    const cropper = document.querySelector('.no-access1') as HTMLElement

    cropper.style.display = 'flex'
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  closePop(){
    const closing = document.querySelector(".no-access1") as HTMLElement;

    closing.style.display="none";
  }

  setAvatar() {
    if (this.changingAvatar) {
      this.imageURL = this.croppedImage
    } else {
      this.uploadBanner()
      return
    }
    const cropperWindow = document.querySelector('.no-access1') as HTMLElement

    cropperWindow.style.display = 'none'
  }


  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

  public profile;
  isLoaded = false

  user = {
    name: '',
    email: '',
    lastName: '',
    password: '',
    role: '',
    banner: ''
  }

  visiblePassword = false

  file: File;
  imageURL = localStorage.getItem('avatar')
  banner: File;
  bannerURL = ''

  togglePassword(){
    const icon = document.querySelector("#pass-icon") as HTMLImageElement
    const passField = document.querySelector("#password") as HTMLInputElement

    this.visiblePassword = !this.visiblePassword
    
    passField.type = this.visiblePassword ? "text" : "password"
    icon.src = `./assets/img/visiblePass-${this.visiblePassword}.svg`
  }

  uploadBanner() {
    this.authService.uploadBanner(this.banner).subscribe({
      complete: () => this.router.navigate(['Profile'])
    })
  }

  updateuser() {

    let changes = {}
    let validFields = [true, true, true, true]

    //Name check
    const invalidName = document.querySelector('#iname') as HTMLElement
    if (this.user.name) {
      if (/^[A-Za-z ]+$/.test(this.user.name)) {

        changes['name'] = this.user.name
        validFields[0] = true
        invalidName.style.display = "none"

      } else {
        invalidName.style.display = "block"
        validFields[0] = false
      }
    } else {
      validFields[0] = true
      invalidName.style.display = "none"
    }

    //Last Name check
    const invalidLname = document.querySelector('#ilname') as HTMLElement
    if (this.user.lastName) {
      if (/^[A-Za-z ]+$/.test(this.user.lastName)) {

        changes['lastName'] = this.user.lastName
        invalidLname.style.display = "none"
        validFields[1] = true

      } else {
        invalidLname.style.display = "block"
        validFields[1] = false
      }
    } else {
      validFields[1] = true
      invalidLname.style.display = "none"
    }

    //Password check
    const invalidPassword = document.querySelector('#ipass') as HTMLElement
    if (this.user.password) {
      if (this.user.password.length >= 8 && this.user.password.length <= 20) {

        changes['password'] = this.user.password
        invalidPassword.style.display = "none"
        validFields[2] = true

      } else {
        invalidPassword.style.display = "block"
        validFields[2] = false
      }
    } else {
      validFields[2] = true
      invalidPassword.style.display = "none"
    }

    //email check
    const invalidEmail = document.querySelector("#iemail") as HTMLElement
    if (this.user.email) {
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.user.email)) {

        changes['email'] = this.user.email
        invalidEmail.style.display = "none"
        validFields[3] = true

      } else {
        invalidEmail.style.display = "block"
        validFields[3] = false
      }
    } else {
      validFields[3] = true
      invalidEmail.style.display = "none"
    }


    //Avatar Check
    if (this.file) {
      changes['file'] = true
    }

    //Apply changes (if any)
    const changedFields = Object.keys(changes).length
    const allFieldsValid = validFields.every(field => field)

    if (changedFields && allFieldsValid) {
      this.authService.updateUser(changes).subscribe(data => {

        if (changes['file']) {
          this.authService.uploadAvatar(this.file).subscribe(user => {
            localStorage.setItem('avatar', this.imageURL)
          })
        }

        window.alert("Profile updated.")
        this.router.navigate([''])

      }, err => {
        invalidEmail.style.display = "block"
        invalidEmail.innerHTML = "email already exists"
      })
    }
  }

  deleteAccount() {
    const confirmWindow = document.querySelector(".ban-box1") as HTMLElement
    confirmWindow.style.display = "flex"
  }

  confirmDelete() {
    this.authService.deleteUser().subscribe(result => {
      window.alert("Account deleted")
      localStorage.clear()
      this.router.navigate([''])
    })
  }

  closeWindow() {
    const confirmWindow = document.querySelector(".ban-box1") as HTMLElement
    confirmWindow.style.display = "none"
  }

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (data) => {
        this.user = data
      }

    })
    this.loggedIn();
  }
  
  loggedIn() {
    return !!localStorage.getItem('token');
  }
}