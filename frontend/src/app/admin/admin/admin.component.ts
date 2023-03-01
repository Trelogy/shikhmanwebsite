import { Component, OnInit } from '@angular/core';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public users = [];
  public requests = [];
  public admin = '';

  constructor(private authService: AuthService) { }

  filter: String;
  radio: String;
  requestLimit = 2;
  userLimit = 23;

  moreRequests() {
    this.requestLimit += 5
  }

  moreUsers() {
    this.userLimit += 8
  }



  private accepted: boolean;
  private requestId: string;
  private user: string;
  private reqIndex: number;
  private appeal: false;

  email = {
    toUser: '',
    subject: '',
    content: ''
  }

  async rejectionForm(accepted, reqIndex, reqId, appeal?, user?, userEmail?) {
    var window = document.querySelector(".no-access") as HTMLElement;
    this.accepted = accepted
    this.user = user
    this.requestId = reqId
    this.reqIndex = reqIndex
    this.email.toUser = user

    if (accepted) {
      if (appeal) {
        this.banAccount(user, "Accept this user's appeal?");
        window.querySelector("textarea").innerHTML = ""
        return
      }
      window.querySelector("h1").innerHTML = "Accept Email:"
      this.email.content = "Dear Guest\n\nThank You for taking an interest in our Works/Collections.\n\nYour request for full access has been accepted!\n\nSincerely Shikhman Family."


    } else {
      window.querySelector("h1").innerHTML = "Rejection Email:"

      if (appeal) {
        this.email.content = "Dear User.\n\n We have decided to not lift your ban\n\n Sincerely. Shikhman family"
      } else {
        this.email.content = "Thank You for taking an interest in our Works/Collections\n\nUnfortunately, we can not accept your request for full access to our Works/Collections.\n\nSincerely Shikhman Family."
      }
    }



    window.style.display = "flex";
  }


  async sendButton() {
    let reqBoxes = document.querySelectorAll(".rejection")
    this.email.content = this.email.content.replace(/\n/g, '<br>')

    if (this.accepted) {
      if (this.appeal) {
        this.banAccount(this.user, '')
        this.email.subject = "Your ban has been lifted"
        this.email.content = "Dear user.\nYour ban has been lifted"
      } else {
        this.email.subject = "Access granted"
        await this.setRole(this.user, "Guest with access")
      }
      window.alert("Request accepted.")
    } else {
      this.email.subject = "Your request was rejected"
      window.alert("Request rejected. ")
    }

    reqBoxes[this.reqIndex].remove()

    this.email.toUser = this.user

    this.authService.sendEmail(this.email).subscribe(data => { console.log("Done") })

    this.authService.removeRequest(this.requestId).subscribe(data => {
      this.closeWindow()
    })
  }

  closeWindow() {
    var window = document.querySelector(".no-access") as HTMLElement;
    window.style.display = "none"
  }

  // Ban window // 
  private banned: boolean;
  banMemo = { id: '', text: '' }

  banAccount(id: string, banReason: string) {
    const window = document.querySelector(".banWindow") as HTMLElement
    const reason = document.querySelector(".banReason") as HTMLInputElement
    reason.value = banReason

    this.banned = reason.readOnly = banReason.length > 0 

    this.banMemo.id = id
    window.style.visibility = "visible"
  }

  confirmBan() {
    this.email.toUser = this.banMemo.id
    if (this.banned) {
      this.banMemo.text = ''
      this.email.subject = 'Your ban has been lifted'
      this.email.content = `Dear user\n\n Your ban has been lifted`

    } else if (!this.banned) {
      if (this.banMemo.text.length < 1) {
        this.banMemo.text = 'No reason specified'
      }

      this.email.subject = 'You have been banned'
      this.email.content = `Dear User.\n\nWe have decided to ban you for the following reason: ${this.banMemo.text}\n\n
      If you wish to appeal this ban click the button below and log in to your account to contact us.\n\nSincerely Shikhman family`
    }

    this.closeBanWindow()
    this.authService.banUser(this.banMemo).subscribe(data => { })

    this.email.content = this.email.content.replace(/\n/g, '<br>')
    this.authService.sendEmail(this.email).subscribe(data => { })



    window.location.reload()


  }

  activeWindow: number = -1

  toggle(i: number){
    const accWindow = document.querySelector(`.acc-${i}`) as HTMLElement
    console.log(i, this.activeWindow)
    
    if(this.activeWindow >= 0){
      if(this.activeWindow === i){ 
        accWindow.style.visibility = 'hidden'
        this.activeWindow = -1
        return
      }

      const actWindow = document.querySelector(`.acc-${this.activeWindow}`) as HTMLElement
      actWindow.style.visibility = 'hidden'
    }
    
    this.activeWindow = i
    accWindow.style.visibility = 'visible'
  }

  closeBanWindow() {
    const banWindow = document.querySelector(".banWindow") as HTMLElement
    const adminWindow = document.querySelector(".adminWindow") as HTMLElement
    banWindow.style.visibility = "hidden"
    adminWindow.style.visibility = "hidden"
  }



  adminRole = ''

  checkAdmin(id: string, role: string) {

    if (id != this.admin) {
      this.setRole(id, role)
      return
    }

    this.adminRole = role
    const adminWindow = document.querySelector(".adminWindow") as HTMLElement
    adminWindow.style.visibility = "visible"

  }

  async removeAdmin() {
    this.authService.setRole(this.admin, this.adminRole).subscribe(data => { })
    window.localStorage.setItem('role', this.adminRole)
    window.location.reload()
  }



  async setRole(id: string, role: string) {

    this.authService.setRole(id, role).subscribe(data => {
      console.log("done")
    })
    window.location.reload()

  }


  ngOnInit(): void {

    this.authService.getUsers().subscribe(data => {
      for (let user of data.users) {
        this.users.push(user)
      }
      this.admin = data.admin
    })

    this.authService.getRequests().subscribe(data => {
      for (let request of data) {
        request['thumbnail'] = request.item.type == 'work' ? request.item.thumbnail.url : request.item.thumbnail
        this.requests.push(request)
      }
    })
  }



}
