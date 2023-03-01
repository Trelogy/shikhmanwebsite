import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignUpComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  file: File;
  imageURL = "./assets/img/upload.png"


  user = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Guest',
    banned: '',
    avatar: false
  };

  visiblePassword = false

  ngOnInit() {
    window.sessionStorage.clear()
  }

  onFileSelect(event) {
    if (event.target.files) {

      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/heic'].includes(event.target.files[0].type)) {
        window.alert("Invalid file type")
        return
      }
      
      this.file = event.target.files[0];
      var image = new FileReader();
      this.user.avatar = true

      image.readAsDataURL(event.target.files[0]);
      image.onload = (event: any) => {
        this.imageURL = event.target.result
      }
    }
  }

  togglePassword(){
    const icon = document.querySelector("#pass-icon") as HTMLImageElement
    const passField = document.querySelector("#password") as HTMLInputElement

    this.visiblePassword = !this.visiblePassword
    
    passField.type = this.visiblePassword ? "text" : "password"
    icon.src = `./assets/img/visiblePass-${this.visiblePassword}.svg`
  }


  signUp() {
    const emailField = document.querySelector('#iemail') as HTMLElement;

    if (this.checkForm()) {
      this.user.email = this.user.email.toLowerCase()


      this.authService.signUpUser(this.user)
        .subscribe(
          res => {
            localStorage.setItem('token', res.token);

            if (this.file) {

              this.authService.uploadAvatar(this.file).subscribe(data => {
                this.authService.getAvatar().subscribe(user => {
                  localStorage.setItem('avatar', user['avatar'])
                })
              })
            }

            this.authService.getRole().then(role => {
              localStorage.setItem('role', role.role)
            })

            localStorage.setItem('avatar', res.avatar)
            this.router.navigate([''])
          },
          err => {
            if (err.status == 401) {
              emailField.innerHTML = "Email already exists"
              emailField.style.display = "block"
            }
          }
        )
    }
  }

  checkForm() {
    const nameField = document.querySelector('#iname') as HTMLElement;
    const name = document.querySelector('#name') as HTMLInputElement;
    const lnameField = document.querySelector('#ilname') as HTMLElement;
    const lastname = document.querySelector('#lastName') as HTMLInputElement;
    const emailField = document.querySelector('#iemail') as HTMLElement;
    const email = document.querySelector('#email') as HTMLInputElement;
    const passField = document.querySelector('#ipass') as HTMLElement;

    let isValid = true


    if (!this.user.name || !(/^[A-Za-z ]+$/.test(this.user.name))) {
      nameField.style.display = "block"
      isValid = false
    } else {
      nameField.style.display = "none"
    }

    if (!this.user.lastName || !(/^[A-Za-z ]+$/.test(lastname.value))) {
      lnameField.style.display = "block"
      isValid = false
    } else {
      lnameField.style.display = "none"
    }

    if (!this.user.email || !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value))) {
      emailField.innerHTML = "Enter a valid email"
      emailField.style.display = "block"
      isValid = false
    } else {
      emailField.style.display = "none"
    }

    if (!this.user.password) {
      passField.innerHTML = "Enter a valid password"
      passField.style.display = "block"
      isValid = false
    } else if (this.user.password.length < 8 || this.user.password.length > 20) {
      passField.innerHTML = "Password must be between 8 and 20 characters"
      passField.style.display = "block"
      isValid = false
    } else {
      passField.style.display = "none"
    }

    return isValid
  }

}