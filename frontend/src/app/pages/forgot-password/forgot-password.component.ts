import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

  userId = ''
  emailAddress = ''
  isLoaded = false
  recovery = false

  isRecovery() {

    this.authService.recoverPassword(this.activatedRoute.snapshot.params['id']).subscribe({

      next: (data) => {
        this.userId = data.user
        this.recovery = true
        this.isLoaded = true
      },
      error: (err: HttpErrorResponse) => {
        this.isLoaded = true
      },
    })

  }

  forgotPassword() {

    const invalidEmail = !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.emailAddress))
    const errorMessage = document.querySelector('#iemail') as HTMLElement

    if (!this.emailAddress) {
      errorMessage.innerHTML = "Enter a valid email"
      errorMessage.style.display = "block"
      return
    }

    if (invalidEmail) {
      errorMessage.innerHTML = "Enter a valid email"
      errorMessage.style.display = "block"
      return
    }

    recoveryId: String;
    let email = {
      to: '',
      subject: 'Password Recovery',
      content: 'this is a test'
    }

    this.authService.forgotPassword(this.emailAddress).subscribe({
      next: (data) => {
        email.to = `"${data.user.name} ${data.user.lastName}" "<${data.user.email}>"`
        email.content = `Hello ${data.user.name}.<br><br>
                         Click the following link to reset your password:<br>
                         http://shikhman.org/Recover-Password/${data.request._id}<br><br>
                         this link will expire after 10 minutes`
        this.authService.sendEmail(email).subscribe(done => {})
      },

      error: (err) => window.alert(err.error.message),

      complete: () => {
        window.alert("Recovery email sent. Check your inbox")
        this.router.navigate([''])
      }
    })

    errorMessage.style.display = "none"
  }

  password = {
    newPass: '',
    confirm: '',
  }


  changePassword() {
    const newPass = document.querySelector('#ipass') as HTMLElement
    const confPass = document.querySelector('#iconfirm') as HTMLElement
    let isValid = true

    if (!this.password.newPass || this.password.newPass.length < 8 || this.password.newPass.length > 20) {
      newPass.style.display = "block"
      isValid = false
    } else {
      newPass.style.display = "none"
    }

    if (this.password.newPass != this.password.confirm) {
      confPass.style.display = "block"
      isValid = false
    } else {
      confPass.style.display = "none"
    }

    if (isValid) {
      this.authService.resetPassword({ id: this.userId, password: this.password.newPass }).subscribe({
        complete: () => {
          window.alert("Password successfully changed. You may now use it to log in")
          this.router.navigate(['login'])
        }
      })
    }
  }

  visiblePassword = [false, false]
  togglePassword(i){
    const icon = document.querySelector(`.icon${i}`) as HTMLImageElement
    const passField = document.querySelector(`.pass${i}`) as HTMLInputElement

    this.visiblePassword[i] = !this.visiblePassword[i]
    
    passField.type = this.visiblePassword[i] ? "text" : "password"
    icon.src = `./assets/img/visiblePass-${this.visiblePassword[i]}.svg`
  }

  ngOnInit(): void {
    this.isRecovery()
  }

}
