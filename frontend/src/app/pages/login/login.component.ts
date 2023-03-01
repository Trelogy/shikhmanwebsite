import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    name: '',
    email: '',
    password: '',
    google: false
  };

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    window.sessionStorage.clear()

    if(this.authService.loggedIn()){
      this.router.navigate(['Profile'])
    }
  }

  visiblePassword = false

  togglePassword(){
    const icon = document.querySelector("#pass-icon") as HTMLImageElement
    const passField = document.querySelector("#password") as HTMLInputElement

    this.visiblePassword = !this.visiblePassword
    
    passField.type = this.visiblePassword ? "text" : "password"
    icon.src = `./assets/img/visiblePass-${this.visiblePassword}.svg`
  }

  logIn() {
    if (this.checkForm()) {
      this.user.email = this.user.email.toLowerCase()
      this.authService.logInUser(this.user)
        .subscribe(
          res => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('avatar', res.avatar);

            this.authService.getRole().then(role => {
              localStorage.setItem('role', role.role)
            }).catch(err => { })

            this.router.navigate(['/Profile']);
            

          }, err => {
            if (err) {
              if (err.status == 403) {
                const window = document.querySelector(".no-access") as HTMLElement;
                window.style.display = "flex";
                localStorage.setItem('token', err.error.token)
                localStorage.setItem('avatar', err.error.avatar)
              }

              const nameField = document.querySelector("#iname") as HTMLElement;
              if (err.status == 401) {
                nameField.innerHTML = "email doesn't exist"
                nameField.style.display = "block"
              } else {
                nameField.style.display = "none"
              }

              const passField = document.querySelector("#ipass") as HTMLElement;
              if (err.status == 409) {
                passField.innerHTML = "Wrong password"
                passField.style.display = "block"
              }
            }
          }
        )
    }
  }

  checkForm() {
    let isValid = true

    const nameField = document.querySelector("#iname") as HTMLElement;
    if (!this.user.email || !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.user.email))) {
      nameField.innerHTML = "Enter a valid email"
      nameField.style.display = "block"
      isValid = false
    }else{
      nameField.style.display = "none"
    }

    const passField = document.querySelector("#ipass") as HTMLElement;
    if (!this.user.password) {
      passField.innerHTML = "Enter a valid password"
      passField.style.display = "Block"
      isValid = false
    } else if (this.user.password.length < 8 || this.user.password.length > 20) {
      passField.innerHTML = "Password must be between 8 and 20 characters"
      passField.style.display = "block"
      isValid = false
    } else{
      passField.style.display = "none"
    }

    return isValid
  }

  closeWindow() {
    const box = document.querySelector(".no-access") as HTMLElement;
    window.localStorage.clear()
    box.style.display = "none";
  }


}