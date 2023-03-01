import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleApiService, userInfo } from 'src/app/services/google-api.service';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {

  file: File;
  userInfo?: userInfo
  userExists = true;
  needsLinking = false;
  imageURL: string;

  user = {
    name: '',
    lastName: '',
    password: Math.floor(Math.random()*10e20).toString(),
    email: '',
    role: 'Guest',
    banned: '',
    google: ''
  }



  visiblePassword = false

  togglePassword() {
    const icon = document.querySelector("#pass-icon") as HTMLImageElement
    const passField = document.querySelector("#password") as HTMLInputElement

    this.visiblePassword = !this.visiblePassword

    passField.type = this.visiblePassword ? "text" : "password"
    icon.src = `./assets/img/visiblePass-${this.visiblePassword}.svg`
  }



  constructor(private readonly google: GoogleApiService, public authService: AuthService, private router: Router, private http: HttpClient) {
    google.userProfileSubject.subscribe(data => {
      this.userInfo = data
      this.fillForm()
      this.imageURL = data.info.picture.slice(0,-6)

      this.authService.googleLogin(data.info).subscribe(user => {
        this.user.google = data.info.sub
        if (user.exists || user.linked ) {

          if (user.linked) {
            this.user.email = user.email
            this.logIn()
          } else {
            this.linkUser.email = data.info.email
            this.needsLinking = true
          }

        } else {
          this.user.google = data.info.sub
          this.userExists = false
        }
      })
    })
  }

  onFileSelect(event) {
    if (event.target.files) {

      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(event.target.files[0].type)) {
        window.alert("Invalid file type")
        return
      }
      this.file = event.target.files[0];
      var image = new FileReader();

      image.readAsDataURL(event.target.files[0]);
      image.onload = (event: any) => {
        this.imageURL = event.target.result
      }
    }
  }

  linkUser = {
    email: '',
    password: '',
    sub: 'this.user'
  }

  linkAccount() {
    this.linkUser.sub = this.userInfo.info.sub
    const passError = document.querySelector('.confirmPass') as HTMLElement

    this.authService.googleLink(this.linkUser).subscribe({

      next: (user) => {
        this.user.email = this.linkUser.email
      },

      error: (err) => {
        if(err.status === 409){
          passError.style.display = 'block'
        }
        console.log(err)
      },

      complete: () => this.logIn()
    })
  }


  //
  logIn() {
    
    this.authService.logInUser(this.user).subscribe({

      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('avatar', res.avatar)
      },


      error: (err) => {
        localStorage.setItem('avatar', './assets/img/default-avatar.svg')
        window.localStorage.setItem('token', err.error.token)
        window.localStorage.setItem('avatar', err.error.avatar)

        this.router.navigate(['Contact-Us'])
      },


      complete: () => {
        this.authService.getRole().then(user => {
          localStorage.setItem('role', user.role)

          if (['Guest', 'Guest with access'].includes(user.role)) {
            this.router.navigate(['']);
          } else {
            this.router.navigate(['/Profile']);
          }
        }
        )
      }
    })
  }

  async fillForm() {
    this.user.name = this.userInfo.info.given_name
    this.user.lastName = this.userInfo.info.family_name
    this.user.email = this.userInfo.info.email
  }

  test() {
    this.user.name = this.userInfo.info.given_name;
    this.user.lastName = this.userInfo.info.family_name
    this.user.password = "google"
    this.user.email = this.userInfo.info.email
  }

  isLoggedIn() {
    return this.google.isLogged()
  }

  logOut() {
    return this.google.logOut()
  }

  checkForm() {
    const nameField = document.querySelector('#iname') as HTMLElement;
    const name = document.querySelector('#name') as HTMLInputElement;
    const lnameField = document.querySelector('#ilname') as HTMLElement;
    const lastname = document.querySelector('#lastName') as HTMLInputElement;
    const test = document.querySelector('test') as HTMLImageElement

    let isValid = true


    if (!this.user.name || !(/^[A-Za-z ]+$/.test(this.user.name))) {
      nameField.style.display = "block"
      isValid = false
    } else {
      nameField.style.display = "none"
    }

    if (!this.user.lastName || !(/^[A-Za-z ]+$/.test(this.user.lastName))) {
      lnameField.style.display = "block"
      isValid = false
    } else {
      lnameField.style.display = "none"
    }

    return isValid
  }


  signUp() {
    const emailField = document.querySelector('#iemail') as HTMLElement;

    if (this.checkForm()) {
      this.user.email = this.user.email.toLowerCase()

      this.authService.signUpUser(this.user)
        .subscribe(
          res => {
            localStorage.setItem('token', res.token);

            if (!this.file) {
              this.authService.googleAvatar(this.imageURL).subscribe(data => {
                localStorage.setItem('avatar', data['url'])
              })

            } else {
              this.authService.uploadAvatar(this.file).subscribe(data => {
                this.authService.getAvatar().subscribe(user => {
                  localStorage.setItem('avatar', user['avatar'])
                })
              })
            }

            this.router.navigate([''])
          }

        )
      window.sessionStorage.clear()
    }
  }


  ngOnInit(): void {
  }
}
