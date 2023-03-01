import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  ngOnInit(): void {
    this.isUser()
  }

  constructor(private authService: AuthService) { }

  private token = this.authService.getToken()


  request = {
    name: '',
    type: 'email',
    email: '',
    item: 'none',
    purpose: 'message',
    description: '',
  }

  email = {
    subject: '',
    content: '',
    to: '"Shikhman" "<shikhmansfamily@gmail.com>"'
  }

  async isUser() {
    if (this.token) {

      const message = document.querySelector("h5") as HTMLElement

      this.authService.getUser().subscribe(user => {
        this.request.name = user.name
        this.request.email = user.email


        if (user.banned) {
          this.request.type = 'appeal'
          message.innerHTML = "You are banned: " + user.banned
        } else {
          this.request.type = 'email'
        }

      })
    }
  }


  async sendMessage() {
    const box = document.querySelector(".form-container") as HTMLElement;
    const success = document.querySelector(".message-sent") as HTMLElement;

    if (this.request.type == 'appeal') {

      this.authService.requestAccess(this.request).subscribe(data => { },
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            const message = document.querySelector("#message-status") as HTMLElement;
            message.innerHTML = "Your appeal is still under review. Please wait for a reply before sending another one"
          }
        })
      success.style.display = "flex"
      box.style.display = "none"

    } else {
      this.email.subject = `${this.request.name} (${this.request.email}) sent a message`
      this.email.content = this.request.description

      this.authService.sendEmail(this.email).subscribe(data => {
        console.log("email sent")
      })
      success.style.display = "flex"
      box.style.display = "none"
    }
  }
}

